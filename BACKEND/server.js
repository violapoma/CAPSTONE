import cors from "cors"; 
import express from "express"; 
import "dotenv/config"; 
import { connectDB } from "./db.js";
import morgan from "morgan";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(morgan("tiny")); 
server.use(express.json()); 

//routers

//error 404
server.use((req, res, next) => {
  res.status(404).json({ message: "NOT_FOUND" });
});
//error 500
server.use((err, req, res, next) => {
  console.error("Errore:", err);
  res.status(500).json({ message: "INTERNAL_SERVE_ERROR" });
});

connectDB();

server.listen(port, () => console.log(`server avviato sulla porta ${port}`));