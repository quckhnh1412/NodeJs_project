const mongoose = require("mongoose");

const db_url = "mongodb://127.0.0.1:27017/Final";

const connectDB = async () => {
  try {
    await mongoose.connect(db_url);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
