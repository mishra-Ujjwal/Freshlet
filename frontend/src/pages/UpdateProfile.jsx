import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import {toast} from 'react-toastify'
import fetchUserData from "../utils/fetchUserData";
import { setUserDetails } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
const UpdateProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state)=>state.user)
  const [formData, setFormData] = useState({
    name:user.name,
    email: user.email,
    mobile: user.mobile || "",
  });
  
  useEffect(()=>{
   setFormData({
    name:user.name,
    email: user.email,
    mobile: user.mobile ||"",
   })
  },[user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    try{
    const res = await Axios({apiName:"updateUserData",formData})
    if(res.data.success){
        toast.success(res.data.message);
        const userData = await fetchUserData();
        dispatch(setUserDetails(userData.user));
        navigate("/")
    }
    else{
        toast.error(res.data.message)
    }
    }catch(err){
        console.log(err)
        toast.error(err.message)
    }
    
  };

  return (
    <div className="h-auto flex items-center justify-center ">
      <div className="  w-screen p-4 ">
        <p className="pt-3 text-xl pb-3">Update Your Profile</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 mb-1">Mobile</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

         

          {/* Submit Button */}
          <button
            type="submit"
            style={{backgroundColor:"blue"}}
            className="w-full text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
