import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { ToastContainer, toast } from 'react-toastify';
import fetchUserData from "./utils/fetchUserData";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import { setAllCategory, setProduct,setLoadingCategory } from "./store/productSlice";
import Axios from "./utils/Axios";
import { handleAddItemCart } from "./store/cartSlice";

function App() {
  const dispatch = useDispatch();
  //fetch the data from user 
  const fetchUser = async () => {
  const data = await fetchUserData();
  if (data?.user) {
    dispatch(setUserDetails(data.user));
  }
};
const fetchCategories = async () => {
      try {
        dispatch(setLoadingCategory(true))
        const res = await Axios({ apiName: "getCategoryData" });
        if (res.data.success) {
          dispatch(setAllCategory(res.data.data)); 
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }finally{
        dispatch(setLoadingCategory(false))
      }
    };

    const fetchUploadData = async()=>{
      try{
        const res = await Axios({apiName:"getProductData"});
        if (res.data.success) {
          dispatch(setProduct(res.data.data)); 
        }
      }catch(err){
        console.error("Error fetching categories", err);
      }
    }

    const fetchCart = async()=>{
          try{
           const res = await Axios({apiName:"getCartItem"})
           if(res.data.success){
             dispatch(handleAddItemCart(res.data.cartItem))
            console.log("cart "+ res.data.cartItem)
           }
          }catch(err){
            console.log(err.message)
          }
    }
  useEffect(()=>{
   fetchUser();
   fetchCategories();
   fetchUploadData();
   fetchCart();
  },[])
  return (
    <>
    <Header/>
    <main className="min-h-180">
      <Outlet/>
    </main>
    <Footer/>
    <ToastContainer/>
    </>
  
  )
}

export default App
