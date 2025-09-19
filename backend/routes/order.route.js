const express = require("express")
const { userAuth } = require("../middleware/userAuth")
const { cashOnDelivery, getOrderDetail, onlinePayment, handlePaymentSuccess, getPaymentMethods } = require("../controllers/orderController")
const orderRouter = express.Router()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
orderRouter.post("/newOrder",userAuth,cashOnDelivery)
orderRouter.get("/all",userAuth,getOrderDetail)
orderRouter.post("/online-payment",userAuth,onlinePayment)
orderRouter.post("/payment-success",userAuth,handlePaymentSuccess)
orderRouter.get("/payment-methods",getPaymentMethods)

module.exports = orderRouter;