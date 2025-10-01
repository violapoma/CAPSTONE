import Joi from "joi";
import { joiObjectId } from "../helpers/joiObjectId.js";

export const followValidator = Joi.object({
  follower: joiObjectId().required(),
  followeing: joiObjectId().required(),
}); 

export const followParamsValidator = Joi.object({
  userId: joiObjectId().required(),
  followingId: joiObjectId().required(),
});

export const followUserId = Joi.object({
  userId: joiObjectId().required(),
}); 