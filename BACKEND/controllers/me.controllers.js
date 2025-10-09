import mongoose from "mongoose";
import User from "../models/User.js";
import FollowConnection from "../models/FollowConnection.js";
import Community from "../models/Community.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";

/**
 * @param {*} request
 * @param {*} response
 * @returns the logged user, stored in request via authMw
 */
export async function getMe(request, response) {
  try {
    const me = request.loggedUser;
    return response.status(200).json(me);
  } catch (err) {
    return response
      .status(500)
      .json({ message: "error fetching logged user", error: err.message });
  }
}

/**
 * updates the loggedUser info
 * @param {*} request
 * @param {*} response
 * @returns the updated loggedUser
 */
export async function editMe(request, response) {
  try {
    const id = request.loggedUser.id;
    const payload = request.body;

    const updatedUser = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedUser)
      return response
        .status(404)
        .json({ message: `User NOT found, unable to update (id: ${id})` });

    return response.status(200).json(updatedUser);
  } catch (err) {
    return response.status(500).json({
      message: "Something went wrong while tryng to update loggedUser infos",
      error: err.message,
    });
  }
}

/**
 * changes the password of the loggedUser
 * @param {*} request
 * @param {*} response
 * @returns success or error message
 */
export async function changePassword(request, response) {
  const id = request.loggedUser.id;
  try {
    const { password } = request.body;

    const user = await User.findById(id).select("+password");
    if (!user)
      return response
        .status(404)
        .json({ message: `User NOT found, unable to update (id: ${id})` });

    user.password = password;
    await user.save();

    return response.status(200).json({ message: "Password updated" });
  } catch (err) {
    return response.status(500).json({
      message: "Something went wrong while tryng to update loggedUser password",
      error: err.message,
    });
  }
}

/**
 * changes the user's profile picture
 * @param {*} request
 * @param {*} response
 * @returns success or error message
 */
export async function changeProfilePic(request, response) {
  const id = request.loggedUser;
  const imgPath = request.file?.path;
  if (!imgPath)
    return response
      .status(400)
      .json({ message: "Picture not found in request", error: err.message });
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic: imgPath },
      { new: true }
    );
    if (!updatedUser)
      return response.status(404).json({
        message: "User not found, unable to update profile pic",
        error: err.message,
      });

    response.status(200).json(updatedUser);
  } catch (err) {
    return response.status(500).json({
      message:
        "Something went wrong while tryng to update loggedUser profile pic",
      error: err.message,
    });
  }
}

/**
 * deletes the loggedUser and all their references
 * @param {*} request
 * @param {*} response
 * @returns success or error message
 */
export async function deleteMe(request, response) {
  const id = request.loggedUser.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //follow connection
    await FollowConnection.deleteMany({
      $or: [{ follower: id }, { following: id }],
    }).session(session);

    //community - member
    await Community.updateMany(
      { members: id },
      { $pull: { members: id } },
      { session }
    );

    //community - moderator> update with admin as moderator 
    const admin = await User.findOne({ username: "admin" });
    if (admin) {
      await Community.updateMany(
        { moderator: id },
        { moderator: admin._id },
        { session }
      );
    }

    //posts, comments, likes
    await Comment.updateMany({}, { $pull: { likes: id, dislikes: id } }).session(session);
    await Post.updateMany({}, { $pull: { likes: id, dislikes: id } }).session(session);
    await Post.deleteMany({ author: id }).session(session);
    await Comment.deleteMany({ author: id }).session(session);

    //deleting user
    const deleting = await User.findByIdAndDelete(id).session(session);

    if (!deleting) throw new Error(`User ${id} not found, unable to delete`);

    await session.commitTransaction();
    return response
      .status(200)
      .json({ message: `user ${request.loggedUser.username} deleted` });
  } catch (err) {
    await session.abortTransaction();
    return response.status(500).json({
      message: "Something went wrong while tryng to delete loggedUser",
      error: err.message,
    });
  } finally {
    await session.endSession();
  }
}
