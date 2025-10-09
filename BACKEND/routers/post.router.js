import express from "express";
import {
  changePostCover,
  createPost,
  deletePost,
  editPost,
  getAllCommunityPosts,
  getPost,
} from "../controllers/post.controllers.js";
import { validate } from "../middlewares/validate.js";
import {
  postIdValidator,
  postValidator,
  updatePostValidator,
} from "../validators/post.validator.js";
import { checkCommunityActiveApprovedMw } from "../middlewares/checkCommunityStatusActive.js";
import { uploadPostCover } from "../middlewares/uploadCloudinary.js";
import { changeReactionFor } from "../helpers/changeReactionFor.js";
import { Post } from "../models/Post.js";
import { checkExistingPostMw } from "../middlewares/checkExistingPostMw.js";
import { canDeletePostMw } from "../middlewares/canDeletePostMw.js";

const postRouter = express.Router({ mergeParams: true });
postRouter.post(
  "/",
  checkCommunityActiveApprovedMw,
  validate(postValidator, "body"),
  createPost
);

postRouter.get("/", getAllCommunityPosts);
postRouter.get(
  "/:postId",
  validate(postIdValidator),
  checkExistingPostMw,
  getPost
);

postRouter.patch(
  "/:postId",
  validate(postIdValidator),
  checkExistingPostMw,
  validate(updatePostValidator),
  editPost
);
postRouter.patch(
  "/:postId/like",
  (request, response, next) => {
    request.type = "likes";
    next();
  },
  validate(postIdValidator),
  checkExistingPostMw,
  changeReactionFor(Post)
);
postRouter.patch(
  "/:postId/dislike",
  (request, response, next) => {
    request.type = "dislikes";
    next();
  },
  validate(postIdValidator),
  checkExistingPostMw,
  changeReactionFor(Post)
);
postRouter.patch(
  "/:postId/cover",
  validate(postIdValidator),
  checkExistingPostMw,
  uploadPostCover.single("cover"),
  changePostCover
);

postRouter.delete(
  "/:postId",
  validate(postIdValidator),
  checkExistingPostMw,
  canDeletePostMw,
  deletePost
);

export default postRouter;
