import mongoose,{Schema} from "mongoose";

const foodItemSchema = new Schema(
   {
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
   },{timestamps:true}
)

export const FoodItem = mongoose.model("FoodItem",foodItemSchema);