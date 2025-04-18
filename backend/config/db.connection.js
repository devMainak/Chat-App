const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoURI);
    if (connection) {
      console.log("Database connected successfully.");
    } else {
      console.log("Failed to connect to Database.");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = initializeDatabase;
