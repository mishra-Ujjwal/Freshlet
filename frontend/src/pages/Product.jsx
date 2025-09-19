import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";
import { setProduct } from "../store/productSlice";
import axios from "axios";

const Product = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const productData = useSelector((state) => state.product.product);
  console.log(productData)
  // ✅ fetch products (all or searched)
  const fetchUploadData = async (searchQuery = "") => {
    try {
      let res;
      if (searchQuery) {
        res = await axios.get(
          `http://localhost:4000/category/product/search?query=${searchQuery}`
        );
        if (res.data.success) {
          dispatch(setProduct(res.data.results));
        }
      } else {
        res = await Axios({ apiName: "getProductData" });
        if (res.data.success) {
          dispatch(setProduct(res.data.data));
        }
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  // ✅ load all products on mount
  useEffect(() => {
    fetchUploadData();
  }, []);

  // ✅ delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await Axios({
        apiName: "deleteProduct",
        formData: { _id: id },
      });
      if (res.data.success) {
        toast.success("Product deleted");
        fetchUploadData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // ✅ search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      fetchUploadData(); // reload all if empty
    } else {
      fetchUploadData(value); // call search API
    }
  };

  return (
    <section className="p-4">
      
      <div className="pb-4 flex justify-between items-center w-full">
        <h2 className="text-3xl font-medium">Product</h2>
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          value={query}
          onChange={handleSearch}
          className="border p-2 rounded"
        />
      </div>
      {productData.length === 0 && (
  <div className="text-gray-500 w-full text-center py-10">
    {query.trim() ? (
      "No results found for your search."
    ) : (
      <NoData />
    )}
  </div>
)}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 -ml-3">
        {productData.map((product) => (
          <div
            key={product._id}
            className="flex flex-col items-center bg-gray-100 shadow-md rounded-lg p-3 w-[180px] sm:w-[180px]"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-[180px] h-[180px] object-cover rounded-lg"
            />
            <p className="mt-2 text-lg font-bold text-center">{product.name}</p>
            <p>{product.stock} unit</p>
            <div className="flex gap-2 mt-2">
              <div
                onClick={() => handleDelete(product._id)}
                style={{ backgroundColor: "#FE4545" }}
                className="px-3 py-1 rounded-lg shadow-sm border cursor-pointer text-white border-none"
              >
                Delete
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Product;
