import mongoose, { Schema } from "mongoose";

const CommunitySchema = new mongoose.Schema(
  {
    name: { type: String, lowercase: true, required: true, immutable: true, unique: true},
    topic: [{ type: String, required: true, immutable: true }],
    cover: { type: String, default: "https://res.cloudinary.com/dm9gnud6j/image/upload/v1759663013/nocover_d78avw.jpg" },
    description: { type: String, required: true, max: 600},
    guidelines: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    active: {type: Boolean, default: false},
    style: {
      backgroundColor: { type: String, default: "#f7f3f2" },
      titleColor:   { type: String, default: "#000000" },
      secondaryColor: { type: String, default: "#d5c9c9" }
    },
    moderator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    }
  },
  { timestamps: true }
);

const Community = mongoose.model('Community', CommunitySchema); 
export default Community; 