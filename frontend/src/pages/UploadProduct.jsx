import React, { useEffect, useRef, useState } from "react";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UploadProduct = () => {
  const allCategory = useSelector((state) => state.product.allCategory);

  console.log(allCategory);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    images: [], // array of selected files
    category: "",
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    moreDetails: "",
  });
  const fileInputRef = useRef(null);
  // Handle text/number/textarea input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle multiple image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Merge existing + new
    const newImages = [...formData.images, ...files];

    // Limit to 4
    if (newImages.length > 4) {
      alert("You can upload a maximum of 4 images.");
    }

    setFormData({
      ...formData,
      images: newImages.slice(0, 4), // take only first 4
    });
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  // Open hidden file input when add button clicked
  const handleAddClick = () => {
    if (formData.images.length < 4) {
      fileInputRef.current.click();
    } else {
      alert("Maximum 4 images allowed.");
    }
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }
    e.preventDefault();
    // send to backend API (convert to FormData for files)
    try {
      // create FormData object for sending files
      const data = new FormData();

      // append text fields
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("unit", formData.unit);
      data.append("stock", formData.stock);
      data.append("price", formData.price);
      data.append("discount", formData.discount);
      data.append("description", formData.description);
      data.append("moreDetails", formData.moreDetails);
      console.log(formData);
      // append multiple images
      formData.images.forEach((img) => {
        data.append("images", img); // backend multer should expect "images"
      });
      const res = await Axios({ apiName: "uploadProduct", formData: data });
      console.log(res);
      if (res.data.success) {
        toast.success("Product uploaded successfully!");
        setLoading(false);
        setFormData({
          name: "",
          images: [], // array of selected files
          category: "",
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          moreDetails: "",
        });
      }
      console.log("Product Data:", formData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 outline-none"
          />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          {/* Multiple Images */}
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-3 border rounded-lg bg-gray-50"
          />

          {/* Preview Section */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {formData.images.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-34 h-34 object-cover rounded-lg bg-red-500 shadow"
                  />
                  <button
                    type="button"
                    style={{ padding: "1px 5px", color: "red", border: "50%" }}
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-5 bg-red-600  text-red rounded-full  text-xs opacity-80 group-hover:opacity-100 bg-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Add Image Button */}
          <div
            onClick={handleAddClick}
            className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <span className="text-gray-500 text-2xl">+</span>
          </div>
          {/* select category */}
          <div className="grid gap-1">
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">-- Select Category --</option>
              {allCategory.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <input
            type="text"
            name="unit"
            placeholder="Unit (e.g. 1kg, 500ml)"
            value={formData.unit}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 outline-none"
          />

          {/* Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Stock Available"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 outline-none"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 outline-none"
          />

          {/* Discount */}
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={formData.discount}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 outline-none"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Short Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 outline-none"
          ></textarea>

          {/* More Details */}
          <textarea
            name="moreDetails"
            placeholder="More Details"
            value={formData.moreDetails}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 outline-none"
          ></textarea>

          {/* Submit */}
          <button
            type="submit"
            style={{ backgroundColor: "green" }}
            className="w-full text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            {loading ? "Uploading...." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
