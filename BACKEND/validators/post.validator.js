import Joi from "joi";
import {joiObjectId, joiObjectIdArray, joiObjectIdNotRequired } from "../helpers/joiObjectId.js";

export const postValidator = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().optional(),
  content: Joi.string().required(),
  inCommunity: joiObjectIdNotRequired(),
  author: joiObjectIdNotRequired(),
  likes: joiObjectIdArray(),
  dislikes: joiObjectIdArray(),
  comments: joiObjectIdArray(),
}); 

export const postIdValidator = Joi.object({
  postId: joiObjectId()
}).unknown(true);

export const updatePostValidator = Joi.object({
  title: Joi.string().min(1),
  subtitle: Joi.string().allow(""),
  content: Joi.string().allow(""),
}).min(1).unknown(true);
