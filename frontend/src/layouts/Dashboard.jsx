import React from 'react'
import Profile from '../pages/Profile'
import UserMenu from '../components/userMenu'
import AdminMenu from '../components/AdminMenu'
import UpdateProfile from '../pages/UpdateProfile'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Dashboard = () => {
  const user = useSelector((state)=>state.user)
  return (
    <div className="w-screen bg-white grid lg:grid-cols-4">
  {/* Left Menu */}
  <div className="border-r sticky top-0 h-screen col-span-1 hidden lg:block pl-10 pr-3">
    {user.role !== "ADMIN" ? <UserMenu /> : <AdminMenu />}
  </div>

  {/* Right Content */}
  <div className="bg-white col-span-3 h-screen overflow-y-auto px-3">
    <Outlet />
  </div>
</div>

  );
};


export default Dashboard