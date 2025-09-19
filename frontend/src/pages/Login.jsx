import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../utils/Axios";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import fetchUserData from "../utils/fetchUserData";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    try {
      const res = await Axios({
        apiName: "login",
        formData: { email, password },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        const userData = await fetchUserData();
        dispatch(setUserDetails(userData.user)); // Make sure it's userData.user
        navigate("/");
      } else {
        toast.error(res.data.message);
      }

      console.log(res);
    } catch (err) {
      toast.error("Something went Wrong");
      console.log(err.message);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-auto flex items-center justify-center px-4 pt-10 sm:pt-20">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {!showPassword ? (
              <i
                onClick={handleShowPassword}
                className="fa-solid fa-eye-slash absolute right-4.5 top-9 cursor-pointer"
              ></i>
            ) : (
              <i
                onClick={handleShowPassword}
                className="fa-solid fa-eye absolute right-4.5 top-9 cursor-pointer"
              ></i>
            )}
          </div>

          <button
            type="submit"
            style={{ backgroundColor: "blue" }}
            className="w-full text-white py-2 rounded-lg transition duration-200"
          >
            <h2 className="text-xl">Login</h2>
          </button>
        </form>

        <div className="flex justify-between  items-center mt-4 text-sm text-gray-600">
          <Link
            to={"/forget-password-otp"}
            className="hover:underline text-blue-600 text-lg"
          >
            Forgot Password?
          </Link>
          <Link
            to={"/signup"}
            className="hover:underline text-blue-600 text-lg pl-3"
          >
            Don't have an account?
            <br /> Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
