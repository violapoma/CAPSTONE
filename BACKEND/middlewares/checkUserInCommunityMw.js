import Community from "../models/Community.js";

export async function checkUserInCommunityMw(request, response, next){
  const {communityId} = request.params; 
  const userId = request.loggedUser.id; 
  try{
    const community = await Community.findById(communityId); 
    if(community.members.find(user => user._id.toString() === userId.toString())){
      console.log('user in community')
      next(); 

    }
    else return response.status(404).json({message: `User ${userId} is not a member of community ${community.name}`}); 
  }catch (err) {
    return response.status(500).json({
      message: "User ",
      error: err.message,
    });
  }
}