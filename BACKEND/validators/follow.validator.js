import Joi from "joi";
import { joiObjectId } from "../helpers/joiObjectId.js";

export const followValidator = Joi.object({
  follower: joiObjectId().required(),
  followeing: joiObjectId().required(),
}); 

export const followingUserValidator = Joi.object({
  followingId: joiObjectId().required(),
});

export const followUserId = Joi.object({
  userId: joiObjectId().required(),
}); 