import Community from "../models/Community.js";

/**
 * checks the user role -if not admin or moderator, it's not possible to handle a community 
 */
export async function canManageCommunity(request, response, next) {
  const logged = request.loggedUser;
  const { communityId } = request.params;

  try {
    const community = await Community.findById(communityId);
    if (logged.role === "admin" || community.moderator.toString() === logged.id)
      next();
    else
      return response
        .status(403)
        .json({ message: "Forbidden: not allowed to delete" });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to determin permissions for community with id ${communityId}`,
      error: err.message,
    });
  }
}
