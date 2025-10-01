import Joi from "joi";
import { joiObjectId, joiObjectIdArray } from "../helpers/joiObjectId.js";

export const postValidator = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  inCommunity: joiObjectId().required(),
  author: joiObjectId().required(),
  likes: joiObjectIdArray(),
  dislikes: joiObjectIdArray(),
  comments: joiObjectIdArray(),
}); 