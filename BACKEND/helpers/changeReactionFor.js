import { toggleReaction } from "../helpers/toggleReaction.js";
import { Comment } from "../models/Comment.js";

export function changeReactionFor(Model) {
  return async function (request, response) {
    const { postId, commentId } = request.params;
    const userId = request.loggedUser.id;
    const type = request.type;
    const id = Model === Comment ? commentId : postId;

    try {
      const doc = await toggleReaction(Model, id, userId, type);
      return response.status(200).json({
        [type]: doc[type],
      });
    } catch (err) {
      return response.status(500).json({
        message: `Something went wrong while trying to ${type} document`,
        error: err.message,
      });
    }
  };
}