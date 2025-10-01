import express from "express";
import { validate } from "../middlewares/validate.js";
import { userIdValidator } from "../validators/user.validator.js";
import { getUser } from "../controllers/user.controllers.js";

const userRouter = express.Router(); 

userRouter.get('/:userId',validate(userIdValidator), getUser); 

export default userRouter; 