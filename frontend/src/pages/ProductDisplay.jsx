import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { handleAddItemCart } from "../store/cartSlice";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";

const ProductDisplay = () => {
  const { productId } = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  
  // Redux state
  const allProduct = useSelector((state) => state.product.product);
  const allCategory = useSelector((state) => state.product.allCategory);
  const cart = useSelector((state) => state.cartItem.cart);

  // Find current product
  const product = allProduct.find((p) => p._id === productId);

  // Capitalize helper
  const capitalizeFirst = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  // Main product quantity - get from cart instead of local state
  const getQuantity = (id) => {
    const item = cart.find(
      (c) => c.productId?._id === id || c.productId === id
    );
    return item ? item.quantity : 0;
  };
  
  const quantity = getQuantity(productId);
  
  const incQuantity = async () => {
    try {
      const res = await Axios({
        apiName: "addCartItem",
        formData: { productId: productId },
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
  
  const decQuantity = async () => {
    try {
      const res = await Axios({
        apiName: "removeCartItem",
        formData: { productId: productId },
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

  // Related products (top 10 in same category)
  const topProduct = product
    ? allProduct.filter((p) => p.category === product.category).slice(0, 5)
    : [];

  // Get quantity from cart instead of local state
  const getCount = (id) => {
    const item = cart.find(
      (c) => c.productId?._id === id || c.productId === id
    );
    return item ? item.quantity : 0;
  };
  
  const increaseCount = async (id) => {
    try {
      const res = await Axios({
        apiName: "addCartItem",
        formData: { productId: id },
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

  const decreaseCount = async (id) => {
    try {
      const res = await Axios({
        apiName: "removeCartItem",
        formData: { productId: id },
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

  if (!product) {
    return <h2>Product not found 😞</h2>;
  }

  const category = allCategory.find((cat) => cat._id === product.category);

  // sliding window
  const displayProduct=(item)=>{
    navigate(`/products/${item.category}/product/${item._id}`);
  }

  return (
    <section className="bg-white w-screen">
      {/* Product details */}
      <div className="grid grid-cols-2 border-t border-gray-400">
        {/* Left Image */}
        <div className="border-r border-b border-gray-400">
          <img
            src={product.images}
            className="w-full h-full -mt-10 bg-green-500"
            alt={product.name}
          />
        </div>

        {/* Right Info */}
        <div className="border-b border-gray-400">
          <div className="px-16 py-12">
            <p className="text-gray-500">{capitalizeFirst(category?.name)}</p>
            <p className="text-xl font-bold">{capitalizeFirst(product.name)}</p>
            <p className="pt-10">{product.unit}</p>

            {/* Price + Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                ₹{product.price}
                <p className="font-medium text-xs">
                  (inclusive of all taxes.)
                </p>
              </div>

              {quantity === 0 ? (
                <div
                  onClick={incQuantity}
                  className="cursor-pointer px-3 font-medium py-2 w-28 bg-green-400"
                >
                  Add to Cart
                </div>
              ) : (
                <div className="px-4 py-1.5 bg-green-700 flex items-center justify-center gap-5 text-xl font-semibold text-white w-28">
                  <p className="cursor-pointer" onClick={decQuantity}>
                    -
                  </p>
                  <p>{quantity}</p>
                  <p className="cursor-pointer" onClick={incQuantity}>
                    +
                  </p>
                </div>
              )}
            </div>

            {/* Why Shop Section */}
            <div>
              <h2 className="text-xl pt-10 font-medium">
                Why shop from Freshlet?
              </h2>
              <ul className="w-[85%]">
                <li className="pt-4">
                  <h2 className="text-lg">1. Superfast Delivery</h2>
                  <p className="text-base">
                    Get your order delivered to your doorstep at the earliest
                    from dark stores near you.
                  </p>
                </li>
                <li className="pt-4">
                  <h2 className="text-lg">2. Best Prices & Offers</h2>
                  <p className="text-base">
                    Best price destination with offers directly from the
                    manufacturers.
                  </p>
                </li>
                <li className="pt-4">
                  <h2 className="text-lg">3. Wide Assortment</h2>
                  <p className="text-base">
                    Choose from 5000+ products across food, personal care,
                    household & other categories.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="relative">
        <div>
          <h2 className="font-medium text-2xl px-20 pt-8 relative py-4">
            Top 5 Products in this category
          </h2>

          <div className="grid sm:grid-cols-5 gap-2 pt-4 opacity-90 px-20 py-4 relative">
            {topProduct.map((item) => (
              <div
              onClick={()=>displayProduct(item)}
                key={item._id}
                className="p-2 relative border rounded-lg border-gray-400 flex flex-col items-center cursor-pointer"
              >
                <img src={item.images} alt={item.name} className="w-36" />

                <div className="h-15 text-start w-full">
                  <h2 className="text-start text-xl font-normal pt-2 w-full leading-none line-clamp-2">
                    {item.name}
                  </h2>
                  <p className="text-start w-full">{item.unit}</p>
                </div>

                <div className="pt-3 flex w-full items-center justify-between">
                  <p className="font-semibold text-md sm:text-lg w-full text-start">
                    Rs.{item.price}
                  </p>

                  {getCount(item._id) === 0 ? (
                    <div
                      onClick={() => increaseCount(item._id)}
                      className="px-3 w-1/2 text-center py-2 border rounded-lg cursor-pointer text-green-500 bg-green-50 font-medium border-green-400"
                    >
                      Add
                    </div>
                  ) : (
                    <div className="md:px-3 sm:px-2 px-1.5 py-1 border rounded-lg cursor-pointer w-full sm:w-1/2 text-white bg-green-700 font-medium flex items-center justify-between sm:gap-2 gap-1 md:gap-3">
                      <p
                        className="text-lg"
                        onClick={() => decreaseCount(item._id)}
                      >
                        -
                      </p>
                      <p className="text-md sm:text-lg cursor-default">
                        {getCount(item._id)}
                      </p>
                      <p
                        className="text-lg"
                        onClick={() => increaseCount(item._id)}
                      >
                        +
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;
