import mongoose, {Schema} from 'mongoose';

const CommentSchema = new Schema({
  parent: {type: Schema.Types.ObjectId, ref:'Comment', default:null},
  author: {type: Schema.Types.ObjectId, ref:'User', required:true},
  content: {type: String, required: true},
  likes: [{type: Schema.Types.ObjectId, ref:'User'}],
  dislikes: [{type: Schema.Types.ObjectId, ref:'User'}],
}, {timestamps: true});

export const Comment = mongoose.model('Comment', CommentSchema);