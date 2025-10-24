import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import mailer from "../helpers/mailer.js";

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
    return response.status(201).json(newPost);
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
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    return response.status(200).json(posts);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all posts for community ${communityId} ${
        userId && `by user ${userId}`
      }`,
      error: err.message,
    });
  }
}

export async function getPost(request, response) {
  const { postId } = request.params;
  try {
    const post = await Post.findById(postId)
      .sort({ createdAt: -1 })
      .populate("author inCommunity");
    return response.status(200).json(post);
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
    response.json(updating);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update post ${postId}`,
      error: err.message,
    });
  }
}

export async function changePostCover(request, response) {
  const { postId } = request.params;
  const userId = request.loggedUser._id;
  const imgPath = request.file?.path;
  if (!imgPath)
    return response
      .status(400)
      .json({ message: "Picture not found in request" });
  console.log(imgPath);
  try {
    const updating = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { cover: imgPath },
      { new: true }
    );
    if (!updating)
      return response
        .status(404)
        .json({ message: `Could NOT add pic to post with id ${postId}` });
    return response.status(200).json(updating);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update the cover of the post with id ${postId}`,
      error: err.message,
    });
  }
}

export async function deletePost(request, response) {
  const { postId } = request.params;
  const postData = await Post.findById(postId)
    .populate("author", "email")
    .select("title author");

  if (!postData) {
    return response.status(404).json({ message: "Post not found." });
  }

  const authorEmail = postData.author?.email;
  const postTitle = postData.title;
  const postAuthorId = postData.author._id;
  const isAuthor =
    request.loggedUser._id.toString() === postAuthorId.toString();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const commentsToDelete = await Comment.deleteMany({
      post: postId,
    }).session(session);
    const deleting = await Post.findOneAndDelete({
      _id: postId,
      author: request.loggedUser._id,
    }).session(session);

    if (!isAuthor && authorEmail) {
      // const recipient = deleting.members?.map((member) => member.email);
      const html = `
    <h1>Hey 😪</h1>
    <h2>Unfortunately, your post ${postTitle} has been deleted.</h2>
    <p>
    Our staff or the community moderator did not find it appropriate. We advise you to change the subject or review the community guidelines before you try again! Feel free to contact us for any additional info.
    </p>
    To your next idea!
  `;
      mailer.sendMail({
        to: authorEmail,
        subject: `Your post '${deleting.title}' has been deleted`,
        html: html,
        from: "violapoma@gmail.com",
      });
    }
    if (!deleting)
      throw new Error(`Permission denied, you do not own this post`);
    await session.commitTransaction();
    return response.json(deleting);
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
