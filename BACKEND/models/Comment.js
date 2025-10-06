import mongoose, {Schema} from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  parent: {type: Schema.Types.ObjectId, ref:'Comment', default:null},
  child: {type: Schema.Types.ObjectId, ref:'Comment', default:null, autopopulate: true},
  author: {type: Schema.Types.ObjectId, ref:'User', required:true},
  content: {type: String, required: true},
  likes: [{type: Schema.Types.ObjectId, ref:'User'}],
  dislikes: [{type: Schema.Types.ObjectId, ref:'User'}],
}, {timestamps: true});

CommentSchema.plugin(mongooseAutoPopulate);

export const Comment = mongoose.model('Comment', CommentSchema);