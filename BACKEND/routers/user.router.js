import express from "express";
import { getUser } from "../controllers/user.controllers.js";
import { getPostByUser } from "../helpers/getPostByUser.js";
import { getUserCommunities } from "../helpers/getUserCommunities.js";

const userRouter = express.Router({mergeParams: true}); 

userRouter.get('/', getUser); 
userRouter.get('/posts', getPostByUser);
userRouter.get('/communities', getUserCommunities); 

export default userRouter; 