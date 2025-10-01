import FollowConnection from "../models/FollowConnection.js";
import User from "../models/User.js";

/**
 * This controller uses a previous inline controller that adds the field 'type' in request, which tells this function if we want the follower list or the following list.
 * @param {*} request 
 * @param {*} response 
 * @returns depending on 'type', follower list or following list
 */
export async function getFollowList(request, response) {
  const { userId } = request.params;
  const { type } = request; //from in-line middleware

  try {
    const user = await User.findById(userId);
    if (!user)
      return response.status(404).json({ message: `NOT FOUND, id: ${userId}` });

    let query, populateField;
    if (type === "followers") {
      query = { following: userId };
      populateField = "follower";
    } else if (type === "following") {
      query = { follower: userId };
      populateField = "following";
    } else {
      return response.status(400).json({ message: "follow type not valid" });
    }

    const followList = await FollowConnection.find(query).populate(
      populateField,
      "username profilePic"
    );

    return response.status(200).json(followList);
  } catch (err) {
    return response.status(500).json({
      message: `Error fetching ${type} of user with id: ${userId}`,
      error: err.message,
    });
  }
}

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @returns the new follow connection
 */
export async function followUser(request, response) {
  const { userId, followingId } = request.params;
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
  const { userId, followingId } = request.params;
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

    response.status(201).json(unfollow);
  } catch (err) {
    return response.status(500).json({
      message: `Error while ${userId} tried to follow ${followingId} `,
      error: err.message,
    });
  }
}
