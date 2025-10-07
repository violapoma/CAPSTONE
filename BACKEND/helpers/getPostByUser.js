import { Post } from "../models/Post.js";

export async function getPostByUser(request, response) {
  const { userId } = request.params;
  const id = userId ? userId : request.loggedUser.id;
  if (!id) {
    return response.status(400).json({ message: "User ID missing" });
  }
  try {
    const posts = await Post.find({ author: id }).sort({ createdAt: -1 });
    return response.status(200).json({ posts });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all posts for user ${id}`,
      error: err.message,
    });
  }
}
