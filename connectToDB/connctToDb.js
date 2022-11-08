const mongoose = require("mongoose");
require("dotenv").config();
//const {MONGODB_URI} = require("../config.js")

const MONGODB_URI = process.env.ATLAS_MONGODB_URI
// Function that handles connection to database
function connectToDatabase() {
  mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology:true





        }
    );

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}



module.exports = { connectToDatabase};
