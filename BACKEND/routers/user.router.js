import express from "express";
import { validate } from "../middlewares/validate.js";
import { userIdValidator } from "../validators/user.validator.js";
import { getUser } from "../controllers/user.controllers.js";
import { checkExistingUserMw } from "../middlewares/checkExistingUserMw.js";
import { getPostByUser } from "../helpers/getPostByUser.js";
import { getUserCommunities } from "../helpers/getUserCommunities.js";

const userRouter = express.Router({mergeParams: true}); 

userRouter.get('/', getUser); 
userRouter.get('/posts', getPostByUser);
userRouter.get('/communities', getUserCommunities); 

export default userRouter; 