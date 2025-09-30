import jwt from "jsonwebtoken";
// import "dotenv/config";

export function signJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
}

export function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}