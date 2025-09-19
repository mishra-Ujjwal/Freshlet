import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuSquareMenu } from "react-icons/lu";
import { IoBagHandle } from "react-icons/io5";
import { RiEBike2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import AddressPage from "./AddressPage";
import AddressForm from "./AddressForm";
import Axios from "../utils/Axios";
import { clearCart } from "../store/cartSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // fetch all addresses
  const fetchAddresses = async () => {
    try {
      const res = await Axios({ apiName: "allAddress" });
      if (res.data.success) {
        setAddresses(res.data.addresses);
        console.log(addresses);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err.message);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // delete address
  const handleDelete = async (id) => {
    try {
      const res = await Axios({
        apiName: "deleteAddress",
        formData: { addressId: id },
      });

      if (!res) {
        toast.error("Invalid address");
        return;
      }

      setAddresses((prev) => prev.filter((item) => item._id !== id));
      toast.success("Address Removed");

      if (selectedAddress === id) {
        setSelectedAddress(null); // reset if selected address was deleted
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  //   calculate total price
  const totalPrice = cartItem.reduce((preve, curr) => {
    return preve + curr.productId.price * curr.quantity;
  }, 0);
  console.log(totalPrice);

  const grandTotal = () => {
    const delivery = 25;
    const processing = 2;
    return totalPrice + delivery + processing;
  };
  const navigate = useNavigate();

  const cashOnDelivery = async (id) => {
    try {
      if (!id) {
        toast.error("please select address");
      }
      const res = await Axios({
        apiName: "cashOnDelivery",
        formData: {
          listItems: cartItem,
          deliveryAddressId: selectedAddress,
          subTotalAmt: totalPrice,
          totalAmt: grandTotal(),
        },
      });
      if (res.data.success) {
        dispatch(clearCart());
        toast.success("successfully order is placed");
        navigate("/success")
      }
    } catch (err) {
      console.log(err.message);
    }
  };
 const onlinePayment = async () => {
  try {
    if (!selectedAddress) {
      toast.error("Please select an address first");
      return;
    }
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

    const res = await Axios({
      apiName: "onlinePayment",
      formData: {
        listItems: cartItem,
        deliveryAddressId: selectedAddress,
        subTotalAmt: totalPrice,
        totalAmt: grandTotal(),
      },
    });

    if (res.success) {
      const result = await stripe.redirectToCheckout({
        sessionId: res.sessionId, // your backend should return sessionId
      });
      if (result.error) {
        console.error(result.error);
        toast.error("Stripe checkout failed");
      }
    } else {
      toast.error("Payment session could not be created");
    }
  } catch (err) {
    console.error(err.message);
    toast.error("Something went wrong with payment");
  }
};


  return (
    <section className="w-screen h-screen bg-white">
      {/* for desktop */}
      <section className=" w-screen sm:h-screen h-auto sm:flex sm:flex-row flex flex-col ">
        <div className="sm:w-2/3 w-full px-8">
          {/* for address section */}
          <section className="p-4">
            {/* Add Address Button */}
            <div
              className="w-full border-2 border-dashed border-gray-400 mt-4 rounded-lg cursor-pointer py-3 text-xl text-center font-medium hover:bg-gray-50"
              onClick={() => setOpenAddressForm(true)}
            >
              + Add Address
            </div>

            {/* Address Form Modal */}
            {openAddressForm && (
              <AddressForm close={() => setOpenAddressForm(false)} />
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
              <div className="text-center text-gray-600 mt-6">
                No addresses found. Please add one.
              </div>
            ) : (
              <div className="flex flex-col w-full gap-4 pt-5">
                {addresses.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedAddress(item._id)}
                    className={`border rounded-lg relative p-4 shadow-sm hover:shadow-md transition bg-white cursor-pointer ${
                      selectedAddress === item._id ? "border-orange-500" : ""
                    }`}
                  >
                    {/* Radio Input */}
                    <input
                      type="radio"
                      name="address"
                      value={item._id}
                      checked={selectedAddress === item._id}
                      onChange={() => setSelectedAddress(item._id)}
                      className="absolute left-2 top-2 cursor-pointer"
                    />

                    {/* Remove button */}
                    <button
                      className="absolute md:right-10 sm:right-5 right-2 top-1 !bg-orange-500 rounded text-white font-semibold"
                      onClick={() => handleDelete(item._id)}
                    >
                      Remove
                    </button>

                    {/* Address Info */}
                    <h3 className="font-semibold text-lg mb-1">
                      {item.addressLine}
                    </h3>
                    <p className="text-gray-700">
                      {item.city}, {item.state} - {item.pincode}
                    </p>
                    <p className="text-gray-700">{item.country}</p>
                    <p className="text-gray-700 font-medium mt-2">
                      📞 {item.mobile}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <div className="sm:w-1/3 w-full ">
          <div className="flex flex-col gap-2 w-full bg-white px-4 py-4 rounded-xl">
            <h2>Bill</h2>
            <div className="flex items-center justify-between">
              <p className="flex items-center justify-center gap-1.5">
                {" "}
                <LuSquareMenu />
                Item Total
              </p>
              <p>Rs.{totalPrice}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="flex items-center justify-between gap-1.5">
                <RiEBike2Line />
                Delivery Charge
              </p>
              <p>Rs.25</p>
            </div>
            <div className="flex items-center justify-between">
              <p
                className="flex items-center justify-between
                                gap-1.5"
              >
                {" "}
                <IoBagHandle />
                Handling Charge
              </p>
              <p>Rs.2</p>
            </div>
            <div className="flex items-center justify-between font-bold text-md">
              <p className="">Grand Total</p>
              <p>Rs.{grandTotal()}</p>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <div className="w-full py-3 bg-green-700 text-center rounded-lg cursor-pointer text-white  text-xl font-semibold" onClick={onlinePayment}>
                Pay Now
              </div>
              <div
                className="w-full py-3 border-1 border-dashed cursor-pointer border-gray-400 text-center rounded-lg text-black  text-xl font-semibold"
                onClick={() => {
                  cashOnDelivery(selectedAddress);
                }}
              >
                Cash On Delivery
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* for mobile */}
    </section>
  );
};

export default CheckoutPage;
