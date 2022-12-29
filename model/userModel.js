const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema(
  {
    id: ObjectId,
    first_name: {
      type: String,
      required: [true, "firstname cannot be blank"],
    },
    last_name: {
      type: String,
      required: [true, "lastname cannot be blank"],
    },

    email: {
      type: String,
      unique: true, //Set email to be unique between users
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "You entered an invalid email address"], //Regular email address expression that checks if email address is valid
      required: [true, "email cannot be blank"],
    },
    password: {
      type: String,
      required: [true, "Password cannot be blank"], //Password is set to be required and cannot be blank
    },

    phone_number: { type: Number },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." }); //uniqueValidator plugin and returns friendly message

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await User.hash(this.password);
  }
});
UserSchema.statics.hash = function (password) {
  return bcrypt.hash(password, 10);
};

UserSchema.methods.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
