const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.ATLAS_MONGODB_URI;
// Function that handles connection to database
function connectToDatabase() {
  mongoose.connect(MONGODB_URI, {
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
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
// Function that handles connection to local database
function connectToLocalDatabase() {
  mongoose.connect(TEST_MONGODB_URI, {
    useNewUrlParser: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to Local MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

module.exports = { connectToDatabase, connectToLocalDatabase };
