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
app.use(cors({ credentials: true,
  origin: ["http://localhost:5173", "http://localhost:5174"],
 }));
app.use(express.json());
app.use(cookieParaser());
app.use(morgan());
app.use(helmet({ crossOriginIsolated: false }));

app.get("/", (req, res) => {
  res.send("Hi i am freshlet");
});
app.use("/user",userRouter)
app.use("/category",categoryRouter);
app.use("/cart",cartRouter)
app.use("/address",addressRouter)
app.use("/order",orderRouter)
const port = 4000;
connectDb().then(() => {
  app.listen(port, () => {
    console.log("express working");
  });
});

