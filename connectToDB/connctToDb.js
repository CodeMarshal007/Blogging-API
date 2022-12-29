const mongoose = require("mongoose");
require("dotenv").config();
const CONFIG = require("../config");

function connectToDatabase() {
  mongoose.connect(CONFIG.MONGODB_URI, {
    useNewUrlParser: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

module.exports = { connectToDatabase };
