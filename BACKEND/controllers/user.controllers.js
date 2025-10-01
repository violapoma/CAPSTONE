import User from "../models/User.js";

export async function getUser(request, response){
  const {userId} = request.params; 
  
  try {
    const user = await User.findById(userId); 
    if(!user)
      return response.status(404).json({message: `NOT_FOUND, given id: ${userId}`}); 
    
    response.status(200).json(user);
  } catch(err) {
    return response.status(500).json({
      message: `Error fetching user with id: ${userId}`,
      error: err.message
    });
  }
}