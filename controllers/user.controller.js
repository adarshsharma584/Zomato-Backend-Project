import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (user) => {

    const accessToken = await user.generateAccessToken();
    const refreshToken = await  user.generateRefreshToken();
    
    return {accessToken,refreshToken};
}

const registerUser = async (req,res) => {
    try {
        const {fullName,email,password,phoneNumber,profilePicture} = req.body;
        if(!fullName || !email ||!password ||!phoneNumber ||!profilePicture){
            return res.status(400).json({message:"All fields are required"})
        }
        const existedUser = await User.findOne({email});
        if(existedUser){
            return res.status(400).json({message:"User already exists"})
        }

        const user = await User.create({fullName,email,password,phoneNumber,profilePicture});
        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user);
         user.refreshToken = refreshToken;
         await user.save();

         const createdUser = await User.find({email}).select("-password");
         if(!createdUser){
            return res.status(400).json({message:"User not found"})
         }
         res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            
         })
         return res.status(201).json({
            message:"user created successfully",
            res:createdUser,
            accessToken
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

    
const login = async ( req,res) => {
    const {email,password} = req.body;

    if(!email || !password ){
        return res.status(400).json({message:"invalid credentials"})
    }

    const existedUser = await User.findOne({email});
    if(!existedUser){
        return res.status(400).json({message:"User not found"})
    }

    const isPasswordMatched = await existedUser.comparePassword(password);
    if(!isPasswordMatched){
        return res.status(400).json({message:"Invalid password"})
    }


    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existedUser);
    existedUser.refreshToken = refreshToken;
    await existedUser.save();

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
    return res.status(200).json({
        message:"user logged in successfully",
        res:existedUser,
        accessToken
    })
}

 const logout = async (req,res) => {
    try {
        const userId = res.user.id;

        if(!userId){
            return res.status(400).json({message:"User not found"})
        }
        const existedUser = await User.findByIdAndUpdate(userId,{refreshToken:""},{new:true});

       
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
            sameSite:"none",
        })
       return res.status(200).json({message:"user logged out successfully",res:existedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }

 const getUserProfile = async (req,res) => {
    try {
        const userId = res.user.id;
        if(!userId){
            return res.status(400).json({message:"User not found"})
        }
        const existedUser = await User.findById(userId).select("-password");
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User profile fetched successfully",res:existedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }

 const updateUserProfile = async (req,res) => {
    try {
        const userId = res.user.id;
        const {fullName, email,phoneNumber} = req.body;
        if(!fullName || !email || !phoneNumber){
            return res.status(400).json({message:"All fields are required"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{fullName, email,phoneNumber},{new:true}).select("-password");
        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User profile updated successfully",res:updatedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }

 const updatePassword = async (req,res) => {
    try {
        const userId = res.user.id;
        const {currentPassword,password} = req.body;
        if(!userId){
            return res.status(400).json({
                message:"User not found",
            })
        }
        if(!password || !currentPassword){
            return res.status(400).json({message:"Password is required"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const isPasswordMatched = await existedUser.comparePassword(currentPassword);
        if(!isPasswordMatched){
            return res.status(400).json({message:"Invalid password"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{password},{new:true}).select("-password");
        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User password updated successfully",res:updatedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }

 const updateProfilePicture = async (req,res) => {
    try {
        const userId = res.user.id;
        const {profilePicture} = req.body;
        if(!userId){
            return res.status(400).json({
                message:"User not found",
            })
        }
        if(!profilePicture){
            return res.status(400).json({message:"Profile picture is required"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePicture},{new:true}).select("-password");
        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User profile picture updated successfully",res:updatedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }
const addAddress = async (req,res)=>{
    try {
        const userId = res.user.id;
        const {street,city,state,pincode,country} = req.body;
        if(!userId){
            return res.status(400).json({message:"User not found"})
        }
        if(!street || !city || !state || !pincode || !country){
            return res.status(400).json({message:"All fields are required"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{address:{street,city,state,pincode,country}},{new:true}).select("-password");
        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User address added successfully",res:updatedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
 const changeAddress = async (req,res)=>{
    try {
        const userId = res.user.id;
        const {street,city,state,pincode,country} = req.body;
        if(!userId){
            return res.status(400).json({message:"User not found"})
        }
        if(!street || !city || !state || !pincode || !country){
            return res.status(400).json({message:"All fields are required"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{address:{street,city,state,pincode,country}},{new:true}).select("-password");
        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User address updated successfully",res:updatedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }

 const deleteAddress = async (req,res)=>{
    try {
        const userId = res.user.id;
        if(!userId){
            return res.status(400).json({message:"User not found"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{address:null},{new:true}).select("-password");
        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User address deleted successfully",res:updatedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }
 const deleteProfilePicture = async (req,res)=>{
    try {
        const userId = res.user.id;
        if(!userId){
            return res.status(400).json({message:"User not found"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePicture:null},{new:true}).select("-password");
        if(!updatedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User profile picture deleted successfully",res:updatedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }

 const deleteUserProfile = async (req,res)=>{
    try {
        const userId = res.user.id;
        if(!userId){
            return res.status(400).json({message:"User not found"})
        }
        const existedUser = await User.findById(userId);
        if(!existedUser){
            return res.status(400).json({message:"User not found"})
        }
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            return res.status(400).json({message:"User not found"})
        }
       return res.status(200).json({message:"User profile deleted successfully",res:deletedUser})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
 }

export  {registerUser,login,logout,getUserProfile,updateUserProfile,updatePassword,updateProfilePicture,addAddress,changeAddress,deleteAddress,deleteProfilePicture,deleteUserProfile};