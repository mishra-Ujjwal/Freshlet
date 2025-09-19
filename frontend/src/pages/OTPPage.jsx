import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import { toast } from "react-toastify";

const OTPPage = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const email = sessionStorage.getItem("resetEmail");
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

 const handleKeyDown = (e, index) => {
  if (e.key === "Backspace") {
    const newOtp = [...otp];
    if (otp[index]) {
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (index > 0) {
      inputRefs.current[index - 1].focus();
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  }
};

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      if (/\d/.test(pasted[i])) {
        newOtp[i] = pasted[i];
      }
    }
    setOtp(newOtp);
    inputRefs.current[pasted.length - 1]?.focus();
    e.preventDefault();
  };

  const handleSubmit = async () => {
    const fullOtp = otp.join("");
    try {
      const res = await Axios({
        apiName: "verifypasswordotp",
        formData: { email, otp: fullOtp },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        sessionStorage.setItem("otp",fullOtp)
        navigate("/reset-password");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err || "Something went wrong");
    }
  };

  return (
    <div className="h-auto pt-10 sm:pt-20 flex items-center justify-center  px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          OTP Verification
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength="1"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-10 sm:w-12 h-10 sm:h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          style={{backgroundColor:"blue"}}
          className="w-full py-2  text-white rounded-md hover:bg-blue-700 transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OTPPage;
