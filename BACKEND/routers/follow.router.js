import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  followingUserValidator,
} from "../validators/follow.validator.js";
import {
  followUser,
  unfollowUser,
} from "../controllers/follow.controllers.js";
import { checkExistingUserMw } from "../middlewares/checkExistingUserMw.js";
import { getFollowList } from "../helpers/getFollowList.js";

const followRouter = express.Router();

followRouter.post(
  "/add/:followingId",
  validate(followingUserValidator),
  checkExistingUserMw,
  followUser
);

followRouter.get(
  "/:userId/followers",
  (request, response, next) => {
    request.type = "followers";
    next();
  },
  getFollowList
);

followRouter.get(
  "/:userId/following",
  (request, response, next) => {
    request.type = "following";
    next();
  },
  getFollowList
);


followRouter.delete('/remove/:followingId', 
  validate(followingUserValidator),
  checkExistingUserMw,
  unfollowUser
);

export default followRouter;
