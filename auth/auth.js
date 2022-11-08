const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require("dotenv").config();
const User = require("../model/userModel");

//Configuring JWT Strategy
const secret = process.env.JWT_SECRET;
passport.use(
  new JWTStrategy(
    {
      secretOrKey: secret,

      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, //Allows the req parameter to be passed into the function
    },
    async (req, email, password, done) => {
      try {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const phone_number = req.body.phone_number;

        const user = await User.create({
          email,
          password,
          first_name,
          last_name,
          phone_number,
        });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found, signup" });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(null, false, {
            message: "Wrong Password, try forget password",
          });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
