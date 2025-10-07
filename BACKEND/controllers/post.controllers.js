import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { response } from "express";

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

/**
 * Accepts also userId as query params
 */
export async function getAllCommunityPosts(request, response) {
  const { communityId } = request.params;
  const { userId } = request.query;
  const filter = { inCommunity: communityId };
  if (userId) filter.author = userId;
  try {
    const posts = await Post.find(filter);
    return response.status(200).json({ posts });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all posts for community ${communityId} ${
        userId && `by user ${userId}`
      }`,
      error: err.message,
    });
  }
}

// export async function getUserPosts(request, response){
//   const {userId} = request.params;
//   try{
//     const posts = await Post.find({author: userId}).sort({ createdAt: -1 });
//     return response.status(200).json({posts});
//   } catch (err) {
//     return response.status(500).json({
//       message: `Something went wrong while tryng to fetch all posts for user ${userId}`,
//       error: err.message,
//     });
//   }
// }

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
    const updating = await Post.findOneAndUpdate(
      { _id: postId, author: request.loggedUser.id },
      updates,
      {
        new: true,
      }
    );
    if (!updating) {
      return response
        .status(403)
        .json({ message: "You are not allowed to edit this post" });
    }
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
    const updating = await Post.findOneAndUpdate(
      { _id: postId, authror: request.loggedUser.id },
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
    const commentsToDelete = await Comment.deleteMany({
      post: postId,
    }).session(session);
    const deleting = await Post.findOneAndDelete({
      _id: postId,
      author: request.loggedUser.id,
    }).session(session);

    if (!deleting)
      throw new Error(`Permission denied, you do not own this post`);
    await session.commitTransaction();
    return response.json({ post: deleting });
  } catch (err) {
    await session.abortTransaction();
    return response.status(500).json({
      message: `Something went wrong while tryng to delete post ${postId}`,
      error: err.message,
    });
  } finally {
    session.endSession();
  }
}
