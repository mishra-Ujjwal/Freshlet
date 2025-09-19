import React, { useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { RiEBike2Line } from "react-icons/ri";
import { LuSquareMenu } from "react-icons/lu";
import { IoBagHandle } from "react-icons/io5";
import Axios from '../utils/Axios';
import { handleAddItemCart } from '../store/cartSlice';
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
const CartPage = ({close}) => {
    const dispatch = useDispatch();
    const cartItem = useSelector((state)=>state.cartItem.cart)
      useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      // restore scroll when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

//   calculate total price 
    const totalPrice = cartItem.reduce((preve,curr)=>{
       return preve + (curr.productId.price * curr.quantity)
    },0)
    console.log(totalPrice) 

    const grandTotal=()=>{
        const delivery=25;
        const processing=2;
         return totalPrice+delivery+processing;
    }

    const refreshCart = async () => {
      try{
        const res = await Axios({apiName:'getCartItem'});
        if(res.data.success){
          dispatch(handleAddItemCart(res.data.cartItem))
        }
      }catch(err){
        console.log(err.message)
      }
    }

    const handleIncrease = async (productId) => {
      try{
        const res = await Axios({ apiName:'addCartItem', formData:{ productId } });
        if(res.data.success){
          dispatch(handleAddItemCart(res.data.cartItem))
        }else{
          await refreshCart();
        }
      }catch(err){
        console.log(err.message)
      }
    }

    const handleDecrease = async (productId) => {
      try{
        const res = await Axios({ apiName:'removeCartItem', formData:{ productId } });
        if(res.data.success){
          dispatch(handleAddItemCart(res.data.cartItem))
        }else{
          await refreshCart();
        }
      }catch(err){
        console.log(err.message)
      }
    }
    const navigate = useNavigate()
    
    const openCheckoutPage = ()=>{
      console.log(close());
      navigate("/checkout")
      console.log("working")
    }

  return (
    <section>
    {/* for desktop */}
    {cartItem.length>0 && <div className='hidden lg:flex h-[100%] w-[100%] bg-black/40 overflow-y-hidden fixed top-0 left-0 z-50'>
     <div className='w-2/3 h-screen'onClick={close}>
       
     </div>
     <div className='w-1/3 bg-white h-screen overflow-y-auto overflow-x-auto'>
        <div className='flex items-center justify-between  px-6 py-4 w-1/3 absolute top-0 left-2/3 bg-white'>
            <h2 className='text-xl font-semibold'>My cart</h2>
            <h2 className='text-2xl font-medium cursor-pointer 'onClick={close}><RxCross2 /></h2>
        </div>
        {/* cart item */}

        <div className='pt-18 pb-28  px-5 rounded-xl bg-gray-300 flex flex-col gap-2'>
            {cartItem.map((item,idx)=>{
                return(
                   <div key={idx} className='w-full h-30 px-6 rounded-2xl flex items-center gap-2 bg-white '>
                    <div className='h-20 rounded-lg overflow-hidden'>
                       <img src={Array.isArray(item.productId.images) ? item.productId.images[0] : item.productId.images} className='h-full' alt="" />
                       </div>
                       <div className='flex flex-col leading-tight item-start justify-center w-3/4'>
                        <p className='text-md  line-clamp-1 '>{item.productId.name}</p>
                        <p>{item.productId.unit}</p>
                        <p className='font-medium text-lg'>Rs.{item.productId.price}</p>
                       </div>
                       <div>
                        <div className='px-4 py-2 bg-green-700 rounded-lg flex items-center justify-center gap-2 text-white'>
                            <p className='cursor-pointer text-lg font-bold' onClick={()=>handleDecrease(item.productId._id)}>-</p>
                            <p className='text-lg font-semibold '>{item.quantity}</p>
                            <p className='cursor-pointer text-lg font-bold' onClick={()=>handleIncrease(item.productId._id)}>+</p>
                        </div>
                       </div>
                   </div>
                )
            })}
            <div className='flex flex-col gap-2 w-full bg-white px-2 py-2 rounded-xl'>
                <h2>Bill</h2>
                <div className='flex items-center justify-between'>
                    <p className='flex items-center justify-center gap-1.5'> <LuSquareMenu />Item Total</p>
                    <p>Rs.{totalPrice}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='flex items-center justify-between gap-1.5'><RiEBike2Line />Delivery Charge</p>
                    <p>Rs.25</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='flex items-center justify-between
                    gap-1.5'> <IoBagHandle />Handling Charge</p>
                    <p>Rs.2</p>
                </div>
                <div className='flex items-center justify-between font-bold text-md'>
                    <p className=''>Grand Total</p>
                    <p>Rs.{grandTotal()}</p>
                </div>
            </div>
        </div>

        <div>
            <div className='flex items-center justify-between  px-3 py-4 w-1/3 absolute bottom-0 left-2/3 bg-white rounded-xl'>
            <div className='flex items-center justify-between px-2 py-2 rounded-xl bg-green-600 w-full text-white'>
            <h2 className='text-xl font-semibold'>Rs.{grandTotal()} <br />Total</h2>
            <h2 className='text-xl flex items-center cursor-pointer' onClick={()=>openCheckoutPage()}>Pay Now <IoIosArrowForward /></h2>
            </div>
        </div>
        </div>
     </div>
     </div>
     }
    

     {/* for mobile */}
    {/* for mobile */}
    {cartItem.length>0 && <div className="flex lg:hidden fixed  left-0 z-[1000] h-screen w-screen text-black top-20 bg-black/40">
  <div className="w-full bg-white h-screen overflow-y-auto">
    <div className='pt-14 sm:pt-5 px-5 flex items-center  gap-1' onClick={close}><IoArrowBackOutline size={30} /> Back</div>
    {/* header */}
    <div className="flex items-center justify-between px-6 py-4 fixed top-0 left-0 w-full bg-white shadow">
      <h2 className="text-xl font-semibold">My cart</h2>
      <h2 className="text-2xl font-medium cursor-pointer" onClick={close}>
        <RxCross2 />
      </h2>
    </div>

    {/* cart items */}
    <div className="pt-4 pb-50 px-4 flex flex-col gap-2">
      {cartItem.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <IoBagHandle className="text-5xl mb-3" />
          <p>Your cart is empty</p>
        </div>
      ) : (
        cartItem.map((item) => (
          <div key={item.productId._id} className="w-full h-30 px-4 rounded-2xl flex items-center bg-white border">
            <div className="h-20 w-20 rounded-lg overflow-hidden">
              <img
                src={Array.isArray(item.productId.images) ? item.productId.images[0] : item.productId.images}
                className="h-full w-full object-cover"
                alt={item.productId.name}
              />
            </div>
            <div className="flex flex-col leading-tight justify-center w-3/4 px-3">
              <p className="text-md line-clamp-1">{item.productId.name}</p>
              <p>{item.productId.unit}</p>
              <p className="font-medium text-lg">Rs.{item.productId.price}</p>
            </div>
            <div>
              <div className="px-4 py-2 bg-green-700 rounded-lg flex items-center gap-2 text-white">
                <p className="cursor-pointer text-lg font-bold" onClick={() => handleDecrease(item.productId._id)}>-</p>
                <p className="text-lg font-semibold">{item.quantity}</p>
                <p className="cursor-pointer text-lg font-bold" onClick={() => handleIncrease(item.productId._id)}>+</p>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Bill Section */}
      <div className="flex flex-col gap-2 w-full bg-gray-50 px-3 py-3 rounded-xl">
        <h2 className="font-semibold">Bill</h2>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5"><LuSquareMenu />Item Total</p>
          <p>Rs.{totalPrice}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5"><RiEBike2Line />Delivery Charge</p>
          <p>Rs.25</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5"><IoBagHandle />Handling Charge</p>
          <p>Rs.2</p>
        </div>
        <div className="flex items-center justify-between font-bold text-md">
          <p>Grand Total</p>
          <p>Rs.{grandTotal()}</p>
        </div>
      </div>
    </div>

    {/* bottom bar */}
    <div className="fixed bottom-0 left-0 w-full px-4 py-3 bg-white ">
      <button className="flex items-center justify-between px-3 py-3 rounded-xl !bg-green-600 w-full text-white">
        <h2 className="text-xl font-semibold">Rs.{grandTotal()} <br />Total</h2>
        <h2 className="text-xl flex items-center cursor-pointer" onClick={()=>navigate("/checkout")}>Proceed <IoIosArrowForward /></h2>
      </button>
    </div>
  </div>
</div>}

     


    </section>
  )
}

export default CartPage