import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { signJWT } from "../helpers/jwt.js";
import User from "../models/User.js";

console.log("BACKEND_HOST:", process.env.BACKEND_HOST);
console.log("GOOGLE_CALLBACK_PATH:", process.env.GOOGLE_CALLBACK_PATH);

function generateRandomUsername(firstName) {
  const base = firstName ? firstName.toLowerCase().replace(/\s+/g, "") : "user";
  return base + Math.floor(Math.random() * 10000);
}

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_HOST}${process.env.GOOGLE_CALLBACK_PATH}`,
  },
  async function (accessToken, refreshToken, profile, cb) {
    console.log("callback google, profile", profile);

    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        let username = generateRandomUsername(profile._json.given_name);
        let exists = await User.findOne({ username });
        while (exists) {
          username = generateRandomUsername(profile._json.given_name);
          exists = await User.findOne({ username });
        }

        user = new User({
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          email: profile._json.email,
          googleId: profile.id,
          username, 
        });

        await user.save();
        const jwt = signJWT({ userId: user.id });
        return cb(null, { jwt, isNewUser: true });
      }
      const jwt = signJWT({userId: user.id}); 

      cb(null, {jwt, isNewUser: false })
    } catch (err) {
      cb(err, null) 
    }
  }
);

export default googleStrategy; 