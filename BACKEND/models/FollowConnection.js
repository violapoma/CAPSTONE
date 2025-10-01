import mongoose, { Schema } from "mongoose";

const FollowConnectionSchema = new Schema({
  follower: {type: Schema.Types.ObjectId, ref: 'User', required:true},
  following: {type: Schema.Types.ObjectId, ref: 'User', required:true},
}, {timestamps: true}); 

FollowConnectionSchema.index({ follower: 1, following: 1 }, { unique: true });

const FollowConnection = mongoose.model('FollowConnection', FollowConnectionSchema);
export default FollowConnection; 