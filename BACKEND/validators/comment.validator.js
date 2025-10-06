import Joi from "joi";
import { joiObjectId, joiObjectIdArray, joiObjectIdNotRequired } from "../helpers/joiObjectId.js";

export const commentValidator = Joi.object({
  parent: joiObjectIdNotRequired(),
  author: joiObjectIdNotRequired(),
  content: Joi.string().max(300),
  likes: joiObjectIdArray(),
  displikes: joiObjectIdArray(),
});

export const commentIdValidator = Joi.object({
  commentId: joiObjectId() 
}).unknown(true); 