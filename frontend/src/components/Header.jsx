import React, { useEffect, useState } from "react";
import logo from "../assets/freshletLogo.png";
import { TypeAnimation } from "react-type-animation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMobile from "../hooks/useMobile";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";
import { clearUserDetails, setUserDetails } from "../store/userSlice";
import fetchUserData from "../utils/fetchUserData";
import UserMenu from "./UserMenu";
import AdminMenu from "./AdminMenu";
import SearchProduct from "../pages/SearchPage";
import CartPage from "../pages/CartPage";


const Header = () => {
  const [input, setInput] = useState("");
  const [isSearchPage, setIsSearchPage] = useState(false);
  const location = useLocation();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useMobile();
  const [openCart,setOpenCart]=useState(false)
  const [totalPrice,setTotalPrice]=useState(0);
  const [quantity,setQuantity]=useState(0);
  const cart = useSelector((state)=>state.cartItem.cart)
  const product = useSelector((state)=>state.product.product)
  

  console.log("cart "+cart)
  //for showing search page
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Always update query in URL when on /search
    if (location.pathname === "/search") {
      navigate(`/search?query=${value}`);
    }
  };

  //acess the user data
  const user = useSelector((state) => state?.user);
  const isLogin = Boolean(user && user._id);

  useEffect(() => {
    const searchPage = location.pathname === "/search/?query=";
    setIsSearchPage(searchPage);
  }, [location]);

  useEffect(() => {
    setOpenUserMenu(false);
  }, [location]);

  //total item and total price in cart
 useEffect(()=>{
  const qty = cart.reduce((preve,curr)=>{
    return preve + (curr.quantity || 0);
  },0);

  const eachPrice = cart.reduce((preve,curr)=>{
    const price = curr.productId?.price || 0;  // safe access
    return preve + price * (curr.quantity || 0);
  },0);

  setTotalPrice(eachPrice);
  setQuantity(qty);
},[cart]);


   
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserMenu = async () => {
    setOpenUserMenu(!openUserMenu);
  };
  const handleCloseMenu = async () => {
    setOpenUserMenu(false);
  };

  const closeCart=()=>{
    setOpenCart(false);
  }
  return (
    <header className="sticky top-0 z-50">
      {!(isSearchPage && isMobile) && (
        <div className="w-screen bg-white flex items-center justify-between sm:shadow-xl p-3 pb-0">
          {/* Logo */}
          <Link to={"/"}>
            <div className="logo flex-shrink-0">
              <img
                src={logo}
                alt="Freshlet Logo"
                className="w-28 sm:w-24 md:w-28 lg:w-36 xl:w-40 xl:pl-10"
              />
            </div>
          </Link>

          {/* condtion for search page */}
          {!isSearchPage ? (
            <div className="flex items-center pt-2">
              {/* Location - hidden on mobile */}
              <div className="location hidden md:block h-full pl-10 pr-10">
                <h2 className="text-xl font-bold">Delivery in 8 minutes</h2>
                <p className="pt-1 text-sm text-gray-700">
                  276, Street No.1, Block CC, Shali...{" "}
                  <i className="fa-solid fa-caret-down"></i>
                </p>
              </div>

              {/* Search - hidden on mobile */}
              <div className="search relative hidden md:flex items-center ml-3 mr-5 border border-gray-400 rounded-xl">
                <i className="fa-solid fa-magnifying-glass p-3 text-gray-500"></i>
                <input
                  className="p-2 pl-4 w-150 outline-none text-base font-light"
                  type="text"
                  value={input}
                  onChange={handleChange} // update state
                  onClick={() => navigate("/search")} // navigate only on Enter
                />
                {input === "" && (
                  <div className="absolute left-10 text-gray-500 pointer-events-none">
                    <TypeAnimation
                      sequence={[
                        'Search "Milk"',
                        2000,
                        'Search "Bread"',
                        2000,
                        'Search "Fruits"',
                        2000,
                        "",
                        1000,
                      ]}
                      wrapper="span"
                      speed={50}
                      repeat={Infinity}
                    />
                  </div>
                )}
              </div>

              {!isLogin ? (
                <div className="login pl-10 pr-5">
                  <Link to={"/signup"}>
                    {" "}
                    <h2 className="text-xl font-normal text-black">SignUp</h2>
                  </Link>
                </div>
              ) : (
                <div className="relative profile bg-gray-700 p-1.5 ml-5 border rounded-full cursor-pointer ">
                  <i
                    onClick={handleUserMenu}
                    className="fa-solid fa-user text-xl text-white"
                  ></i>

                  {openUserMenu && user.role !== "ADMIN" && (
                    <div className="w-50 absolute top-13 bg-white right-0 border-1 rounded-2xl p-3 z-100">
                      <UserMenu close={handleCloseMenu} />
                    </div>
                  )}
                  {openUserMenu && user.role === "ADMIN" && (
                    <div className="w-50 absolute top-13 bg-white right-0 border-1 rounded-2xl p-3 z-100">
                      <AdminMenu close={handleCloseMenu} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="pt-3">
              <div className="search relative hidden md:flex items-center ml-3 mr-5 border border-gray-700 rounded-xl">
                <i className="fa-solid fa-magnifying-glass p-3 text-gray-800"></i>
                <input
                  className="p-2 pl-4 w-250 outline-none text-base font-light"
                  type="text"
                  value={input}
                  placeholder="Search for aata and daal"
                  autoFocus={true}
                  onChange={handleChange}
                  onClick={() => navigate("/search")}
                />
              </div>
            </div>
          )}

          {/* Cart - hidden  */}
          <div className="cart hidden lg:block px-3">
            <button
              style={{
                backgroundColor: "#349D48",
                border: "none",
                outline: "none",
              }} onClick={()=>setOpenCart(true)}
              className="flex items-center gap-2  outline-none "
            >
              <i className="fa-solid fa-cart-shopping text-lg text-white"></i>
              {cart.length>0 ?  <h2 className="hidden  sm:inline text-lg text-white leading-none font-bold" >
               <p className="flex text-base">{quantity} Items</p>
               <p>Rs.{totalPrice}</p>
              </h2> :<p className="text-xl font-medium text-white">Cart</p> }

            </button>
           
          </div>
           {openCart && <CartPage close={closeCart} />}
        </div>
      )}

      {/* search in mobile */}
      <div className="bg-white w-screen pt-3 pb-3">
        <div className="search relative sm:hidden flex items-center ml-3 mr-5 border rounded-xl z-50">
          {isMobile && isSearchPage ? (
            <Link to={"/"}>
              <i className="fa-solid fa-arrow-left  p-3 text-gray-600"></i>
            </Link>
          ) : (
            <i className="fa-solid fa-magnifying-glass p-3 text-gray-600"></i>
          )}
          <input
            className="p-2 pl-4 w-full outline-none text-base font-light"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={() => navigate("/search")}
          />
          {input === "" && (
            <div className="absolute left-10 text-gray-500 pointer-events-none">
              <TypeAnimation
                sequence={[
                  'Search "Milk"',
                  4000,
                  'Search "Bread"',
                  4000,
                  'Search "Fruits"',
                  4000,
                  "",
                  1000,
                ]}
                wrapper="span"
                speed={30}
                repeat={Infinity}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
