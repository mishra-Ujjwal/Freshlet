import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import {toast} from 'react-toastify'
import SummaryApi, { baseUrl } from "../common/SummaryApi";
import Axios from "../utils/Axios";

const Signup = () => {
       const navigate = useNavigate();
       
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [showPassword,setShowPassword]=useState(false)
  const handleShowPassword = ()=>{
    setShowPassword(!showPassword)
  }
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Call the signup API
    // const res = await axios({
    //   method: SummaryApi.signup.method,
    //   url: `${baseUrl}${SummaryApi.signup.url}`,
    //   data: formData,
    //   withCredentials: true,
    // });

    const res = await Axios({apiName:"signup",formData});
    console.log("Response is " +res)
    // Handle success
    if (res.data.success) {
      toast.success(res.data.message);
      setFormData({ name: "", email: "", password: "" });
      navigate("/");
    } else {
      toast.error(res.data.message || "Signup failed");
    }
  } catch (err) {
    // Error handling
    console.log(err)
    toast.error(err?.response?.data?.message || "Something went wrong");
  }


   

  
  };

  return (
    <div className="h-auto flex items-center justify-center pt-10 pl-2 pr-4 sm:pt-20">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type={showPassword?"text":"password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!showPassword?<i onClick={handleShowPassword} className="fa-solid fa-eye-slash absolute right-4.5 top-9 cursor-pointer"></i>:<i onClick={handleShowPassword} className="fa-solid fa-eye absolute right-4.5 top-9 cursor-pointer"></i>}
          </div>

          <button
            type="submit"
            style={{backgroundColor:"blue"}}
            className="w-full text-white py-2 rounded-lg transition duration-200 text-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600 text-xl">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
