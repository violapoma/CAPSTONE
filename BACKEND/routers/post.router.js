import express from "express";
import {
  changePostCover,
  //changeReaction,
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
import { checkExistingCommunityMw } from "../middlewares/checkExistingCommunityMw.js";
import { uploadPostCover } from "../middlewares/uploadCloudinary.js";
import { changeReactionFor } from "../helpers/changeReactionFor.js";
import { Post } from "../models/Post.js";

const postRouter = express.Router({ mergeParams: true });

postRouter.post(
  "/",
  checkExistingCommunityMw,
  checkCommunityActiveApprovedMw,
  validate(postValidator, "body"),
  createPost
);

postRouter.get("/", getAllCommunityPosts);
//TODO: GET by user
postRouter.get("/:postId", validate(postIdValidator), getPost);

postRouter.patch(
  "/:postId",
  validate(postIdValidator),
  validate(updatePostValidator),
  editPost
);
// postRouter.patch('/:postId/like', validate(postIdValidator),likePost);
postRouter.patch(
  "/:postId/like",
  (request, response, next) => {
    request.type = "likes";
    next();
  },
  validate(postIdValidator),
  changeReactionFor(Post)
);
postRouter.patch(
  "/:postId/dislike",
  (request, response, next) => {
    request.type = "dislikes";
    next();
  },
  validate(postIdValidator),
  changeReactionFor(Post)
);
postRouter.patch(
  "/:postId/cover",
  validate(postIdValidator),
  uploadPostCover.single("cover"),
  changePostCover
);

postRouter.delete("/:postId", validate(postIdValidator), deletePost);

export default postRouter;
