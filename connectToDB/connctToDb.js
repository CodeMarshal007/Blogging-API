const mongoose = require("mongoose");
require('dotenv').config()

const URL = process.env.URL
// Function that handles connection to database
function connectToDatabase() {
  mongoose.connect(URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

module.exports = connectToDatabase;