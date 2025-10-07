import { Comment } from "../models/Comment.js";

export function changeReactionFor(Model) {
  return async function (request, response) {
    const { postId, commentId } = request.params; 
    const userId = request.loggedUser.id;
    const type = request.type; 

    if (!["likes", "dislikes"].includes(type))
      return response.status(400).json({ message: "Invalid request" });

    const field = type === "likes" ? "likes" : "dislikes";
    const oppositeField = type === "likes" ? "dislikes" : "likes";

    try {
    
      const id = Model === Comment ? commentId : postId;
      const doc = await Model.findById(id);
      const oppositeIndex = doc[oppositeField].findIndex(id => id.toString() === userId);
      if (oppositeIndex !== -1) doc[oppositeField].splice(oppositeIndex, 1);

      //toggle
      const index = doc[field].findIndex(id => id.toString() === userId);
      if (index !== -1) doc[field].splice(index, 1);
      else doc[field].push(userId);

      await doc.save();
      return response.status(200).json({ [field]: doc[field], [oppositeField]: doc[oppositeField] });
    } catch (err) {
      return response.status(500).json({
        message: `Something went wrong while trying to ${type} document`,
        error: err.message,
      });
    }
  };
}
