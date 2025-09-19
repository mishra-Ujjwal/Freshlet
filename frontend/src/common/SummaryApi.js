export const baseUrl =import.meta.env.VITE_APP_URL;

const SummaryApi = {
  signup: {
    url: "/user/signup",
    method: "post",
  },
  login: {
    url: "/user/login",
    method: "post",
  },
  forgotpassword: {
    url: "/user/send-forgetpassword-otp",
    method: "post",
  },
  resetpassword: {
    url: "/user/reset-password",
    method: "post",
  },
  verifypasswordotp: {
    url: "/user/verify-password-otp",
    method: "post",
  },
  userdetails: {
    url: "/user/user-data",
    method: "get",
  },
  logout: {
    url: "/user/logout",
    method: "get",
  },
  updateUserData: {
    url: "/user/update-user",
    method: "put",
  },
  addCategory: {
    url: "/category/add-category",
    method: "post",
  },
  getCategoryData: {
    url: "/category/all",
    method: "get",
  },
  editCategory: {
    url: "/category/edit",
    method: "put",
  },
  deleteCategory: {
    url: "/category/delete",
    method: "delete",
  },
  uploadProduct: {
    url: "/category/upload-product",
    method: "post",
  },
  getProductData: {
    url: "/category/allproduct",
    method: "get",
  },
  deleteProduct: {
    url: "/category/deleteProduct",
    method: "delete",
  },
  productList: {
    url: "/category/category/:categoryId",
    method: "get",
  },
  addCartItem: {
    url: "/cart/add",
    method: "post",
  },
  removeCartItem: {
    url: "/cart/remove",
    method: "post",
  },
  getCartItem: {
    url: "/cart/allCartItem",
    method: "get",
  },
  addAddress:{
    url:"/address/add",
    method:"post"
  },
  allAddress:{
    url:"/address/all",
    method:"get"
  },
  deleteAddress:{
    url:"/address/delete",
    method:"post"
  },
  cashOnDelivery:{
    url:"/order/newOrder",
    method:"post"
  },
  getOrderDetail:{
    url:"/order/all",
    method:"get"
  },
  onlinePayment:{
    url:"/order/online-payment",
    method:"post"
  },
  paymentSuccess:{
    url:"/order/payment-success",
    method:"post"
  },
  getPaymentMethods:{
    url:"/order/payment-methods",
    method:"get"
  }
};
export default SummaryApi;
