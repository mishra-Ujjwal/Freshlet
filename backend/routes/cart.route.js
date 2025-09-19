const express = require("express");
const { addInCart, removeInCart, getCartAll } = require("../controllers/cartController");
const { userAuth } = require("../middleware/userAuth");

const cartRouter = express.Router();

cartRouter.post("/add", userAuth, addInCart);
cartRouter.post("/remove",userAuth,removeInCart)
cartRouter.get("/allCartItem",userAuth,getCartAll)

module.exports = cartRouter;
