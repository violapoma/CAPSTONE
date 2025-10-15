import FollowConnection from "../models/FollowConnection.js";
import User from "../models/User.js";

/**
 * This controller uses a previous inline controller that adds the field 'type' in request, which tells this function if we want the follower list or the following list.
 * @param {*} request 
 * @param {*} response 
 * @returns depending on 'type', follower list or following list
 */
export async function getFollowList(request, response) {
  const otherUser = request.params.userId;
  const userId = otherUser ? otherUser : request.loggedUser.id;
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