import User from "../models/User.js";

/*TODO: NEEDS TO BE FIXED, JUST FOR SIMPLE TESTING */
export async function register(request, response) {
  const { email, password, firstName, dateOfBirth, username } = request.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return response.status(409).json({ message: "user already existing" });

    const newUser = new User({email, password, firstName, dateOfBirth, username});
    await newUser.save();
    return response.status(201).json(newUser);
  } catch (err) {
    return response.status(500).json({
      message: `Error during register`,
      error: err.message,
    });
  }
}
