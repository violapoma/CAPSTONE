import { verifyJWT } from "../helpers/jwt.js";
import User from "../models/User.js";

async function authMW(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Missing or malformed authorization token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyJWT(token);
    const userId = payload.id || payload.userId; //from google
    if (!userId) {
      return response.status(401).json({ message: "Token does not contain a valid user ID" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return response.status(401).json({ message: "User associated with token not found" });
    }
    request.loggedUser = user; //adding loggedUser field in request obj
    next();
  } catch (err) {
    console.error("Authentication middleware error:", err.message);
    return response.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authMW;