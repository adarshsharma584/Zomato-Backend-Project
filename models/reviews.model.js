import mongoose,{Schema} from "mongoose";
import { User } from "./user.model.js";
import { Restaurant } from "./restaurant.model.js";

const reviewSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    restaurant:{
        type:Schema.Types.ObjectId,
        ref:"Restaurant"
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Review = mongoose.model("Review",reviewSchema);
