import mongoose from "mongoose";
import { Comment } from "../models/Comment.js";
import { createNotification } from "../helpers/createNotification.js";
import { Post } from "../models/Post.js";

//parent - child - nephew, no more
export async function getAllPostComments(request, response) {
  const { postId } = request.params;
  try {
    const comments = await Comment.find({ post: postId, parent: null })
      .populate("author")
      .populate({
        path: "child",
        model: "Comment",
        populate: [
          { path: "author", model: "User" },
          {
            path: "child",
            model: "Comment",
            populate: {
              path: "author",
              model: "User",
            },
          },
        ],
      });
    return response.status(200).json(comments);
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
    const comment = await Comment.findById(commentId).populate("author");
    return response.status(200).json(comment);
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
      if (parentComment.child)
        return response.status(409).json({
          message: `Comment ${parentComment._id} already has an answer`,
        });
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
    const originalPost = await Post.findById(comment.post).populate('author');
    if (originalPost.author._id.toString() !== userId.toString()) {
      await createNotification(originalPost.author._id, {
        from: userId,
        category: commentId ? "reply" : "comment",
        source: originalPost._id,
        sourceModel: "Post",
        meta: {
          communityId: originalPost.inCommunity
        }
      });
    }
    if (
      commentId &&
      parentComment.author.toString() !== userId.toString() &&
      parentComment.author.toString() !== originalPost.author._id.toString()
    ) {
      await createNotification(parentComment.author, {
        from: userId,
        category: "reply",
        source: originalPost._id,
        sourceModel: "Post",
        meta: {
          communityId: originalPost.inCommunity
        }
      });
    }

    await session.commitTransaction();
    return response.status(201).json(comment);
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
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, author: request.loggedUser.id },
      payload,
      {
        new: true,
      }
    );
    if (!comment)
      return response
        .status(404)
        .json({ message: `Could NOT find and update comment ${commentId}` });
    return response.status(200).json(comment);
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
    const deleting = await Comment.findOne({
      _id: commentId,
      author: request.loggedUser.id,
    })
      .session(session);

    if (!deleting) {
      await session.abortTransaction();
      return response
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }
    const parentId = deleting.parent;
    const childId = deleting.child; 
    if (childId) {
      await deleteChildComment(childId, session);
    }
    await deleting.deleteOne({ session });

    if (parentId) {
      await Comment.updateOne(
        { _id: parentId },
        { $set: { child: null } },
        { session }
      );
    }
    await session.commitTransaction();
    return response.status(200).json(deleting);
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
  if(!commentChild) return;
  const comment = await Comment.findById(commentChild).session(session);
  if (!comment) return;
  const nextChildId = comment.child;
  await comment.deleteOne({ session });
  if (nextChildId) {
    await deleteChildComment(nextChildId, session);
}
}
