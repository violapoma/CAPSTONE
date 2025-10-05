import { signJWT } from "../helpers/jwt.js";
import User from "../models/User.js";

export async function register(request, response) {
  const payload = request.body;

  try {
    const existing = await User.findOne({ email: payload.email });
    if (existing)
      return response.status(409).json({ message: "user already existing" });

    const newUser = new User(payload);

    await newUser.save();

    const token = signJWT({ id: newUser._id }); //logging user

    return response.status(201).json({ user: newUser, jwt: token });
  } catch (err) {
    return response.status(500).json({
      message: `Error during register`,
      error: err.message,
    });
  }
}

export async function login(request, response) {
  try {
    const { email, password } = request.body;

    const fetchedUser = await User.findOne({ email }).select("+password");

    if (!fetchedUser || !(await fetchedUser.comparePassword(password))) {
      return response.status(400).json({ message: 'wrong credentials' });
    }
    const jwt = signJWT({ id: fetchedUser._id });
    return response
      .status(200)
      .json({ message: `logged in as ${email}`, user: fetchedUser, jwt });
  } catch (err) {
    response
      .status(500)
      .json({ message: "error during login", error: err.message });
  }
}
