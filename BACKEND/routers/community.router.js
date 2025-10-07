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
  joinCommunity,
  leaveCommunity,
} from "../controllers/community.controllers.js";
import { validate } from "../middlewares/validate.js";
import { uploadCommunityCover } from "../middlewares/uploadCloudinary.js";
import { adminMw } from "../middlewares/adminMw.js";
import { canManageCommunity } from "../middlewares/canManageCommunity.js";
import { checkExistingCommunityMw } from "../middlewares/checkExistingCommunityMw.js";
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

communityRouter.get("/:communityId", validate(communityIdValidator), checkExistingCommunityMw, getById);

communityRouter.patch(
  "/:communityId/description",
  validate(communityIdValidator),
  checkExistingCommunityMw,
  canManageCommunity,
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
  checkExistingCommunityMw,
  canManageCommunity,
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
  checkExistingCommunityMw,
  canManageCommunity,
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
  checkExistingCommunityMw,
  canManageCommunity,
  uploadCommunityCover.single("cover"),
  changeCover
);
communityRouter.patch(
  "/:communityId/join",
  validate(communityIdValidator),
  checkExistingCommunityMw,
  joinCommunity
);
communityRouter.patch(
  "/:communityId/leave",
  validate(communityIdValidator),
  checkExistingCommunityMw,
  leaveCommunity
);

communityRouter.delete(
  "/:communityId",
  validate(communityIdValidator),
  checkExistingCommunityMw,
  canManageCommunity,
  deleteCommunity
);

export default communityRouter;
