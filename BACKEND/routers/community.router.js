import express from "express";

import {
  changeDescrValidator,
  changeStatusValidator,
  changeStyleValidator,
  communityIdValidator,
  communityValidator,
} from "../validators/community.validator.js";
import {
  changeCover,
  changeField,
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getById,
  getByStatus,
  getMyCommunitiesAs,
  joinCommunity,
  leaveCommunity,
} from "../controllers/community.controllers.js";
import { validate } from "../middlewares/validate.js";
import { uploadCommunityCover } from "../middlewares/uploadCloudinary.js";
import { adminMw } from "../middlewares/adminMw.js";
import { canManageCommunity } from "../middlewares/canManageCommunity.js";

const communityRouter = express.Router();

communityRouter.post(
  "/",
  validate(communityValidator, "body"),
  createCommunity
);

communityRouter.get("/", getAllCommunities);
communityRouter.get(
  "/approved",
  (request, response, next) => {
    request.type = "approved";
    next();
  },
  getByStatus
);
communityRouter.get(
  "/pending",
  (request, response, next) => {
    request.type = "pending";
    next();
  },
  getByStatus
);
communityRouter.get(
  "/moderator-of",
  (request, response, next) => {
    request.type = "moderator";
    next();
  },
  getMyCommunitiesAs
);
communityRouter.get(
  "/member-of",
  (request, response, next) => {
    request.type = "member";
    next();
  },
  getMyCommunitiesAs
);
communityRouter.get("/:communityId", validate(communityIdValidator), getById);

communityRouter.patch(
  "/:communityId/description",
  validate(communityIdValidator),
  (request, response, next) => {
    request.type = "description";
    next();
  },
  validate(changeDescrValidator, "body"),
  changeField
);
communityRouter.patch(
  "/:communityId/status",
  validate(communityIdValidator),
  (request, response, next) => {
    request.type = "status";
    next();
  },
  adminMw(["admin"]),
  validate(changeStatusValidator, 'body'),
  changeField
);
communityRouter.patch(
  "/:communityId/style",
  validate(communityIdValidator),
  (request, response, next) => {
    request.type = "style";
    next();
  },
  validate(changeStyleValidator, "body"),
  changeField
);
communityRouter.patch(
  "/:communityId/cover",
  validate(communityIdValidator),
  uploadCommunityCover.single("cover"),
  changeCover
);
communityRouter.patch(
  "/:communityId/join",
  validate(communityIdValidator),
  joinCommunity
);
communityRouter.patch(
  "/:communityId/leave",
  validate(communityIdValidator),
  leaveCommunity
);

communityRouter.delete(
  "/:communityId",
  validate(communityIdValidator),
  canManageCommunity,
  deleteCommunity
);

export default communityRouter;
