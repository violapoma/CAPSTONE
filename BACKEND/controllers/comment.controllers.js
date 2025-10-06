import mongoose from "mongoose";
import { Comment } from "../models/Comment.js";

export async function getAllPostComments(request, response) {
  const { postId } = request.params;
  try {
    const comments = await Comment.find({ post: postId, parent: null }).populate('author');
    return response.status(200).json({ comments });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all comments for post ${postId}`,
      error: err.message,
    });
  }
}

export async function getSingleComment(request, response) {
  const { postId, commentId } = request.params;
  try {
    //check if comment belongs to post in mw
    const comment = await Comment.findById(commentId).populate('author');
    return response.status(200).json({ comment: comment });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch comment ${commentId}`,
      error: err.message,
    });
  }
}

export async function addComment(request, response) {
  const { postId, commentId } = request.params;
  const payload = request.body;
  const userId = request.loggedUser.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let parentComment;
    if (commentId) {
      parentComment = await Comment.findById(commentId);
      //check onlychild
      if(parentComment.child)
        return response.status(409).json({message: `Comment ${parentComment._id} already has an answer`});
      payload.parent = commentId;
    }
    payload.post = postId;
    payload.author = userId;

    const comment = new Comment(payload);
    await comment.save({ session });
    if (commentId) {
      parentComment.child = comment;
      await parentComment.save();
    }
    await session.commitTransaction();
    return response.status(201).json({ comment });
  } catch (err) {
    await session.abortTransaction();
    return response.status(500).json({
      message: `Something went wrong while tryng to add comment to ${postId}`,
      error: err.message,
    });
  } finally {
    session.endSession();
  }
}

export async function editComment(request, response) {
  const { commentId } = request.params;
  const payload = request.body; //just content
  try {
    const comment = await Comment.findByIdAndUpdate(commentId, payload, {
      new: true,
    });
    if (!comment)
      return response
        .status(404)
        .json({ message: `Could NOT find and update comment ${commentId}` });
    return response.status(200).json({ comment });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to edit comment ${commentId}`,
      error: err.message,
    });
  }
}

export async function deleteComment(request, response) {
  const { postId, commentId } = request.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deleting = await Comment.findById(commentId).session(session);
    if (deleting.child) {
      await deleteChildComment(deleting.child, session);
    }
    await deleting.deleteOne({ session });
    await session.commitTransaction();
    return response.status(200).json({ comment: deleting });
  } catch (err) {
    await session.abortTransaction();
    return response.status(500).json({
      message: `Something went wrong while tryng to delete comment ${commentId}`,
      error: err.message,
    });
  } finally {
    session.endSession();
  }
}

async function deleteChildComment(commentChild, session) {
  if (commentChild.child) {
    await deleteChildComment(commentChild.child, session);
  }
  await commentChild.deleteOne({ session });
}
