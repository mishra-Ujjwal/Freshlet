const express = require("express")
const userRouter = express.Router();
const {CreateAccount, sendVerifyOtp, verifyEmail, login, logOut, updateDetails, forgetPasswordOtp, resetPassword, verifyPasswordOtp, userData} = require('../controllers/userAuth.controller');
const { userAuth } = require("../middleware/userAuth");
userRouter.post("/signup",CreateAccount)
userRouter.post("/login",login)
userRouter.get("/logout",logOut)
userRouter.get("/user-data",userAuth,userData)
userRouter.post("/send-forgetpassword-otp",forgetPasswordOtp)
userRouter.post("/reset-password",resetPassword)
userRouter.post("/verify-password-otp",verifyPasswordOtp)
userRouter.post("/send-verify-otp",userAuth,sendVerifyOtp)
userRouter.post("/verify-email",userAuth,verifyEmail)
userRouter.put("/update-user",userAuth,updateDetails)

module.exports=userRouter;