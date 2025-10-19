import { createNotification } from "../helpers/createNotification.js";
import FollowConnection from "../models/FollowConnection.js";
import User from "../models/User.js";

/**
 * userId: loggeduser
 * followingId: user I want to follow
 * @param {*} request 
 * @param {*} response 
 * @returns the new follow connection
 */
export async function followUser(request, response) {
  const { followingId } = request.params;
  const userId = request.loggedUser._id; 
  if (userId == followingId)
    return response
      .status(400)
      .json({ message: "you are trying to follow yourself..." });

  const connection = {
    follower: userId,
    following: followingId,
  };
  
  try {
    const user = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!user) return response.status(404).json({ message: "user NOT FOUND" });
    if (!following)
      return response.status(404).json({ message: "following NOT FOUND" });

    const existing = await FollowConnection.findOne(connection);
    if(existing) 
      return response.status(400).json({message: `${userId} already follows ${followingId}`}); 

    const follow = new FollowConnection(connection);

    await createNotification(followingId, {
      from: userId,
      category: "follow",
    });

    await follow.save();

    response.status(201).json(follow);
  } catch (err) {
    return response.status(500).json({
      message: `Error while ${userId} tried to follow ${followingId} `,
      error: err.message,
    });
  }
}

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @returns the deleted connection
 */
export async function unfollowUser(request, response){
  const { followingId } = request.params;
  const userId = request.loggedUser.id;
  if (userId == followingId)
    return response
      .status(400)
      .json({ message: "you are trying to unfollow yourself..." });

  const connection = {
    follower: userId,
    following: followingId,
  };

  try {
    const user = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!user) return response.status(404).json({ message: "user NOT FOUND" });
    if (!following)
      return response.status(404).json({ message: "following NOT FOUND" });

    const existing = await FollowConnection.findOne(connection);
    if(!existing) 
      return response.status(400).json({message: `${userId} does not follow ${followingId} yet`}); 

    const unfollow = await FollowConnection.findOneAndDelete(connection);

    await createNotification(followingId, {
      from: userId,
      category: "unfollow",
    });

    response.status(201).json(unfollow);
  } catch (err) {
    return response.status(500).json({
      message: `Error while ${userId} tried to follow ${followingId} `,
      error: err.message,
    });
  }
}


