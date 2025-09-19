const { default: Stripe } = require("../config/stripe");
const { orderModel } = require("../models/orderModel");
const userModel = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const cashOnDelivery = async (req, res) => {
  try {
    const userId = req.userId;
    const { listItems, deliveryAddressId, subTotalAmt, totalAmt } = req.body;
    if (!listItems || !deliveryAddressId || !subTotalAmt || !totalAmt) {
      return res.json({ success: false, message: "Invalid details" });
    }
    const newOrder = new orderModel({
      userId,
      listItems,
      deliveryAddress:deliveryAddressId,
      subTotalAmt,
      totalAmt,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(
      userId,
      {
        $push: { orderHistory: newOrder._id },
      },
      {
        new: true,
      }
    );
    return res.json({success:true,message:"order is succesful",order:newOrder})
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
const getOrderDetail = async(req,res)=>{
    try{
      const userId = req.userId;
      const user = await userModel.findById(userId).populate("orderHistory")
    
      const orderDetail = user.orderHistory;
      return res.json({success:true,order:orderDetail,message:"order is fetched", user:user, order:orderDetail})
    }catch(err){
       return res.json({success:false,message:err.message})
    }
}
const onlinePayment = async(req,res)=>{
  try{
 const userId = req.userId;
    const { listItems, deliveryAddressId, subTotalAmt, totalAmt } = req.body;
    if (!listItems || !deliveryAddressId || !subTotalAmt || !totalAmt) {
      return res.json({ success: false, message: "Invalid details" });
    }
    // create stripe session
     const line_items = listItems.map((item) => ({
      price_data: {
        currency: "inr", // or "usd"
        product_data: {
          name: item.name, // make sure your listItems contain name
        },
        unit_amount: Math.round(item.price * 100), // amount in paise (₹1 = 100)
      },
      quantity: item.quantity,
    }));

    const params = {
      submit_type:"pay",
      mode:"payment",
      payment_method_types:['card'],
      line_items:line_items,
      success_url:"http://localhost:5173/success",
      cancel_url:"http://localhost:5173/cancel",
    }
    const session = await stripe.checkout.sessions.create(params)
    res.json({id:session.id})
  }catch(err){
    return res.json({success:false,message:err.message})
  }
}
module.exports = { cashOnDelivery,getOrderDetail,onlinePayment};
