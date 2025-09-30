import mongoose, { Schema } from "mongoose";

const FollowConnectionSchema = new Schema({
  follower: {type: Schema.Types.ObjectId, ref: 'User', required},
  following: {type: Schema.Types.ObjectId, ref: 'User', required},
}, {timestamps: true}); 

const FollowConnection = mongoose.model('FollowConnection', FollowConnectionSchema);
export default FollowConnection; 