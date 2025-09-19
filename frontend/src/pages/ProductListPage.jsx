import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { handleAddItemCart } from "../store/cartSlice";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";

const ProductListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const allProduct = useSelector((state) => state.product.product);
  // access redux data
  const allCategoryData = useSelector((state) => state.product.allCategory);
  const cart = useSelector((state) => state.cartItem.cart);
  const products = allProduct.filter(
    (product) => String(product.category) === String(categoryId)
  );
  console.log(products);
  // find category by id
  const category = allCategoryData.find((cat) => cat._id === categoryId);
  console.log(category);
  // Get quantity from cart instead of local state
  const getQuantity = (id) => {
    const item = cart.find(
      (c) => c.productId?._id === id || c.productId === id
    );
    return item ? item.quantity : 0;
  };

  const increaseCount = async (idx) => {
    const product = products[idx];
    if (!product) return;
    
    try {
      console.log("increase" + idx);
      const res = await Axios({
        apiName: "addCartItem",
        formData: { productId: product._id },
      });
      if (res.data.success) {
        dispatch(handleAddItemCart(res.data.cartItem));
        toast.success("Item added to cart");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to add item to cart");
    }
  };

  const decreaseCount = async (idx) => {
    const product = products[idx];
    if (!product) return;
    
    try {
      const res = await Axios({
        apiName: "removeCartItem",
        formData: { productId: product._id },
      });
      if (res.data.success) {
        dispatch(handleAddItemCart(res.data.cartItem));
        toast.success("Item removed from cart");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to remove item from cart");
    }
  };

  const displayProduct=(id)=>{
    navigate(`./product/${id}`)
    console.log(products._id);
  }
  return (
    <section className="flex sm:gap-6 gap-1 md:gap-10 min-h-screen">
      {/* Left Sidebar */}
      <div className="
    sm:w-[15%] w-full 
    sm:p-6 p-1 
    lg:border-r border-gray-300
    sm:fixed sm:top-20 sm:h-[calc(100vh-5rem)] 
    overflow-y-auto 
    bg-white
  ">
        <h2 className="sm:text-3xl text-xl pb-4">Category</h2>
        {category ? (
          <div className="flex flex-col gap-2 items-center">
          <div className="border rounded-2xl overflow-hidden w-1/2 ">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          <div className="border rounded-2xl overflow-hidden w-1/2">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          <div className="border rounded-2xl overflow-hidden w-1/2 ">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          <div className="border rounded-2xl overflow-hidden w-1/2 ">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          <div className="border rounded-2xl overflow-hidden w-1/2 ">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          <div className="border rounded-2xl overflow-hidden w-1/2 ">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          <div className="border rounded-2xl overflow-hidden w-1/2 ">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          <div className="border rounded-2xl overflow-hidden w-1/2 ">
            <img
              src={category.image}
              alt={category.name}
              className="h-auto object-cover "
            />
          </div>
          </div>
           
        ) : (
          <p className="text-gray-500">Loading category...</p>
        )}
      </div>

      {/* Right Product Grid */}
      <div className=" w-70  ml-50 flex-1 grid sm:grid-cols-3 grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-4 px-2 pt-10 sm:p-4">
        {products.map((product, idx) => (
          <div
            key={idx}
            onClick={(e)=>{displayProduct(product._id);}}
            className="p-2 px-4 bg-white flex flex-col items-center cursor-pointer rounded-lg"
          >
            <img src={product.images} alt={product.name} className="w-34" />
            <div className="h-15 text-start w-full">
              <h2 className="text-start text-xl font-normal pt-2 w-full leading-none line-clamp-2">
                {product.name}
              </h2>
              <p className="text-start w-full">{product.unit}</p>
            </div>

            <div className="pt-3 flex w-full items-center justify-between">
              <p className="font-semibold text-md sm:text-lg w-full text-start">
                Rs.{product.price}
              </p>

              {getQuantity(product._id) === 0 ? (
                <div
                  onClick={(e) => {increaseCount(idx);e.stopPropagation();}}
                  className="px-3 w-1/2 text-center py-2 border rounded-lg cursor-pointer text-green-500 bg-green-50 font-medium border-green-400"
                >
                  Add
                </div>
              ) : (
                <div className="md:px-3 sm:px-2 px-1.5 py-1 border rounded-lg cursor-pointer w-full sm:w-1/2 text-white bg-green-700 font-medium flex items-center justify-between sm:gap-2 gap-1 md:gap-3" >
                  <p className="text-lg" onClick={(e) => {decreaseCount(idx);e.stopPropagation();}}>
                    -
                  </p>
                  <p className="text-md sm:text-lg cursor-default">{getQuantity(product._id)}</p>
                  <p className="text-lg" onClick={(e) => {increaseCount(idx);e.stopPropagation();}}>
                    +
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductListPage;
