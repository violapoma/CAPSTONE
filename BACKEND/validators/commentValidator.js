import Joi from "joi";
import { joiObjectId, joiObjectIdArray } from "../helpers/joiObjectId.js";

export const commentValidator = Joi.object({
  parent: joiObjectId(),
  author: joiObjectId().required(),
  content: Joi.string().max(300),
  likes: joiObjectIdArray(),
  displikes: joiObjectIdArray(),
});