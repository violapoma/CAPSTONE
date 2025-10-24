import Community from "../models/Community.js";
import { Post } from "../models/Post.js";

export async function canDeletePostMw(request, response, next){
  const {postId} = request.params; 
  if (request.loggedUser.role === 'admin')
    return next(); 
  try{
    const post = await Post.findById(postId);
    const community = await Community.findById({_id: post.inCommunity}); 
    if(request.loggedUser._id === post.author || request.loggedUser._id === community.moderator) 
      return next();
    
    return response.status(403).json({message: 'You do not have permission to delete this post'}); 
  } catch(err){
    return response.status(500).json({message: 'Something went wrong while checking for permission to delete post'}); 
  }
}