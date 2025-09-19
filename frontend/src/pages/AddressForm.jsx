import React, { useState } from "react";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";
const AddressForm = ({close}) => {
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Address line is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!/^\d{4,10}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 4–10 digits";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Select a country";
    }
    if (!/^\+?\d{0,10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits (may start with +)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmittedData(formData);
      // call api
      const res = await Axios({
        apiName: "addAddress",
        formData: submittedData,
      });
      if (res.data.success) {
        toast.success("Address is Added");
        close()
        setFormData({
          addressLine: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          mobile: "",
          defaultAddress: false,
        });
      } else {
        toast.error(res.data.message);
      }

      localStorage.setItem("address", JSON.stringify(formData));
    }
  };

  const handleClear = () => {
    setFormData({
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      mobile: "",
      defaultAddress: false,
    });
    setErrors({});
    setSubmittedData(null);
    localStorage.removeItem("address");
  };

  return (
    <div className="h-auto w-full flex items-center justify-center bg-black/50 absolute top-15 left-0 z-40 ">
    <div className=" bg-white w-2/4 right-0 mx-auto p-10 relative ">
      <h2 className="text-xl font-bold mb-2 text-gray-800 text-center w-full">Address Form</h2>
      <div className="absolute top-11 p-0.5 bg-gray-200 rounded-full right-12" onClick={close}><IoIosClose size={35} /></div>
      <form onSubmit={handleSubmit} className="space-y-1">
        {/* Address Line */}
        <div>
          <label className="block text-lg font-medium  text-gray-700">
            Address Line
          </label>
          <textarea
            name="addressLine"
            value={formData.addressLine}
            onChange={handleChange}
            placeholder="Street, Building, House No."
            className="mt-1 w-full p-2 rounded-lg border-1 border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.addressLine && (
            <p className="text-red-500 text-sm">{errors.addressLine}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-lg  font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg p-2 border-1 border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-lg font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 w-full p-2 border-1 rounded-lg border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state}</p>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="mt-1 border-1 w-full rounded-lg p-2 border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm">{errors.pincode}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 w-full p-2 border-1 rounded-lg border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Mobile
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="mt-1 w-full p-2 border-1 rounded-lg border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}
        </div>

       

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="!bg-green-600 outline-none hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddressForm;
