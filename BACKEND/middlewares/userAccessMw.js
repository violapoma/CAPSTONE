/**
 * checks if the userId params corresponds to the loggedUser id
 */
export function userAccessMw(request, response, next){
  const { userId } = request.params;
  const loggedId = request.loggedUser.id;

  if (userId !== loggedId)
    return response
      .status(403)
      .json({ message: "Access denied: you cannot access another user's data" });
  next();
}