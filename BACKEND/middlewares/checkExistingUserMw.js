import User from "../models/User.js";

export async function checkExistingUserMw(request, response, next) {
  const {userId, followingId} = request.params;
  const id = userId ? userId : followingId; 
  try {
    const user = await User.findById(id);
    if (!user)
      return response
        .status(404)
        .json({ message: `Could NOT find user with id ${id}` });

    next();
  } catch (err) {
    return response.status(500).json({
      message: `Check if user ${id} exists FAILED`,
      error: err.message,
    });
  }
}
