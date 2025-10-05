import Community from "../models/Community.js";

export async function checkExistingCommunityMw(request, response, next) {
  const { communityId } = request.params;
  try {
    const community = await Community.findById(communityId);
    if (!communityId)
      return response
        .status(404)
        .json({ message: `Could NOT find community with id ${communityId}` });

    next();
  } catch (err) {
    return response.status(500).json({
      message: `Check if community ${communityId} exists FAILED`,
      error: err.message,
    });
  }
}
