import { toggleReaction } from "../helpers/toggleReaction.js";
import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { createNotification } from "./createNotification.js";

export function changeReactionFor(Model) {
  return async function (request, response) {
    const { postId, commentId } = request.params;
    const userId = request.loggedUser.id;
    const type = request.type;
    const id = Model === Comment ? commentId : postId;

    try {
      const doc = await toggleReaction(Model, id, userId, type);
      let communityId = null;
      let postIdForMeta;

      if (Model.modelName === "Post") {
        communityId = doc.inCommunity?._id || doc.inCommunity;
        postIdForMeta = postId; 
      } else if (Model.modelName === "Comment") {
        const parentPost = await Post.findById(doc.post).select("inCommunity");
        communityId = parentPost?.inCommunity;
        postIdForMeta = doc.post;
      }

      console.log({
        from: userId,
        category: "like",
        source: doc._id,
        sourceModel: Model.modelName, 
        meta: { communityId, postId: postIdForMeta }
      });
      
      //notification
      if (type === "likes" && doc.likes.includes(userId)) {
        const authorId = doc.author?._id || doc.author;

        if (authorId.toString() !== userId.toString()) {
          await createNotification(authorId, {
            from: userId,
            category: "like",
            source: doc._id,
            sourceModel: Model.modelName, 
            meta: {
              communityId,
              postId: postIdForMeta
            }
          });
        }
      }
      if (type === "dislikes" && doc.dislikes.includes(userId)) {
        const authorId = doc.author?._id || doc.author;
        if (authorId.toString() !== userId.toString()) {
          await createNotification(authorId, {
            from: userId,
            category: "dislike",
            source: doc._id,
            sourceModel: Model.modelName,
            meta: {
              communityId,
              postId: postIdForMeta
            }
          });
        }
      }
      
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