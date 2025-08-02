import mongoose,{Schema} from "mongoose";
import { addressSchema } from "./user.model.js";



const restaurantSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
   foodItems:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"FoodItem"
   }],
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