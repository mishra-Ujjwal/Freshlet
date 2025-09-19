const mongoose = require("mongoose");
const addressSchema = mongoose.Schema({
    addressLine:{
        type:String,
        default:"",
    },
    city:{
        type:String,
        default:"",

    },
    state:{
        type:String,
        default:"",
    },
    pincode:{
        type:String,
        default:"",

    },
    country:{
        type:String,
        default:"",

    },
    mobile:{
        type:Number,
        default:null,
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const addressModel = mongoose.model("address",addressSchema)
module.exports = {addressModel}