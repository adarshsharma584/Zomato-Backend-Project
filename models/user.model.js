import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const addressSchema = new Schema({
    street:{
        type:String,
        required:true,
        trim:true,
    },
    city:{
        type:String,
        required:true,
        trim:true,
    },
    state:{
        type:String,
        required:true,
        trim:true,
    },
    pincode:{
        type:String,
        required:true,
        trim:true,
    },
    country:{
        type:String,
        required:true,
        trim:true,
    }
});

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    phoneNumber:{
        type:String,
        unique:true,
        default:null
    },
    profilePicture:{
        type:String,
        default:null
    },
    address:{
        type:addressSchema,
        required:true,
        
    },
    role:{
        type:String,
        enum:["user","restaurantOwner","deliveryPartner","admin"],
        default:"user"
    },
    refreshToken:{
        type:String,
        default:null,
        select:false
    }
},{timestamps:true})

userSchema.pre("save",async function () {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
});
userSchema.methods.comparePassword = async function (password) {
   return await bcrypt.compare(password,this.password)

}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({id:this._id,role:this.role,fullName:this.fullName,email:this.email},process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn:"1d"})
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({id:this._id,role:this.role,fullName:this.fullName,email:this.email},process.env.JWT_REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
}

export const User = mongoose.model("User",userSchema);
