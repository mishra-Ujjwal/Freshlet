const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Try for 5s before timeout
      socketTimeoutMS: 45000,
    });
    console.log("db connected");
  } catch (err) {
    console.log("db connection error: " + err);
  }
}
module.exports = { connectDb };
