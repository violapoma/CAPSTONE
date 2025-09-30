import { Schema } from "mongoose";

const NotificationSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["like", "dislike", "reply", "community", "follow"],
    required: true,
  },
  sourceModel: {
    type: String,
    enum: ["Post", "Comment", "Community", "User"],
    required: true,
  },
  source: {
    type: Schema.Types.ObjectId, refPath: "sourceModel",
    required: true,
  },
  meta: {
    commentId: {type: Schema.Types.ObjectId, ref: "Comment"},
    details: String,
  },
  read: {type: Boolean, default: false}
}, {timestamps: true});

export default NotificationSchema;
