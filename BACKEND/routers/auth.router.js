import express from 'express';
import { userValidator } from '../validators/user.validator.js';
import { login, redirectToMe, register } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validate.js';
import passport from 'passport';

const authRouter = express.Router();

authRouter.post('/register', validate(userValidator, 'body'), register);
authRouter.post('/login', login);

authRouter.get(
  "/login-google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google-callback",
  passport.authenticate("google", { session: false }),
  redirectToMe
);

export default authRouter; 