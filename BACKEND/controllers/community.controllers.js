import Community from "../models/Community.js";

const MIN_MEMBERS = Number(process.env.MIN_MEMBERS);

export async function createCommunity(request, response) {
  console.log('entering controller');
  let payload = request.body;
  const userId = request.loggedUser?.id;
  if (!userId)
    return response.status(401).json({ message: "User NOT authenticated" });
  try {
    const existing = await Community.findOne({ name: payload.name });
    if (existing)
      return response
        .stauts(409)
        .json({ message: `${payload.name} is already taken` });

    payload.moderator = userId;
    payload.members = [userId];

    const newCommunity = new Community(payload);

    await newCommunity.save();

    return response.status(201).json({ community: newCommunity });
  } catch (err) {
    return response.status(500).json({
      message: "Something went wrong while tryng to create a new community",
      error: err.message,
    });
  }
}

export async function getAllCommunities(request, response) {
  try {
    const communities = await Community.find();

    return response.status(200).json({ communities });
  } catch (err) {
    return response.status(500).json({
      message: "Something went wrong while tryng to fetch all communities",
      error: err.message,
    });
  }
}


export async function getByStatus(request, response) {
  const reqStauts = request.type;
  try {
    const okCommunities = await Community.find({ status: reqStauts });

    return response.status(200).json({ communities: okCommunities });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all ${req.status} communities`,
      error: err.message,
    });
  }
}

export async function getMyCommunitiesAs(request, response) {
  const type = request.type;
  const id = request.loggedUser?.id;
  if (!id || !["moderator", "member"].includes(type))
    return response.status(400).json({ message: "Invalid request" });
  try {
    let query = {};
    if (type === "moderator") query = { moderator: id };
    else if (type === "member") query = { members: id };
    const typeCommunities = await Community.find(query);
    return response.status(200).json({ communities: typeCommunities });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch ${type} community for user with id ${id}`,
      error: err.message,
    });
  }
}

export async function getById(request, response) {
  const id = request.params.communityId;
  try {
    const community = await Community.findById(id);
    if (!community)
      return response.status(404).json({
        message: `Could NOT find community with id ${id}`,
      });
    return response.status(200).json({ community });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch community with id ${id}`,
      error: err.message,
    });
  }
}

export async function changeField(request, response) {
  const type = request.type;
  const id = request.params.communityId;
  const payload = request.body;

  console.log("payload", payload);
  if (!id || !["description", "style", "status"].includes(type))
    return response.status(400).json({ message: "Invalid request" });
  try {
    let query = {};
    if (type === "description") query = { description: payload.description };
    else if (type === "style") query = { style: payload };
    else if (type === "status") query = { status: payload.status };
    console.log("query", query);
    console.log("Updating community", id, "with status", payload.status);
    const updating = await Community.findByIdAndUpdate(id, query, {
      new: true,
    });
    if (!updating)
      return response
        .status(404)
        .json({ message: `Could NOT find community with id ${id}` });

    return response.status(200).json({ community: updating });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update ${type} of community with id ${id}`,
      error: err.message,
    });
  }
}

export async function changeCover(request, response) {
  const id = request.params.communityId;
  const imgPath = request.file?.path;
  if (!imgPath)
    return response
      .status(400)
      .json({ message: "Picture not found in request" });
  try {
    const updating = await Community.findByIdAndUpdate(
      id,
      { cover: imgPath },
      { new: true }
    );
    if (!updating)
      return response
        .status(404)
        .json({ message: `Could NOT find community with id ${id}` });
    return response.status(200).json({ community: updating });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update the cover of the community with id ${id}`,
      error: err.message,
    });
  }
}

export async function joinCommunity(request, response) {
  const { communityId } = request.params;
  const userId = request.loggedUser.id;
  try {
    const community = await Community.findById(communityId).populate("members");
    if (!community)
      return response.status(404).json({
        message: `Could NOT find community with id ${communityId}`,
      });
    const alreadyIn = community.members.find(
      (user) => user._id.toString() === userId
    );
    if (alreadyIn)
      return response.status(409).json({
        message: `User ${request.loggedUser.username} is already member of '${community.name}'`,
      });
    community.members.push(userId);
    if (community.members.length > MIN_MEMBERS) 
      community.active = true;
    //TODO: send mail to members
    await community.save();
    return response.status(200).json({ community });
  } catch (err) {
    return response.status(500).json({
      message: `${request.loggedUser.username} could NOT follow community with id ${communityId}`,
      error: err.message,
    });
  }
}

export async function leaveCommunity(request, response) {
  const { communityId } = request.params;
  const userId = request.loggedUser.id;
  try {
    const community = await Community.findById(communityId);
    if (!community)
      return response.status(404).json({
        message: `Could NOT find community with id ${communityId}`,
      });
    const alreadyIn = community.members.find(
      (user) => user._id.toString() === userId
    );
    if (!alreadyIn)
      return response.status(409).json({
        message: `User ${request.loggedUser.username} is NOT member of '${community.name}' yet`,
      });
    community.members = community.members.filter(
      (user) => user._id.toString() !== userId
    );
    if (community.members.length<MIN_MEMBERS)
      community.active = false;
    //TODO: send mail to members and admin 
    await community.save();
    return response.status(200).json({ community });
  } catch (err) {
    return response.status(500).json({
      message: `${request.loggedUser.username} could NOT follow community with id ${communityId}`,
      error: err.message,
    });
  }
}

export async function deleteCommunity(request, response) {
  const {communityId} = request.params;
  try {
    const deleting = await Community.findByIdAndDelete(communityId);
    if (!deleting)
      return response
        .stauts(404)
        .json({ message: `Could NOT find community with id ${communityId}` });
    //TODO: send notification to all members that the community has been cancelled
    return response.status(200).json({ community: deleting });
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to delete community with id ${communityId}`,
      error: err.message,
    });
  }
}
