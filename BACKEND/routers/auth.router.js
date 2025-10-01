import express from 'express';
import { userValidator } from '../validators/user.validator.js';
import { register } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validate.js';

const authRouter = express.Router();

authRouter.post('/register', validate(userValidator, 'body'), register);

export default authRouter; 