const { categoryModel } = require("../models/categoryModel");
const { productModel } = require("../models/productModel");
const { subCategoryModel } = require("../models/subCategoryModel");

const getCategoryData = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: categories,
      message: "categroies data is fetched",
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "something went wrong" });
  }
};
const editCategory = async (req, res) => {
  try {
    let { _id, name, image } = req.body;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const updateData = { name };
    if (image) {
      updateData.image = image;
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Updated Successfully",
      data: updatedCategory,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "something went wrong in edit",
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { _id } = req.body; // will come from frontend

    if (!_id) {
      return res.json({ success: false, message: "Category ID is required" });
    }
    // Check if category is used in subcategories
    const checkSubCategory = await subCategoryModel.countDocuments({
      categoryId: { $in: [_id] },
    });

    // Check if category is used in products
    const checkProduct = await productModel.countDocuments({
       category: { $in: [_id] },
    });

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res.json({
        success: false,
        message: "Category is used and cannot be deleted",
      });
    }
    await categoryModel.deleteOne({ _id });

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};
const getProductData = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: products,
      message: "product data is fetched",
    });
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { _id } = req.body; // will come from frontend

    if (!_id) {
      return res.json({ success: false, message: "Product ID is required" });
    }
    await productModel.deleteOne({ _id });

    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};
const searchProduct = async (req, res) => {
  try {
    const { query } = req.query; // from frontend input

    if (!query) {
      return res.json({ success: false, message: "Search query required" });
    }

    // case-insensitive search using regex
    const results = await productModel.find({
      name: { $regex: query, $options: "i" },
    });

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const productListItem = async (req, res) => {
  try {
    const { categoryId } = req.params;

    console.log("CategoryId param:", categoryId); // 👀 debug

    const products = await productModel
      .find()
      .populate("category");

    return res.json({ success: true, products });
  } catch (err) {
    console.error("Error in productListItem:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
 
const searchPage = async(req,res)=>{
  try{
    const {search,page,limit}=req.body;
    if(!page){
      page=1;
    }
    if(!limit){
      limit=10;
    }
    const query=search ?{

    }:{}
  }catch(err){
    res.json({success:false,message:err.message})
  }
}

module.exports = {
  getCategoryData,
  editCategory,
  deleteCategory,
  getProductData,
  deleteProduct,
  searchProduct,
  productListItem,
};
