import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";
import Axios from "../utils/Axios";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";

const AddressPage = () => {
  const user = useSelector((state) => state?.user);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const closeAddressForm = () => {
    setOpenAddressForm(false);
  };
  // access all addresses
  const allAddresses = async () => {
    try {
      const res = await Axios({ apiName: "allAddress" });
      if (res.data.success) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    allAddresses();
  },[]);
  const deleteButton = async (id) => {
    try {
      const res = await Axios({apiName:"deleteAddress",formData:{addressId:id}})
      if(!res){
        toast.error("invalid address")
        return;
      }

      setAddresses((prev) => prev.filter((item) => item._id !== id));
      toast.success("Address Removed")

    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section>
      {/* if user is not there */}

      <div
        className="w-full border-2 border-dashed border-gray-400 mt-4 rounded-lg cursor-pointer py-3 text-xl text-center font-medium"
        onClick={() => setOpenAddressForm(true)}
      >
        Add Address
      </div>
      {openAddressForm && <AddressForm close={closeAddressForm} />}
      {!addresses ? (
        <div>Please Add Address</div>
      ) : (
        <div className="flex flex-col w-full gap-4 pt-5">

          {addresses.map((item, idx) => {
            return (
              <div
                key={idx}
                className="border rounded-lg relative p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <button className="absolute right-10 !bg-orange-500 font-semibold text-white" onClick={()=>{deleteButton(item._id)}}>
                  Remove
                </button>
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
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AddressPage;
