import Joi from "joi";
import { joiObjectId, joiObjectIdNotRequired } from "../helpers/joiObjectId.js";

export const notificationValidator = Joi.object({
  from: joiObjectId(),
  targetUser: joiObjectId(),
  category: Joi.string()
    .valid(
      "like",
      "dislike",
      "comment",
      "reply",
      "community",
      "follow",
      "unfollow"
    )
    .required(),
  sourceModel: Joi.when("category", {
    not: Joi.valid("follow", "unfollow"),
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  source: Joi.when("category", {
    not: Joi.valid("follow", "unfollow"),
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  meta: Joi.object({
    commentId: Joi.string(),
    details: Joi.string(),
  }),
  read: Joi.boolean(),
});

export const notificationParamsValidator = Joi.object({
  notificationId: joiObjectId().required(),
});
