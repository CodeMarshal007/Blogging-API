require("dotenv").config();

const PORT = process.env.PORT;
//used this for integration testing
const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.ATLAS_MONGODB_URI
    : process.env.LOCAL_MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
};
