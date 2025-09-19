const {addressModel} = require("../models/adressModel");
const userModel = require("../models/userModel");

const addAddress = async(req,res)=>{
    try{
        const userId = req.userId;
    const {addressLine,city,state,pincode,country,mobile}=req.body;
    if(!addressLine || !city ||!state ||!pincode ||!country ||!mobile){
        return res.json({success:false,message:"All fields are Required"})
    }
    const newAddress = await addressModel.create({
        userId,addressLine,city,state,pincode,country,mobile
    })
    newAddress.save();
    //push to address detail to user 
    await userModel.findByIdAndUpdate(userId,{
        $push:{ addressDetails: newAddress._id}
    })
    return res.json({success:true,message:"new Address is saved",address:newAddress})
    }catch(err){
       console.log(err.message)
    }
}
const removeAddress = async(req,res)=>{
    try{
      const userId = req.userId;
      const {addressId} = req.body;
    if(!addressId){
        res.json({success:false,message:"address id is required"})
    }
    const removed = await addressModel.findOneAndDelete({_id:addressId,userId})
    if(!removed){
        res.json({success:false,message:"Address not found"})
    }
    // pull from user details
    await userModel.findByIdAndUpdate(userId,{
        $pull:{addressDetails:addressId}
    })
    return res.json({success:true,message:"Address is removed"})
    }catch(err){
        return res.json({success:false,message:err.message})
    }
}
const getAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const data = await userModel.findById(userId).populate("addressDetails");

    if (!data) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      addresses: data.addressDetails, // only addresses
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
module.exports={ addAddress,removeAddress,getAddress }