import mongoose from "mongoose";
import Community from "../models/Community.js";

/**
 * checks if the community status is approved AND if it's active AND if loggedUser is a member, otherwise it's not possible to interact with.
 */
export async function checkCommunityActiveApprovedMw(request, response, next) {
  console.log('req.params', request.params);
  const communityId = request.params.communityId;
  const userId = request.loggedUser.id; 
  const userObjectId = new mongoose.Types.ObjectId(userId);

  console.log('communityId', communityId, 'userId', userId);
  
  const community = await Community.findOne({
    _id: communityId,
    active: true,
    status: "approved",
    members: userObjectId
  });
  if (!community) {
    return response.status(400).json({ message: "Community NOT available or user NOT a member" });
  } 

  next();
}