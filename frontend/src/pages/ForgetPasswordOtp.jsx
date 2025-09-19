import React, { useState } from "react";
import { toast } from "react-toastify";
import Axios from "../utils/Axios"; // your axios function
import { useNavigate } from "react-router-dom";

const ForgotPasswordOtp = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required!");
        sessionStorage.setItem("resetEmail", email);


    try {
        
        console.log("inside forgetPasswordOtp")
      const res = await Axios({ apiName: "forgotpassword", formData: { email } });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/otp-verification")
        setEmail("");
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-auto flex items-center justify-center bg-gradient-to-br pt-10 sm:pt-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Forgot Password</h2>
        <p className="text-center text-sm text-gray-500 ">
          Enter your email to receive OTP for password reset
        </p>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          style={{backgroundColor:"blue"}}
          className="w-full text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordOtp;
