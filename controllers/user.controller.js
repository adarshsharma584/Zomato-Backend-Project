import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (user) => {

    const accessToken = await user.generateAccessToken();
    const refreshToken = await  user.generateRefreshToken();
    
    return {accessToken,refreshToken};
}

const registerUser = async (req,res) => {
    try {
        const {fullName,email,password,phoneNumber,address} = req.body;
        if(!fullName || !email ||!password ||!phoneNumber ||!address){
            res.status(400).json({message:"All fields are required"})
        }
        const existedUser = await User.findOne({email});
        if(existedUser){
            res.status(400).json({message:"User already exists"})
        }

        const user = await User.create({fullName,email,password,phoneNumber,address});
        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user);
         user.refreshToken = refreshToken;
         await user.save();

         const createdUser = await User.find({email}).select("-password");
         if(!createdUser){
            res.status(400).json({message:"User not found"})
         }
         res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            
         })
         res.status(201).json({
            message:"user created successfully",
            res:createdUser,
            accessToken
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const login = async ( req,res) => {
    const {fullName,email,phoneNumber,password,address} = req.body;

    if(!fullName || !email || !password || !phoneNumber || !address){
        res.status(400).json({message:"All fields are required"})
    }

    const existedUser = await User.findOne({email});
    if(!existedUser){
        res.status(400).json({message:"User not found"})
    }

    const isPasswordMatched = await existedUser.comparePassword(password);
    if(!isPasswordMatched){
        res.status(400).json({message:"Invalid password"})
    }


    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existedUser);
    existedUser.refreshToken = refreshToken;
    await existedUser.save();

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
    res.status(200).json({
        message:"user logged in successfully",
        res:existedUser,
        accessToken
    })
}
 const logout = async (req,res) => {
    try {
        const userId = res.user.id;

        if(!userId){
            res.status(400).json({message:"User not found"})
        }
        const existedUser = await User.findByIdAndUpdate(userId,{refreshToken:""},{new:true});

       
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
            sameSite:"none",
        })
        res.status(200).json({message:"user logged out successfully",res:existedUser})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
 }
export  {registerUser,login,logout};