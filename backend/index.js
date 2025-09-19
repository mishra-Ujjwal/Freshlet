const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParaser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { connectDb } = require("./config/mongoDb");
const userRouter = require("./routes/user.route");
const  categoryRouter = require("./routes/category.route");
const cartRouter = require("./routes/cart.route");
const addressRouter = require("./routes/address.route");
const orderRouter = require("./routes/order.route");
// Simple CORS configuration for debugging
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParaser());
app.use(morgan());
app.use(helmet({ 
  crossOriginIsolated: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.get("/", (req, res) => {
  res.send("Hi i am freshlet");
});

// Test CORS endpoint
app.get("/test-cors", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});
app.use("/user",userRouter)
app.use("/category",categoryRouter);
app.use("/cart",cartRouter)
app.use("/address",addressRouter)
app.use("/order",orderRouter)

// Error handling middleware for CORS
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      success: false,
      message: 'CORS policy violation: Origin not allowed',
      origin: req.get('Origin')
    });
  } else {
    next(err);
  }
});
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});
const port = 4000;
connectDb().then(() => {
  app.listen(port, () => {
    console.log("express working");
  });
});

