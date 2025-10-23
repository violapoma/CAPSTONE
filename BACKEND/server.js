import cors from "cors"; 
import express from "express"; 
import morgan from "morgan";
import "dotenv/config"; 
import { connectDB } from "./db.js";
import authRouter from "./routers/auth.router.js";
import meRouter from "./routers/me.router.js";
import followRouter from "./routers/follow.router.js";
import userRouter from "./routers/user.router.js";
import authMW from "./middlewares/authMW.js";
import notificationRouter from "./routers/notification.router.js";
import communityRouter from "./routers/community.router.js";
import { validate } from "./middlewares/validate.js";
import postRouter from "./routers/post.router.js";
import { communityIdValidator } from "./validators/community.validator.js";
import { checkExistingCommunityMw } from "./middlewares/checkExistingCommunityMw.js";
import { postIdValidator } from "./validators/post.validator.js";
import { checkExistingPostMw } from "./middlewares/checkExistingPostMw.js";
import commentRouter from "./routers/comment.router.js";
import { checkUserInCommunityMw } from "./middlewares/checkUserInCommunityMw.js";
import { userIdValidator } from "./validators/user.validator.js";
import { checkExistingUserMw } from "./middlewares/checkExistingUserMw.js";
import googleStrategy from "./config/passportConfig.js";
import passport from "passport";


const server = express();
const port = process.env.PORT;

console.log('CORS ORIGIN: ', process.env.FRONTEND_HOST); 
const corsOptions = {
  origin: process.env.FRONTEND_HOST,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

server.use(cors(corsOptions));
server.use(morgan("tiny")); 
server.use(express.json()); 

passport.use(googleStrategy); 

//routers
server.use('/auth', authRouter);
server.use('/me', authMW, meRouter); 
server.use('/users/:userId', authMW, validate(userIdValidator), checkExistingUserMw, userRouter);
server.use('/communities', communityRouter);
server.use('/notifications', authMW, notificationRouter);
server.use('/follow-list', authMW, followRouter); 
server.use('/communities/:communityId/posts', authMW, validate(communityIdValidator), checkExistingCommunityMw, checkUserInCommunityMw, postRouter);
server.use('/posts/:postId/comments', authMW, checkExistingPostMw, validate(postIdValidator), commentRouter);

//error 404
server.use((req, res, next) => {
  res.status(404).json({ message: "BIG_NOT_FOUND" });
});
//error 500
server.use((err, req, res, next) => {
  console.error("Errore:", err);
  res.status(500).json({ message: "BIG_INTERNAL_SERVER_ERROR" });
});

connectDB();

server.listen(port, () => console.log(`server avviato sulla porta ${port}`));