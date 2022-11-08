const mongoose = require("mongoose");
require("dotenv").config();
const {MONGODB_URI} = require("../config.js)


// Function that handles connection to database
function connectToDatabase() {
  mongoose.connect(MONGODB_URI);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}



module.exports = { connectToDatabase};
