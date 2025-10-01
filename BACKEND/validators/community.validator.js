import Joi from "joi";
import { joiObjectId, joiObjectIdArray } from "../helpers/joiObjectId.js";

export const communityValidator = Joi.object({
  name: Joi.string().required(),
  topic: Joi.string().required(),
  description: Joi.string().required().max(600),
  status: Joi.string().valid("pending", "approved", "rejected"),
  moderator: joiObjectId().required(),
  members: joiObjectIdArray().required(),
  postList: joiObjectIdArray(),
});
