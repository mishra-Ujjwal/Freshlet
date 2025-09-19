import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoBagHandleSharp } from "react-icons/io5";
import { ImAddressBook } from "react-icons/im";
import { CiLogout } from "react-icons/ci";
import { IoMdPerson } from "react-icons/io";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import { clearUserDetails } from "../store/userSlice";
import { toast } from "react-toastify";
import { clearCart } from "../store/cartSlice";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state?.user);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

const logOutHandler = async () => {
    try {
      const res = await Axios({ apiName: "logout" });
      if (res.data.success) {
        dispatch(clearCart())
        dispatch(clearUserDetails());
        toast.success(res.data.message);
        close?.();
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  return (
    <div className="w-full p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Your Account</h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2 mb-3">
        <p className="text-gray-600 text-lg flex items-center gap-1.5">
          <IoMdPerson size={20} /> {user?.name || "Guest"}
        </p>
        <Link to="/dashboard/profile" className="hover:text-blue-500">
          <FaExternalLinkAlt size={13} />
        </Link>
      </div>

      <hr className="border-gray-300 mb-3" />

      {/* Menu Links */}
      <nav className="flex flex-col gap-2 text-gray-600 text-lg">
        <Link
          to="/dashboard/order"
          className="flex items-center gap-2 hover:text-gray-900"
        >
          <IoBagHandleSharp />
          Order History
        </Link>

        <Link
          to="/dashboard/address"
          className="flex items-center gap-2 hover:text-gray-900"
        >
          <ImAddressBook />
          Address Book
        </Link>

        <button
          onClick={logOutHandler}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
        >
          <CiLogout size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default UserMenu;
