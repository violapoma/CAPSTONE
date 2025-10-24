import Community from "../models/Community.js";
import User from "../models/User.js";

export async function globalSearch(request, response) {
  const searchTerm = request.query.q;
  console.log('searchTerm in globalSearch', searchTerm);
  if (!searchTerm || searchTerm.length < 2) {
    //ignores short research
    return response.json({ users: [], communities: [] });
  }

  const regex = new RegExp(searchTerm, "i");
  try {
    const [users, communities] = await Promise.all([
      User.find({ username: { $regex: regex } })
        .select("username profilePic")
        .limit(10),

      Community.find({ name: { $regex: regex } })
        .select("name cover")
        .limit(10),
    ]);
    return response.status(200).json({
      users: users, communities: communities
    });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while searching for ${searchTerm}`,
      error: err.message,
    });
  }
}
