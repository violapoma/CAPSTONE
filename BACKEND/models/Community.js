import mongoose, { Schema } from "mongoose";

const CommunitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, immutable: true },
    topic: { type: String, required: true, immutable: true },
    cover: { type: String, default: "TODO: metti-default-community" },
    description: { type: String, required: true},
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    postList: {
      type: [{ type: Schema.Types.ObjectId, ref: "Post" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Community = mongoose.model('Community', CommunitySchema); 
export default Community; 