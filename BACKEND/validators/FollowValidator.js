import Joi from "joi";
import { joiObjectId } from "../helpers/joiObjectId.js";

export const followValidator = Joi.object({
  follower: joiObjectId().required(),
  followeing: joiObjectId().required(),
}); 