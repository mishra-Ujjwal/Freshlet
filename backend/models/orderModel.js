const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
    },
    orderId:{
     type:String,
     unique:true,
    },
    listItems: [
        {
        productId: { type: mongoose.Schema.ObjectId, ref: "product" },
        },
    ],
    paymentId:{
        type:String,
        default:"",
    },
    paymentStatus:{
        type:String,
        default:""
    },
    deliveryAddress:{
          type:mongoose.Schema.ObjectId,
        ref:"address",
    },
    subTotalAmt:{
        type:Number,
        default:0,
    },
    totalAmt:{
        type:Number,
        default:0,
    },
    invoiceReceipt:{
        type:String,
        default:"",
    }
},{timestamps:true})

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }
  next();
});



const orderModel = mongoose.model("order",orderSchema)
module.exports = {orderModel}