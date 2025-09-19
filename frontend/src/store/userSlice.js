import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  mobile: "",
  verifyEmail: "",
  addressDetails: [],
  shoppingCart: [],
  orderHistory: [],
  role: "",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state._id = action.payload?._id;
      state.name = action.payload?.name;
      state.email = action.payload?.email;
      state.mobile = action.payload?.mobile;
      state.verifyEmail = action.payload?.verifyEmail;
      state.addressDetails = action.payload?.addressDetails;
      state.shoppingCart = action.payload?.shoppingCart;
      state.orderHistory = action.payload?.orderHistory;
      state.role = action.payload?.role;
    },
    clearUserDetails: (state) => {
      state._id= "";
      state.name= "";
      state.email= "";
      state.mobile= "";
      state.verifyEmail= "";
      state.addressDetails= [];
      state.shoppingCart= [];
      state.orderHistory= [];
      state.role= "";
    },
  },
});
//export actions
export const { setUserDetails,clearUserDetails } = userSlice.actions;

//export reducer to be used in store
export default userSlice.reducer;
