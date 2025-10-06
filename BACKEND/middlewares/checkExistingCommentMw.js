import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";

export async function checkExistingCommentMw(request, response, next) {
  const { postId, commentId } = request.params;
  if (!commentId)
    return response
      .status(400)
      .json({ message: "Invalid request, missing commentId" });
  try {
    const comment = await Comment.findById(commentId);
    if (!comment)
      return response
        .status(404)
        .json({ message: `Could NOT find comment with id ${commentId}` });
    const post = await Post.findById(postId);
    if (!post)
      return response
        .status(404)
        .json({ message: `Could NOT find post with id ${postId}` });

    next();
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to check comment ${commentId}`,
      error: err.message,
    });
  }
}
