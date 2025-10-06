import mongoose, {Schema} from "mongoose";

const PostSchema = new Schema({
  title: {type: String, required:true, unique:true},
  subtitle: String,
  content: {type: String, required: true},
  cover: {type: String, default:"https://res.cloudinary.com/dm9gnud6j/image/upload/v1759786199/noimgPost_npspix.webp"},
  inCommunity: {type: Schema.Types.ObjectId, ref:'Community', required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  dislikes: [{type: Schema.Types.ObjectId, ref: 'Users'}], 
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}] //todo via
}, {timestamps: true});

export const Post = mongoose.model('Post', PostSchema); 
