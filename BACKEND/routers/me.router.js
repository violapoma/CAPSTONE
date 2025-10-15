import express from "express";
import {
  changePassword,
  changeProfilePic,
  deleteMe,
  editMe,
  getMe,
} from "../controllers/me.controllers.js";
import { validate } from "../middlewares/validate.js";
import {
  changeLoggedUserPassword,
  editUserValidator,
} from "../validators/loggedUser.validator.js";
import { uploadProfilePic } from "../middlewares/uploadCloudinary.js";
import { getPostByUser } from "../helpers/getPostByUser.js";
import { getUserCommunities } from "../helpers/getUserCommunities.js";
import { getFollowList } from "../helpers/getFollowList.js";

const meRouter = express.Router();

meRouter.get("/", getMe);
// meRouter.get("/posts", getPostByUser);
// meRouter.get("/communities", getUserCommunities);
// meRouter.get(
//   "/followers",
//   (request, response, next) => {
//     request.type = "followers";
//     next();
//   },
//   getFollowList
// );
// meRouter.get(
//   "/following",
//   (request, response, next) => {
//     request.type = "following";
//     next();
//   },
//   getFollowList
// );
meRouter.put("/", validate(editUserValidator, "body"), editMe);
meRouter.patch(
  "/password",
  validate(changeLoggedUserPassword, "body"),
  changePassword
);
meRouter.patch(
  "/profile-pic",
  uploadProfilePic.single("profilePic"),
  changeProfilePic
);
meRouter.delete("/", deleteMe);

export default meRouter;
