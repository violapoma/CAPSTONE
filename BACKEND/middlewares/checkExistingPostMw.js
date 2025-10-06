import { Post } from "../models/Post.js";

export async function checkExistingPostMw(request, response, next) {
  const { postId } = request.params;
  if (!postId)
    return response
      .status(400)
      .json({ message: "Invalid request, missing postId" });
  try {
    const post = await Post.findById(postId);
    if (!post)
      return response
        .status(404)
        .json({ message: `Could NOT find post with id ${postId}` });
    next();
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to check post ${postId}`,
      error: err.message,
    });
  }
}
