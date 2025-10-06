import express from 'express'; 
import { addComment, deleteComment, editComment, getAllPostComments, getSingleComment } from '../controllers/comment.controllers.js';
import { commentIdValidator } from '../validators/comment.validator.js';
import { checkExistingCommentMw } from '../middlewares/checkExistingCommentMw.js';
import { validate } from '../middlewares/validate.js';
import { changeReactionFor } from '../helpers/changeReactionFor.js';
import { Comment } from '../models/Comment.js';

const commentRouter = express.Router({mergeParams: true});

commentRouter.post('/', addComment);
commentRouter.post('/:commentId', validate(commentIdValidator), checkExistingCommentMw, addComment); 
commentRouter.get('/', getAllPostComments);
commentRouter.get('/:commentId', validate(commentIdValidator), checkExistingCommentMw, getSingleComment); 
commentRouter.patch('/:commentId', validate(commentIdValidator), checkExistingCommentMw, editComment); 
commentRouter.patch(
  "/:commentId/like",
  (request, response, next) => {
    request.type = "likes";
    next();
  },
  validate(commentIdValidator),
  checkExistingCommentMw,
  changeReactionFor(Comment)
);
commentRouter.patch(
  "/:commentId/dislike",
  (request, response, next) => {
    request.type = "dislikes";
    next();
  },
  validate(commentIdValidator),
  checkExistingCommentMw,
  changeReactionFor(Comment)
);
commentRouter.delete('/:commentId', validate(commentIdValidator), checkExistingCommentMw, deleteComment);

export default commentRouter; 