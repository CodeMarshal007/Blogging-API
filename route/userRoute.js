const express = require("express");
const userRoute = express.Router();
const userController = require("../controller/userController");

/**
 * @api  {patch}  /app/user/update
 * @apiName Update user details
 * @apiPermission Private
 * @apiSuccess (200) {Object}
 */
userRoute.patch("/update", userController.updateUserDetails);

/**
 * @api  {delete}  /app/user/delete
 * @apiName delete a user with all the user's blogs
 * @apiPermission Private
 * @apiSuccess (200) {Object}
 */
userRoute.delete("/delete", userController.deleteUser);

module.exports = userRoute;
