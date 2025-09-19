const express = require("express");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");
const { categoryModel } = require("../models/categoryModel");
const { getCategoryData, editCategory, deleteCategory, getProductData, deleteProduct, searchProduct, productListItem } = require("../controllers/category.controller");
const { userAuth } = require("../middleware/userAuth");
const { productModel } = require("../models/productModel"); 
const fs = require("fs");

const router = express.Router();

/** ---------------- CATEGORY ---------------- **/
router.post("/add-category", userAuth, upload.single("image"), async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || !req.file) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories" });

    const newCategory = new categoryModel({
      name: categoryName,
      image: result.secure_url,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/all", getCategoryData);
router.put("/edit", userAuth, upload.single("image"), editCategory);
router.delete("/delete", userAuth, deleteCategory);

/** ---------------- PRODUCT ---------------- **/
router.post("/upload-product", userAuth, upload.array("images", 4), async (req, res) => {
  try {
    const { name, unit, stock, price, discount, description, moreDetails, category } = req.body;

    if (!name || !unit || !stock || !price || !req.files) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    let uploadedUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
      uploadedUrls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    const newProduct = new productModel({
      name,
      unit,
      stock,
      price,
      discount,
      description,
      moreDetails,
      category,
      images: uploadedUrls,
    });

    await newProduct.save();

    return res.json({
      success: true,
      message: "Product uploaded successfully",
      data: newProduct,
    });
  } catch (err) {
    console.error("Error uploading product:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

router.get("/allproduct",getProductData)
router.delete("/deleteProduct",userAuth,deleteProduct)
router.get("/product/search",searchProduct)
router.get("/:categoryId", productListItem)
module.exports = router;
