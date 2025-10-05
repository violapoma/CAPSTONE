import User from "../models/User.js";

export async function checkExistingUserMw(request, response, next) {
  const {userId} = request.params;
  try {
    const user = await User.findById(userId);
    if (!user)
      return response
        .status(404)
        .json({ message: `Could NOT find user with id ${userId}` });

    next();
  } catch (err) {
    return response.status(500).json({
      message: `Check if user ${userId} exists FAILED`,
      error: err.message,
    });
  }
}
