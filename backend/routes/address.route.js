

const express = require("express")
const { userAuth } = require("../middleware/userAuth")
const {addAddress, getAddress, removeAddress}= require("../controllers/addressController")
const addressRouter = express.Router()

addressRouter.post("/add",userAuth,addAddress)
addressRouter.get("/all",userAuth,getAddress)
addressRouter.post("/delete",userAuth,removeAddress)




module.exports = addressRouter;