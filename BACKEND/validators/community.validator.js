import Joi from "joi";
import { joiObjectId, joiObjectIdArray } from "../helpers/joiObjectId.js";

const exaPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/; //#fff || #ffffff

export const communityValidator = Joi.object({
  name: Joi.string().lowercase().required(),
  topic: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .required(),
  description: Joi.string().required().max(600),
  guidelines: Joi.string().optional(),
  status: Joi.string().valid("pending", "approved", "rejected"),
  active: Joi.boolean().default(false),
  style: Joi.object({
    backgroundColor: Joi.string().pattern(exaPattern).default("#f7f3f2"),
    titleColor: Joi.string().pattern(exaPattern).default("#000000"),
    secondaryColor: Joi.string().pattern(exaPattern).default("#d5c9c9"),
  }).default(),
  moderator: joiObjectId().optional(),
  members: joiObjectIdArray().optional(),
  postList: joiObjectIdArray().optional(),
});

export const communityIdValidator = Joi.object({
  communityId: joiObjectId().required(),
}).unknown(true);

export const updateCommunityValidator = Joi.object({
  description: Joi.string().min(1).max(600).required(),
  guidelines: Joi.string().max(600).optional(),
  style: Joi.object({
    backgroundColor: Joi.string().pattern(exaPattern).default("#f7f3f2"),
    titleColor: Joi.string().pattern(exaPattern).default("#000000"),
    secondaryColor: Joi.string().pattern(exaPattern).default("#d5c9c9"),
  }).default().required(),
});

export const changeStatusValidator = Joi.object({
  status: Joi.string().valid("pending", "approved", "rejected").required(),
})

export const changeStyleValidator = Joi.object({
  style: Joi.object({
    backgroundColor: Joi.string().pattern(exaPattern).default("#f7f3f2"),
    titleColor: Joi.string().pattern(exaPattern).default("#000000"),
    secondaryColor: Joi.string().pattern(exaPattern).default("#d5c9c9"),
  }).default().required(),
});
export const changeDescrValidator = Joi.object({
  description: Joi.string().min(1).max(600).required(),
});
