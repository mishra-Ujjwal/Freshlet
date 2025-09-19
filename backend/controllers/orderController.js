const { default: Stripe } = require("../config/stripe");
const { orderModel } = require("../models/orderModel");
const userModel = require("../models/userModel");
const { clearCart } = require("./cartController");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const cashOnDelivery = async (req, res) => {
  try {
    const userId = req.userId;
    const { listItems, deliveryAddressId, subTotalAmt, totalAmt, paymentMethod = 'cash_on_delivery' } = req.body;
    if (!listItems || !deliveryAddressId || !subTotalAmt || !totalAmt) {
      return res.json({ success: false, message: "Invalid details" });
    }
    const newOrder = new orderModel({
      userId,
      listItems,
      deliveryAddress:deliveryAddressId,
      subTotalAmt,
      totalAmt,
      paymentMethod,
      paymentStatus: 'completed' // COD is always completed
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
    
    // Clear the cart after successful order
    const cartClearResult = await clearCart(userId);
    if (!cartClearResult.success) {
      console.error("Failed to clear cart:", cartClearResult.message);
      // Don't fail the order if cart clearing fails, just log it
    }
    
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
    const { listItems, deliveryAddressId, subTotalAmt, totalAmt, paymentMethod = 'stripe' } = req.body;
    if (!listItems || !deliveryAddressId || !subTotalAmt || !totalAmt) {
      return res.json({ success: false, message: "Invalid details" });
    }
    
    // Create order first (but don't save to user's order history yet)
    const newOrder = new orderModel({
      userId,
      listItems,
      deliveryAddress: deliveryAddressId,
      subTotalAmt,
      totalAmt,
      paymentMethod,
      paymentStatus: 'pending'
    });
    await newOrder.save();
    
    if (paymentMethod === 'stripe') {
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
        success_url:`http://localhost:5173/success?orderId=${newOrder._id}`,
        cancel_url:"http://localhost:5173/cancel",
        metadata: {
          orderId: newOrder._id.toString(),
          userId: userId
        }
      }
      const session = await stripe.checkout.sessions.create(params)
      res.json({id:session.id, paymentMethod: 'stripe'})
    } else if (paymentMethod === 'razorpay') {
      // Razorpay integration
      const razorpay = require('razorpay');
      const instance = new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Math.round(totalAmt * 100), // amount in paise
        currency: "INR",
        receipt: newOrder.orderId,
        notes: {
          orderId: newOrder._id.toString(),
          userId: userId
        }
      };

      const order = await instance.orders.create(options);
      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentMethod: 'razorpay'
      });
    } else {
      return res.json({ success: false, message: "Unsupported payment method" });
    }
  }catch(err){
    return res.json({success:false,message:err.message})
  }
}

// Handle successful payment and clear cart
const handlePaymentSuccess = async (req, res) => {
  try {
    const { orderId, paymentMethod = 'stripe', razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const userId = req.userId;
    
    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }
    
    // Verify Razorpay payment if payment method is razorpay
    if (paymentMethod === 'razorpay') {
      const crypto = require('crypto');
      const razorpay = require('razorpay');
      
      const instance = new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      
      // Verify the payment signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
      
      if (generatedSignature !== razorpaySignature) {
        return res.json({ success: false, message: "Invalid payment signature" });
      }
    }
    
    // Update order status to completed
    const updateData = { 
      paymentStatus: 'completed',
      paymentId: paymentMethod === 'razorpay' ? razorpayPaymentId : undefined
    };
    
    await orderModel.findByIdAndUpdate(orderId, updateData);
    
    // Add to user's order history
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { orderHistory: orderId } },
      { new: true }
    );
    
    // Clear the cart after successful payment
    const cartClearResult = await clearCart(userId);
    if (!cartClearResult.success) {
      console.error("Failed to clear cart:", cartClearResult.message);
    }
    
    return res.json({ 
      success: true, 
      message: "Payment successful and cart cleared",
      orderId: orderId,
      paymentMethod: paymentMethod
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Get available payment methods
const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'cash_on_delivery',
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: '💰',
        available: true
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Pay with credit/debit card',
        icon: '💳',
        available: !!process.env.STRIPE_SECRET_KEY
      },
      {
        id: 'razorpay',
        name: 'Razorpay',
        description: 'Pay with UPI, cards, wallets',
        icon: '🏦',
        available: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
      }
    ];
    
    res.json({
      success: true,
      paymentMethods: paymentMethods.filter(method => method.available)
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
module.exports = { cashOnDelivery, getOrderDetail, onlinePayment, handlePaymentSuccess, getPaymentMethods };
