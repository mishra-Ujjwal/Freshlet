import React, { useState } from "react";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";

const EditCategoryModel = ({ close, data }) => {
  const [categoryName, setCategoryName] = useState(data.name || "");
  const [image, setImage] = useState(null); // for new file only
  const [preview, setPreview] = useState(data.image || ""); // old image or new preview
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation: must have categoryName AND (new file or existing image)
    if (!categoryName || (!image && !preview)) {
      toast.error("Please provide a name and an image.");
      return;
    }

    const fd = new FormData();
    fd.append("categoryId", data.id);
    fd.append("categoryName", categoryName);

    if (image) {
      fd.append("image", image);
    } else {
      fd.append("existingImage", preview);
    }

    try {
      setLoading(true);
      const res = await Axios({
        apiName: "editCategory",
        formData: fd,
      });
      setLoading(false);

      if (res.data.success) {
        console.log(res.data.data)
        toast.success("Category edited successfully!");
        close();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Error editing category");
    }
  };

  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-black/30 z-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black mb-6">
            Edit Category
          </h2>
          <div className="-mt-5 cursor-pointer" onClick={close}>
            <IoIosClose size={40} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-black font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Image Upload Box */}
          <div>
            <label className="block text-black font-medium mb-1">
              Category Image
            </label>
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition p-4 h-68 bg-gray-50"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-black">
                  <i className="fa-solid fa-image text-5xl"></i>
                  <p>Click to select image</p>
                  <p className="text-xs text-black-400">PNG, JPG, JPEG</p>
                </div>
              )}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ backgroundColor: "blue" }}
            className="w-full text-white py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditCategoryModel;
