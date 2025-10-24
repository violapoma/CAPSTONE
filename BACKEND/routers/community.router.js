import express from "express";

import {
  changeStatusValidator,
  communityIdValidator,
  communityValidator,
} from "../validators/community.validator.js";
import {
  changeCover,
  changeStatus,
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getById,
  getByStatus,
  joinCommunity,
  leaveCommunity,
  updateCommunity,
} from "../controllers/community.controllers.js";
import { validate } from "../middlewares/validate.js";
import { uploadCommunityCover } from "../middlewares/uploadCloudinary.js";
import { adminMw } from "../middlewares/adminMw.js";
import { canManageCommunity } from "../middlewares/canManageCommunity.js";
import { checkExistingCommunityMw } from "../middlewares/checkExistingCommunityMw.js";
import authMW from "../middlewares/authMW.js";
const communityRouter = express.Router();

//oublic route
communityRouter.get(
  "/approved",
  (request, response, next) => {
    request.type = "approved";
    next();
  },
  getByStatus
);

//protected routes
communityRouter.use(authMW);
communityRouter.post(
  "/",
  validate(communityValidator, "body"),
  createCommunity
);

communityRouter.get("/", getAllCommunities);

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
  "/:communityId/status",
  validate(communityIdValidator),
  checkExistingCommunityMw,
  adminMw(["admin"]),
  validate(changeStatusValidator, 'body'),
  changeStatus
);

communityRouter.put('/:communityId', validate(communityIdValidator), checkExistingCommunityMw, updateCommunity); //TODO; METTI VALIDATOR PER I CAMPI MODIFICABILI

communityRouter.patch(
  "/:communityId/cover",
  validate(communityIdValidator),
  checkExistingCommunityMw,
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
