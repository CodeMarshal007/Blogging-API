const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
// const userModel = require('../model/userModel')
const jwt = require("jsonwebtoken");
require("../auth/auth");
require("dotenv").config();

// Signup for JWT
userRouter.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.status(201).json({
      status: true,
      message: "Signup successful",

      user: {
        _id: req.user._id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        phone_number: req.user.phone_number,
      },
    });
  }
);

// Login for JWT
userRouter.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (error, user, info) => {
    try {
      if (error) {
        const error = new Error("An error occurred while trying to login");
        return next(error);
      }
      if (!user) {
        const error = new Error("User not found nw");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
        };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.json({
          status: true,
          message: "Issued token successfully",
          token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = userRouter;
