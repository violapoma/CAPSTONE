import { signJWT } from "../helpers/jwt.js";
import mailer from "../helpers/mailer.js";
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

    const html = `
    <h1>Hi, ${newUser.username}, <b>WELCOME!</b></h1>
    <h2>What you can do:</h2>
    <ul>
      <li>You can join any community available, depending on your interests</li>
      <li>You can make a proposal for a new community! Of course, this community must be pre-approved by our team, so make sure to explain in details what you want this community to be. Once your idea is approved and the quota of ${process.env.MIN_MEMBERS} members is reached, your community will beacome active! Also, you can promote your community on your profile. <b>Beware, if at any moment our team notices a content they deem inappropriate, your community will be deleted</b>, so make sure to keep an eye on its content.</li>
      <li>Needless to say, you can help another creator start their community by becoming a member while the community is not active yet.</li>
      <li>Make sure to follow all the users you like the most!</li>
    </ul>
    <h2>Have fun!</h2>
    <p>And please remember to always respect other users</p>
    <p>→<a href='${process.env.FRONTEND_HOST}/users/${newUser._id}'>CLICK HERE</a>← to visit your profile</p>
  `;

    const infoMail = await mailer.sendMail({
      to: newUser.email,
      subject: `Thanks for joining us!`,
      html: html,
      from: "violapoma@gmail.com",
    });

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
      return response.status(400).json({ message: "wrong credentials" });
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

export async function redirectToMe(req, res) {
  const { jwt, isNewUser } = req.user;
  const query = new URLSearchParams({ jwt, isNewUser }).toString();
  console.log('*********queryNewUser', query);
  res.redirect(`${process.env.FRONTEND_HOST}/auth/google-callback?${query}`);
}


export async function checkTakenEmailUsername(request, response) {
  const { email, username } = request.query;
  if (!email || !username)
    return response
      .status(400)
      .json({ message: "Invalid request, missing fields", exists: null });
  try {
    const existing = await User.findOne({
      $or: [email ? { email } : null, username ? { username } : null].filter(
        Boolean
      ),
    });
    if (existing)
      return response
        .status(409)
        .json({ message: "Email or username already in use", exists: true });
    return response.status(200).json({ exists: false });
  } catch (err) {
    response
      .status(500)
      .json({
        message: "error during check email and username",
        error: err.message,
        exists: null,
      });
  }
}
