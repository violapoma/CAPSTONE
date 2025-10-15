import express from "express";
import { getUser } from "../controllers/user.controllers.js";
import { getPostByUser } from "../helpers/getPostByUser.js";
import { getUserCommunities } from "../helpers/getUserCommunities.js";
import { getFollowList } from "../helpers/getFollowList.js";

const userRouter = express.Router({mergeParams: true}); 

userRouter.get('/', getUser); 
userRouter.get('/posts', getPostByUser);
userRouter.get('/communities', getUserCommunities); 
userRouter.get(
  "/followers",
  (request, response, next) => {
    request.type = "followers";
    next();
  },
  getFollowList
);
userRouter.get(
  "/following",
  (request, response, next) => {
    request.type = "following";
    next();
  },
  getFollowList
);

export default userRouter; 