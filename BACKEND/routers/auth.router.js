import express from 'express';
import { userValidator } from '../validators/user.validator.js';
import { login, register } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validate.js';

const authRouter = express.Router();

authRouter.post('/register', validate(userValidator, 'body'), register);
authRouter.post('/login', login);

export default authRouter; 