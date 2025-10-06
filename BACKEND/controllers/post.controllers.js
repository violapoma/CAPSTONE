import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";

export async function createPost(request, response) {
  let payload = request.body;
  const userId = request.loggedUser?.id;
  const { communityId } = request.params;
  if (!userId || !communityId)
    return response.status(400).json({ message: "Invalid request" });
  try {
    const existing = await Post.findOne({ title: payload.title });
    if (existing)
      return response
        .status(409)
        .json({ message: `A post named ${payload.title} already exists` });

    payload.inCommunity = communityId;
    payload.author = userId;
    const newPost = new Post(payload);
    await newPost.save();
    return response.status(201).json({ post: newPost });
  } catch (err) {
    return response.status(500).json({
      message: "Something went wrong while tryng to create a new post",
      error: err.message,
    });
  }
}

export async function getAllCommunityPosts(request, response) {
  const { communityId } = request.params;
  try {
    const posts = await Post.find({ inCommunity: communityId });
    return response.status(200).json({ posts });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all posts for community ${communityId}`,
      error: err.message,
    });
  }
}

//TODO: GET by user

export async function getPost(request, response) {
  const { postId } = request.params;
  try {
    const post = await Post.findById(postId);
    return response.status(200).json({ post });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch post ${postId}`,
      error: err.message,
    });
  }
}

export async function editPost(request, response) {
  const { postId } = request.params;
  const updates = request.body;
  try {
    const updating = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
    });
    if (!updating)
      return response.status(404).json({ message: "Post not found" });

    response.json({ post: updating });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update post ${postId}`,
      error: err.message,
    });
  }
}

export async function changePostCover(request, response) {
  const { postId } = request.params;
  const imgPath = request.file?.path;
  if (!imgPath)
    return response
      .status(400)
      .json({ message: "Picture not found in request" });
  try {
    const updating = await Post.findByIdAndUpdate(
      postId,
      { cover: imgPath },
      { new: true }
    );
    if (!updating)
      return response
        .status(404)
        .json({ message: `Could NOT find post with id ${postId}` });
    return response.status(200).json({ post: updating });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update the cover of the post with id ${id}`,
      error: err.message,
    });
  }
}

export async function deletePost(request, response) {
  const { postId } = request.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const commentsToDelete = await Comment.deleteMany({post: postId}).session(session); 
    const deleting = await Post.findByIdAndDelete(postId).session(session);

    if (!deleting)
      throw new Error(`Post ${postId} not found, unable to delete`);
    await session.commitTransaction();
    return response.json({ post: deleting });
  } catch (err) {
    await session.abortTransaction();
    return response.status(500).json({
      message: `Something went wrong while tryng to delete post ${postId}`,
      error: err.message,
    });
  } finally{
    session.endSession();
  }
}
