import mongoose,{Schema} from "mongoose";
import { addressSchema } from "./user.model.js";

const menuSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        default:null
    }
});


const restaurantSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
   menu:[menuSchema],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    address:{
        type:addressSchema,
        required:true,
    },
    phoneNumber:{
        type:String,
        unique:true,
        default:null
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],    
},{timestamps:true})

export const Restaurant = mongoose.model("Restaurant",restaurantSchema);