import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/checkout"); // Redirect to cart after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-xl font-bold text-red-600 mb-4">
          ❌ Payment Cancelled
        </h1>
        <p className="text-gray-700">Your payment was not completed.</p>
        <p className="text-gray-500 text-sm mt-2">
          Redirecting you back to your cart...
        </p>
      </div>
    </div>
  );
}

export default PaymentCancel;
