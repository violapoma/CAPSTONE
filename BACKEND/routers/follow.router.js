import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  followParamsValidator,
  followUserId,
} from "../validators/follow.validator.js";
import {
  followUser,
  getFollowList,
  unfollowUser,
} from "../controllers/follow.controllers.js";

const followRouter = express.Router();

followRouter.get(
  "/:userId/followers",
  (request, response, next) => {
    request.type = "followers";
    next();
  },
  validate(followUserId),
  getFollowList
);

followRouter.get(
  "/:userId/following",
  (request, response, next) => {
    request.type = "following";
    next();
  },
  validate(followUserId),
  getFollowList
);

followRouter.post(
  "/:userId/following/:followingId",
  validate(followParamsValidator),
  followUser
);

followRouter.delete('/:userId/unfollowing/:followingId', 
  validate(followParamsValidator),
  unfollowUser
);

export default followRouter;
