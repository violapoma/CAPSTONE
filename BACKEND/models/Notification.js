import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const NotificationSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      mongooseAutoPopulate: {
        populate: {
          path: "author",
          select: "username profilePic",
        },
      },
    },
    targetUser: {type: Schema.Types.ObjectId, ref: "User"},
    category: {
      type: String,
      enum: ["like", "dislike", "comment", "reply", "community", "follow", "unfollow"],
      required: true,
    },
    sourceModel: {
      type: String,
      enum: ["Post", "Comment", "Community", "User", "FollowConnection"],
      required: function() {
        return this.category !== "follow" && this.category !== "unfollow";
      },
    },
    source: {
      type: Schema.Types.ObjectId,
      refPath: "sourceModel",
      autopopulate: true,
      required: function() {
        return this.category !== "follow" && this.category !== "unfollow";
      }
    },
    meta: {
      commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
      communityName: String,
      communityId: {type: Schema.Types.ObjectId, ref: "Community"},
      postId: {type: Schema.Types.ObjectId, ref: "Post"},

      details: String,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.plugin(mongooseAutoPopulate);
export default NotificationSchema;
