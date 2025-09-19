import React from 'react'
import { useSelector } from 'react-redux'
import PageNotFound from '../components/PageNotFound'

const AdminPermission = ({children}) => {
    const user = useSelector(state=>state.user)
    console.log(user)
  return (
    <>
    {user.role==="ADMIN" ? children:<PageNotFound/>}
    </>
  )
}

export default AdminPermission