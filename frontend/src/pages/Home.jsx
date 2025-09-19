import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";
import { handleAddItemCart } from "../store/cartSlice";
import { GiShoppingCart } from "react-icons/gi";
import CartPage from "./CartPage";

const Home = () => {
  const allCategory = useSelector((state) => state.product.allCategory);
  const allProduct = useSelector((state) => state.product.product);
  console.log(allCategory);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const allCategoryData = useSelector((state) => state.product.allCategory);
  const navigate = useNavigate();
  const [homeProduct, setHomeProduct] = useState([]);
  const [itemCatId, setItemCatId] = useState("");
  const homeCategory = allCategory.slice(0, 7);
  console.log(homeCategory);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartItem.cart);

    const [openCart,setOpenCart]=useState(false)
  
  const handleRedirectProductListPage = (id, name) => {
    console.log(id + " " + name);
    const products = allProduct.filter((product) => product.category === id);
    console.log(products);
    navigate(`products/${id}`, { state: { products } });
    // productListpage will be open
  };
  const showHome = (id) => {
    console.log(id);
    const prod = allProduct.filter((p) => String(p.category) === String(id));
    console.log("producut is" + prod);
    setHomeProduct(prod);
  };

  useEffect(() => {
    showHome(itemCatId);
  }, []);

  const directToDisplayPage = (catId, prodId) => {
    navigate(`products/${catId}/product/${prodId}`);
  };
  const addCart = async (id) => {
    try {
      console.log("working");
      const res = await Axios({
        apiName: "addCartItem",
        formData: { productId: id },
      });
      console.log(res)
      if (res.data.success) {
        dispatch(handleAddItemCart(res.data.cartItem));
        console.log("hi");
        toast.success("item is added");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const removeCart = async (id) => {
    try {
      console.log("working");
      const res = await Axios({
        apiName: "removeCartItem",
        formData: { productId: id },
      });
      if (res.data.success) {
        dispatch(handleAddItemCart(res.data.cartItem));
        console.log("hi");
        toast.success("item is removed");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getQty = (id) => {
  const item = cart.find(
    (c) => c.productId?._id === id || c.productId === id
  );
  return item ? item.quantity : 0;
};

const closeCart=()=>{
    setOpenCart(false);
  }
  return (
    <section className="bg-white w-screen overflow-x-auto">
      <div className="banner px-5">
        <img className="hidden sm:block" src="/banner.jpg" alt="" />
        <img className="sm:hidden" src="/banner-mobile.jpg" alt="" />
      </div>
      <div className="categoryProduct w-fit">
        <div className="px-9 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
          {allCategory.map((category, idx) => {
            return (
              <div
                key={idx}
                className=" px-2 p-1 border-gray-500 rounded-lg cursor-pointer transition-transform duration-500  hover:scale-110"
                onClick={() =>
                  handleRedirectProductListPage(category._id, category.name)
                }
              >
                <img src={category.image} alt={category.name} />
              </div>
            );
          })}
        </div>
      </div>

      {/* show category */}

      <div className="px-10 pt-4 pb-4 w-full">
        {homeCategory.map((item, idx) => {
          const categoryProduct = allProduct.filter(
            (p) => String(p.category) === String(item._id)
          );
          return (
            <section key={idx}>
              <div className="flex items-center justify-between py-3 px-2 ">
                <h2 className="text-2xl font-medium">{item.name}</h2>
                <p
                  className="text-xl mr-10 font-medium text-green-700 cursor-pointer"
                  onClick={() =>
                    handleRedirectProductListPage(item._id, item.name)
                  }
                >
                  See all
                </p>
              </div>
              {/* show category product in detail */}
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide w-full">
                  {categoryProduct.map((prod, idx) => (
                    <div
                      key={idx}
                      className="w-44 sm:w-48 border rounded-lg p-2 flex-shrink-0 bg-white shadow flex flex-col items-start justify-center cursor-pointer"
                      onClick={() => {
                        directToDisplayPage(prod.category, prod._id);
                      }}
                    >
                      <img
                        src={prod.images}
                        alt={prod.name}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <p className=" w-full  text-start mt-2 text-sm sm:text-base line-clamp-1 text-gray-700">
                        {prod.name}
                      </p>
                      <p className=" w-full">{prod.unit}</p>
                      <div
                        className="pt-3 flex w-full items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="font-semibold text-md sm:text-lg w-full text-start">
                          Rs.{prod.price}
                        </p>

                        {getQty(prod._id) === 0 ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();

                              addCart(prod._id);
                            }}
                            className="px-3 w-1/2 text-center py-2 border rounded-lg cursor-pointer text-green-500 bg-green-50 font-medium border-green-400"
                          >
                            Add
                          </div>
                        ) : (
                          <div className="md:px-3 sm:px-2 px-1.5 py-1 border rounded-lg cursor-pointer w-full sm:w-1/2 text-white bg-green-700 font-medium flex items-center justify-between sm:gap-2 gap-1 md:gap-3">
                            <p
                              className="text-lg"
                              onClick={(e) => {
                                e.stopPropagation();

                                removeCart(prod._id);
                              }}
                            >
                              -
                            </p>
                            <p className="text-md sm:text-lg cursor-default">
                              {getQty(prod._id)}
                            </p>
                            <p
                              className="text-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                addCart(prod._id);
                              }}
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
            </section>
          );
        })}
      </div>
      {/* cart section */}
      <div className=" bg-red-500">
      {cart && <div className="fixed rounded-xl mb-2 shadow-2xl lg:hidden bottom-0 w-full h-15 bg-green-700 text-white flex items-center justify-between px-3 sm:px-10 py-2">
        <div className="flex items-center justify-center gap-3 "> <GiShoppingCart size={30}/> 
        <div className="flex flex-col items-center justify-center text-xl leading-none">
          <p>1 item</p>
          <p>Rs.146</p>
        </div>
        </div>
        
        <div className="text-xl font-semibold" onClick={()=>setOpenCart(true)}>
          view cart
        </div>
          {openCart && <CartPage close={closeCart} />}

        
      </div>}
      </div>
      
    </section>
  );
};

export default Home;
