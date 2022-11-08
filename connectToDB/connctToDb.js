const mongoose = require("mongoose");
require("dotenv").config();

const ATLAS_URL = process.env.ATLAS_URL;
// Function that handles connection to database
function connectToDatabase() {
  mongoose.connect(ATLAS_URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Atlas Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

// connction to test db
const URL = process.env.URL;
function connectToTestDatabase() {
  mongoose.connect(URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

module.exports = { connectToDatabase, connectToTestDatabase };
