import cors from "cors"; 
import express from "express"; 
import "dotenv/config"; 
import { connectDB } from "./db.js";
import morgan from "morgan";
import userRouter from "./routers/user.router.js";
import followRouter from "./routers/follow.router.js";
import authRouter from "./routers/auth.router.js";
import authMW from "./middlewares/authMW.js";
import notificationRouter from "./routers/notification.router.js";
import { validate } from "./middlewares/validate.js";
import { userIdValidator } from "./validators/user.validator.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(morgan("tiny")); 
server.use(express.json()); 

//routers
server.use('/auth', authRouter);
server.use('/users', authMW, userRouter);
server.use('/users/:userId/notifications',validate(userIdValidator), authMW, notificationRouter);
server.use('/follows', authMW, followRouter); 
//error 404
server.use((req, res, next) => {
  res.status(404).json({ message: "my NOT_FOUND" });
});
//error 500
server.use((err, req, res, next) => {
  console.error("Errore:", err);
  res.status(500).json({ message: "INTERNAL_SERVE_ERROR" });
});

connectDB();

server.listen(port, () => console.log(`server avviato sulla porta ${port}`));