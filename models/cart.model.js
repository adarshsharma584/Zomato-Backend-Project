import mongoose,{Schema} from "mongoose";

const cartSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    foodItems:[{
        type:Schema.Types.ObjectId,
        ref:"FoodItem"
    }],
    quantity:{
        type:Number,
        required:true
    },
    restaurant:{
        type:Schema.Types.ObjectId,
        ref:"Restaurant"
    },
    totalAmount:{
        type:Number,
        required:true
    }
},{timestamps:true})

export const Cart = mongoose.model("Cart",cartSchema);
