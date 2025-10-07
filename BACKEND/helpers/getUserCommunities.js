import Community from "../models/Community.js";

export async function getUserCommunities(request, response) {
  const { userId } = request.params;
  const id = userId ? userId : request.loggedUser.id;
  if (!id) {
    return response.status(400).json({ message: "User ID missing" });
  }
  try {
    const moderating = await Community.find({ moderator: id }).sort({
      createdAt: -1,
    });
    const memberOf = await Community.find({
      members: id,
      moderator: { $ne: id },
    });
    return response.status(200).json({ moderating, memberOf });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all communities for user ${id}`,
      error: err.message,
    });
  }
}
