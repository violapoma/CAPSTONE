import Joi from "joi";
import { joiObjectId, joiObjectIdNotRequired } from "../helpers/joiObjectId.js";

export const notificationValidator = Joi.object({
  from: joiObjectId().required(),
  category: Joi.string()
    .valid("like", "dislike", "comment", "reply", "community", "follow")
    .required(),
  sourceModel: Joi.string()
    .valid('Post', 'Comment', 'Community', 'User', 'FollowConnection')
    .required(),
  source: joiObjectIdNotRequired(),
  read: Joi.boolean()
});

export const notificationParamsValidator = Joi.object({
  userId: joiObjectId().required(),
  notificationId: joiObjectId().required(),
});