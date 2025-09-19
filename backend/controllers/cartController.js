const { cartProductModel } = require("../models/cartProductModel");
const userModel = require("../models/userModel");

const addInCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.json({ success: false, message: "Product cannot be empty" });
    }
    if (!userId) {
      return res.json({ success: false, message: "User must be logged in" });
    }

    let existingCartItem = await cartProductModel.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      await userModel.updateOne(
        { _id: userId },
        { $addToSet: { shoppingCart: existingCartItem._id } }
      );
      const updatedCart = await cartProductModel
        .find({ userId })
        .populate("productId");
      return res.json({
        success: true,
        message: "Product quantity updated",
        cartItem: updatedCart,
      });
    }

    const newItem = new cartProductModel({
      userId,
      productId,
      quantity: 1,
    });

    await newItem.save();
    await userModel.updateOne(
      { _id: userId },
      { $addToSet: { shoppingCart: newItem._id } }
    );
    const updatedCart = await cartProductModel
      .find({ userId })
      .populate("productId");

    return res.json({
      success: true,
      cartItem: updatedCart,
      message: "Product added to cart",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const removeInCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.json({ success: false, message: "Product cannot be empty" });
    }
    if (!userId) {
      return res.json({ success: false, message: "User must be logged in" });
    }
    const existingCartItem = await cartProductModel.findOne({
      productId,
      userId,
    });
    if (!existingCartItem) {
      return res.json({ success: false, message: "Item not found in cart" });
    }
    if (existingCartItem.quantity > 1) {
      existingCartItem.quantity -= 1;
      await existingCartItem.save();
      const updatedCart = await cartProductModel
        .find({ userId })
        .populate("productId");
      return res.json({
        success: true,
        message: "quantity Decreased",
        cartItem: updatedCart,
      });
    } else {
      await existingCartItem.deleteOne();
      await userModel.updateOne(
        { _id: userId },
        { $pull: { shoppingCart: existingCartItem._id } }
      );
      const updatedCart = await cartProductModel
        .find({ userId })
        .populate("productId");
      return res.json({
        success: true,
        message: "Product removed from cart",
        cartItem: updatedCart,
      });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const getCartAll = async (req, res) => {
  try {
    const userId = req.userId;
    const existingCartItem = await cartProductModel.find({ userId }).populate("productId");
    return res.json({ success: true, cartItem: existingCartItem });
  } catch (err) {
    return res.json({success:false,message:err.message})
  }
};

module.exports = { addInCart, removeInCart,getCartAll };
