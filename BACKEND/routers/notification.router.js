import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  changeNotificationStatus,
  createNotification,
  getAllNotifications,
} from "../controllers/notification.controllers.js";
import {
  notificationParamsValidator,
  notificationValidator,
} from "../validators/notification.validator.js";

const notificationRouter = express.Router({ mergeParams: true });

notificationRouter.post(
  "/",
  validate(notificationValidator, "body"),
  createNotification
);
notificationRouter.get("/", getAllNotifications);
notificationRouter.patch(
  "/:notificationId/read",
  validate(notificationParamsValidator),
  changeNotificationStatus
);

export default notificationRouter;
