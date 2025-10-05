import mongoose, {Schema} from "mongoose";

const PostSchema = new Schema({
  title: {type: String, required:true, unique:true},
  subtitle: String,
  content: {type: String, required: true},
  cover: {type: String, default:"TODO: metti-default-post-cover"},
  inCommunity: {type: Schema.Types.ObjectId, ref:'Community', required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  dislikes: [{type: Schema.Types.ObjectId, ref: 'Users'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true});

export const Post = mongoose.model('Post', PostSchema); 
