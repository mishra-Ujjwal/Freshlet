const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    images: {
      type: Array,
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategoryId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    moreDetails: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
module.exports = { productModel };
