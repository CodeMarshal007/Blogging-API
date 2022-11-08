const mongoose = require("mongoose");
const config = require("../config");

const MONGODB_URI = config.MONGODB_URI;
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

module.exports = connectToDatabase;
