const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
    },
  name: {
    type: String,
    required: [true, "Enter Name"],
  },
  email: {
    type: String,
    required: [true, "Enter Valid Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Enter Password"],
  },
  avatar: {
    type: String,
    default: "",
  },
  mobile: {
    type: Number,
    default: null,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  verifyEmail: {
    type: Boolean,
    default: false,
  },
  verifyEmailOtp:{
    type:String,
    default:"",
  },
  lastLoginDate: {
    type: Date,
    default: "",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },
  addressDetails: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "address", //collection name
    },
],
  shoppingCart: [{
    type: mongoose.Schema.ObjectId,
    ref:"cartProduct",
  }],
  orderHistory:[{
    type: mongoose.Schema.ObjectId,
    ref:"order",
  }],
  forgetPasswordOtp:{
    type:String,
    default:"",
  },
  forgetPasswordExpiry:{
    type:Date,
    default:"",
  },
  role:{
    type:String,
    enum:["ADMIN","USER"],
    default:"USER",
  }
},{
    timestamps:true,
});

const userModel = mongoose.model("user",userSchema)
module.exports=userModel