const express = require("express")
const { userAuth } = require("../middleware/userAuth")
const { cashOnDelivery, getOrderDetail, onlinePayment } = require("../controllers/orderController")
const orderRouter = express.Router()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
orderRouter.post("/newOrder",userAuth,cashOnDelivery)
orderRouter.get("/all",userAuth,getOrderDetail)
orderRouter.get("/online-payment",userAuth,onlinePayment)

module.exports = orderRouter;