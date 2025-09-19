const mongoose = require("mongoose");
const cartProductSchema = mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:"product",
    },
    quantity:{
        type:Number,
        default:1
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
    }
},{timestamps:true})

// Add database indexes for performance
cartProductSchema.index({ userId: 1, productId: 1 }); // Compound index for cart operations
cartProductSchema.index({ userId: 1 }); // For fetching user's cart

const cartProductModel = mongoose.model("cartProduct",cartProductSchema)
module.exports = {cartProductModel}