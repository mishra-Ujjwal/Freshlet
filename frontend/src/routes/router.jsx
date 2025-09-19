import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home';
import SearchPage from '../pages/SearchPage';

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import Category from "../pages/Category";
import UpdateProfile from "../pages/UpdateProfile";

import OTPPage from '../pages/OtpPage';
import Profile from '../pages/Profile';
import Dashboard from '../layouts/Dashboard';
import AddressPage from '../pages/AddressPage';
import OrderPage from '../pages/OrderPage';
import UpdateProfile from '../pages/UpdataProfile';
import SubCategory from '../pages/SubCategory';
import UploadProduct from '../pages/UploadProduct';
import Product from '../pages/Product';

import AdminPermission from '../layouts/AdminPermission';
import ProductListPage from '../pages/ProductListPage';
import ProductDisplay from '../pages/ProductDisplay';
import ScrollToTop from '../utils/ScrollTop';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import SuccessPage from '../pages/SuccessPage';
import CancelPage from '../pages/CancelPage';



const router = createBrowserRouter([
    {
        path:"/",
        element:(
            <>
            <ScrollToTop/>
            <App/>
            </>
        ),
        children:[
            {
               path:"",
               element:<Home/>
            },
            {
                path:"search",
                element:<SearchPage/>
            },
            {
                path:"signup",
                element:<Signup/>,
            },
            {
                path:"login",
                element:<Login/>
            },
            {
                path:"forget-password-otp",
                element:<ForgotPasswordOtp/>
            }
            ,
            {
                path:"otp-verification",
                element:<OTPPage/>
            },
            {
                path:"reset-password",
                element:<ResetPassword/>
            },
            {
                path:"dashboard",
                element:<Dashboard/>,
                children:[
                    {
                    path:"profile",
                    element:<UpdateProfile/>
                    },
                    {
                        path:"address",
                        element:<AddressPage/>
                    },
                    {
                        path:"order",
                        element:<OrderPage/>
                    },
                    {
                        path:"subcategory",
                        element:<AdminPermission><SubCategory/></AdminPermission>
                    },
                    {
                        path:"uploadproduct",
                        element:<UploadProduct/>
                    },
                    {
                        path:"product",
                        element:<AdminPermission> <Product/></AdminPermission>
                    },
                    {
                        path:"category",
                        element:<AdminPermission><Category/></AdminPermission>
                    }
                ]
            },
            {
                path:"products/:categoryId",
                element:<ProductListPage/>
            },
            {
                path:"products/:categoryId/product/:productId",
                element:<ProductDisplay/>   
            },{
                path:"checkout",
                element:<CheckoutPage/>
            },{
                path:"success",
                element:<SuccessPage/>
            },{
                path:"cancel",
                element:<CancelPage/>
            }
            
        ]
    },
])
export default router;