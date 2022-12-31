const express = require("express");
const userRoute = express.Router();
const userModel = require("../model/userModel");
const blogModel = require("../model/blogModel");
// const logger = require("../logger/logger");

// Update user details

async function updateUserDetails(req, res, next) {
  try {
    // logger.info(`The update a user details route was requested`);
    const body = req.body;
    const reqUser = req.user;
    //  since user must be logged in to access this route, there is no need passing user id params. just get it from the request user object
    const foundUser = await userModel.findById(reqUser._id);

    if (!foundUser) {
      return res.status(404).json({ status: false, user: null });
    }
    const updateFoundUser = await foundUser.updateOne(body);

    res.status(200).json({
      status: true,
      message: "successfully updated a user details",
      "update Info": updateFoundUser,
    });
  } catch (error) {
    next(error);
  }
}

// Delete a user
async function deleteUser(req, res, next) {
  try {
    // logger.info(`The delete a user account route was requested`);
    const reqUser = req.user;
    //  since user must be logged in to access this route, there is no need passing user id params. just get it from the request user object
    const foundUser = await userModel.findById(reqUser._id);

    if (!foundUser) {
      return res.status(404).json({ status: false, user: null });
    }

    const userPostsId = foundUser.posts.toString();

    const arrayUserPostsId = userPostsId.split(",");

    //   Delete all the posts by the user
    arrayUserPostsId.forEach(async (id) => {
      const deleteBlogPost = await blogModel.findByIdAndDelete(id);
    });

    //   Delete the User
    const deleteUser = foundUser.delete();
    res.status(200).json({
      status: true,
      message: "successfully deleted a user along with all user's articles",
    });
  } catch (error) {
    next(error);
  }
}
module.exports = { updateUserDetails, deleteUser };
