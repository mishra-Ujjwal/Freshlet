const { verifyEmailTemplate } = require("../utils/verifyEmailTemplate");
const { transporter } = require("../config/nodeMailer");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
//new user
const CreateAccount = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Fill all details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    //bcrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const save = await newUser.save();

    //generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    
    //send or add token to user
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //sending welcome email
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email`;
    const mailOptions = {
      from: `Freshlet <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Verify Email from Freshlet",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
    };
    await transporter.sendMail(mailOptions);
    
    return res.json({
      success: true,
      message: "Your Account is Succesfully created",
      data: save,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
//send verification OTP to user
const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.verifyEmail) {
      return res.json({ success: false, message: "email is verified" });
    }
    //generate otp
    const otp = Math.floor(Math.random() * 900000 + 100000);
    user.verifyEmailOtp = otp;
    console.log(otp);
    await user.save();
    //send this otp to user
    const mailOptions = {
      from: `Freshlet <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Verify Email from Freshlet",
      text: "Verification otp is " + otp,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "otp sent to the email" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
//verify email
const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;
  if (!otp) {
    return res.json({ success: false, message: "Fill The OTP" });
  }
  try {
    const user = await userModel.findById(userId);
    if (otp === user.verifyEmailOtp) {
      user.verifyEmail = true;
      return res.json({
        success: true,
        message: "Successfully email has been verfied",
      });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
//login api
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "missing details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Does Not exists" });
    }
    if (user.status !== "Active") {
      return res.json({
        success: false,
        message: "Your account is not active",
      });
    }

    const chekPassword = await bcrypt.compare(password, user.password);

    if (email === user.email && chekPassword) {
      //generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      user.lastLoginDate = new Date();
      await user.save();
      return res.json({ success: true, message: "successfully logged in" });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
//logout
const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "None",
       path: "/", 
    });
    return res.json({ success: true, message: "LoggedOut ho chuka hai" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
//update user details
const updateDetails = async (req, res) => {
  try {
    const userId = req.userId; //auth middleware
    const { name, email, password, mobile } = req.body;
    
    let hashedPassword = "";
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updateUser = await userModel.findByIdAndUpdate(userId, {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(mobile && { mobile: mobile }),
      ...(password && { password: hashedPassword }),
    });
    updateUser.save();
    return res.json({ success: true, message: "user updated" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//forget password

const forgetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is Required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user doest not exist" });
    }
    const otp = Math.floor(Math.random() * 900000 + 100000);
    user.forgetPasswordOtp = otp;
    console.log(otp);
    await user.save();
    //send this otp to user
    const mailOptions = {
      from: `Freshlet <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Verify Email from Freshlet",
      text: "Verification otp is " + otp,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "otp sent to the email" });
  } catch (err) {}
};
const verifyPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: "All fields are Required" });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User Does NOT Exists" });
  }
  if (otp !== user.forgetPasswordOtp) {
    return res.json({ success: false, message: "OTP invalid" });
  }

  return res.json({ success: true, message: "OTP is correct" });
};
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword, otp } = req.body;
    if (!email || !newPassword || !confirmPassword || !otp) {
      return res.json({ success: false, message: "Fill all details" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user does not exist" });
    }
    if (newPassword !== confirmPassword) {
      return res.json({
        success: false,
        message: "confirm password does not matching",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.forgetPasswordOtp = "";
    await user.save();
    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
const userData = async (req, res) => {
  const userId = req.userId;
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    return res.json({ success: true, message: "User Not Exists" });
  }
  return res.json({ success: true, message: "Data", user: user });
};
module.exports = {
  CreateAccount,
  sendVerifyOtp,
  verifyEmail,
  login,
  logOut,
  updateDetails,
  forgetPasswordOtp,
  resetPassword,
  verifyPasswordOtp,
  userData,
};
