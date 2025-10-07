import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  followingUserValidator,
} from "../validators/follow.validator.js";
import {
  followUser,
  getFollowList,
  unfollowUser,
} from "../controllers/follow.controllers.js";
import { checkExistingUserMw } from "../middlewares/checkExistingUserMw.js";

const followRouter = express.Router();

followRouter.post(
  "/:followingId",
  validate(followingUserValidator),
  checkExistingUserMw,
  followUser
);

followRouter.get(
  "/followers",
  (request, response, next) => {
    request.type = "followers";
    next();
  },
  getFollowList
);

followRouter.get(
  "/following",
  (request, response, next) => {
    request.type = "following";
    next();
  },
  getFollowList
);


followRouter.delete('/:followingId', 
  validate(followingUserValidator),
  checkExistingUserMw,
  unfollowUser
);

export default followRouter;
