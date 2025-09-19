import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../utils/Axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = sessionStorage.getItem("resetEmail") || "";
  const otpFromState = sessionStorage.getItem("otp") || "";
  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: otpFromState,
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!emailFromState) {
      toast.error("No email found. Redirecting...");
      navigate("/forget-password-otp");
    }
  }, [emailFromState, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword, confirmPassword } = formData;

    if (!otp || !newPassword || !confirmPassword || !email) {
      return toast.error("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const res = await Axios({
        apiName: "resetpassword",
        formData,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successful!");
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("otp");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-auto flex items-center justify-center bg-gradient-to-br   px-4 pt-10 sm:pt-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Reset Password</h2>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          style={{backgroundColor:"blue"}}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
