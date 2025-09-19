import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard/order"); // Redirect to home after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-auto  sm:min-h-screen ">
      <div className=" shadow-lg rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-700">Thank you for your purchase.</p>
        <p className="text-gray-500 text-sm mt-2">
          Redirecting you to the home page...
        </p>
      </div>
    </div>
  );
}

export default OrderSuccess;
