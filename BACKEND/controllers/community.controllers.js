import { createNotification } from "../helpers/createNotification.js";
import mailer from "../helpers/mailer.js";
import Community from "../models/Community.js";
import User from "../models/User.js";
import { communityIdValidator } from "../validators/community.validator.js";

const MIN_MEMBERS = Number(process.env.MIN_MEMBERS);

export async function createCommunity(request, response) {
  let payload = request.body;
  const userId = request.loggedUser.id;
  try {
    const existing = await Community.findOne({ name: payload.name });
    if (existing)
      return response
        .status(409)
        .json({ message: `${payload.name} is already taken` });

    payload.moderator = userId;
    payload.members = [userId];

    const newCommunity = new Community(payload);

    await newCommunity.save();

    return response.status(201).json( newCommunity );
  } catch (err) {
    return response.status(500).json({
      message: "Something went wrong while tryng to create a new community",
      error: err.message,
    });
  }
}

export async function getAllCommunities(request, response) {
  try {
    const communities = await Community.find().populate("members moderator");

    return response.status(200).json(communities);
  } catch (err) {
    return response.status(500).json({
      message: "Something went wrong while tryng to fetch all communities",
      error: err.message,
    });
  }
}

export async function getByStatus(request, response) {
  const reqStauts = request.type;
  let query = { status: request.type };
  if (request.type === "approved") query.active = true;
  try {
    const okCommunities = await Community.find(query);

    return response.status(200).json(okCommunities);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch all ${req.status} communities`,
      error: err.message,
    });
  }
}

export async function getById(request, response) {
  const id = request.params.communityId;
  try {
    const community = await Community.findById(id).populate(
      "members moderator"
    );
    return response.status(200).json(community);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to fetch community with id ${id}`,
      error: err.message,
    });
  }
}

export async function updateCommunity(request, response) {
  const id = request.params.communityId;
  const payload = request.body;

  try {
    const updating = await Community.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json(updating);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update community with id ${id}`,
      error: err.message,
    });
  }
}

export async function changeStatus(request, response) {
  const id = request.params.communityId;
  const { status } = request.body;

  try {
    const updating = await Community.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    const admin = await User.findOne({email: 'admin@gmail.com'}); 
    if(!admin)
    throw new Error('admin not found'); 

    const html = `
    <h1>Hi, ${request.loggedUser.username}.</h1>
    <h2>Your community ${updating.name} has been ${status}</h2>
    <p>
    ${
      status === "approved" &&
      `All is left to do is reach at least${process.env.MIN_MEMBERS} members! There's no time limit, but make sure to contact your friends to star chatting about ${updating.topic}!`
    }
    ${
      status === "rejected" &&
      "Our team did not find your proposal appropriate, feel free to contact us for more info."
    } 
    </p>
    To your next idea!
  `;

    const infoMail = await mailer.sendMail({
      to: request.loggedUser.email,
      subject: `News regarding ${updating.name}!`,
      html: html,
      from: "violapoma@gmail.com",
    });

    await createNotification(updating.moderator, {
      from: admin._id,
      category: 'community',
      source: updating._id,
      sourceModel: 'Community',
      meta: {
        details: status,
        communityName: updating.name
      }
    }); 

    return response.status(200).json(updating);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to update staus of community with id ${id}`,
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
    return response.status(200).json(updating);
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
    const alreadyIn = community.members.find(
      (user) => user._id.toString() === userId
    );
    if (alreadyIn)
      return response.status(409).json({
        message: `User ${request.loggedUser.username} is already member of '${community.name}'`,
      });
    community.members.push(userId);
    if (community.members.length > MIN_MEMBERS) community.active = true;
    //TODO: send mail to member
    const html = `
      <h1>Hi, ${
        request.loggedUser.username
      }, <b>WELCOME TO ${community.name.toUpperCase()}</b></h1>
      <h2>Our guidelines</h2>
      <p>Please, remember to post only appropriate content.
      ${
        community.guidelines &&
        "Make sure you follow our guidelines. The community moderator is allowed to remove you or your content they deem it necessary.<br>" +
          guidelines
      }
      That being said, we hope to have a nice time together 🥰</p>
      <p>→<a href='${process.env.FRONTEND_HOST}/communities/${
      community._id
    }'>CLICK HERE</a>← to visit ${community.name}</p>
    `;

    const infoMail = await mailer.sendMail({
      to: request.loggedUser.email,
      subject: `Thanks for joining ${community.name}!`,
      html: html,
      from: "violapoma@gmail.com",
    });

    await community.save();
    return response.status(200).json(community);
  } catch (err) {
    return response.status(500).json({
      message: `${request.loggedUser.username} could NOT follow community with id ${communityId}`,
      error: err.message,
    });
  }
}

export async function leaveCommunity(request, response) {
  const { communityId } = request.params;
  const userId = request.loggedUser._id;
  try {
    const community = await Community.findById(communityId).populate(
      "members",
      "email username"
    );
    console.log("community in leaveComm", community);
    const alreadyIn = community.members.find(
      (user) => user._id.toString() === userId.toString()
    );

    console.log("-----------------------------------------");
    console.log("ADMIN ID (string):", request.adminId.toString());
    console.log("Logged User ID (string):", userId.toString());
    console.log("Community Moderator ID:", community.moderator);
    console.log("Moderator ID (string):", community.moderator.toString());
    console.log(
      "Is current user the moderator?",
      community.moderator.toString() === userId.toString()
    );
    console.log("-----------------------------------------");

    if (!alreadyIn)
      return response.status(409).json({
        message: `User ${request.loggedUser.username} is NOT member of '${community.name}' yet`,
      });

    let shouldUpdateModerator = false;
    if (community.moderator._id.toString() === userId.toString()) {
      community.moderator = request.adminId;
      community.markModified("moderator");
    }

    community.members = community.members.filter(
      (user) => user._id.toString() !== userId.toString()
    );
    if (community.members.length < MIN_MEMBERS) {
      community.active = false;
      //TODO: send mail to members and admin
      const recipients = community.members.map((member) => member.email);
      const html = `
    <h1>Hey 😪</h1>
    <h2>Unfortunately, community ${community.name} does not have enough members to keep on being active</h2>
    <p>
    We are sorry, but we need to close it. Feel free to try again in the future, we can't wait to have more posts about ${community.topic}!
    </p>
    To your next idea!
  `;
      const infoMail = await mailer.sendMail({
        bcc: recipients,
        to: "violapoma@gmail.com",
        subject: `Community ${community.name} has not enough members to stay up`,
        html: html,
        from: "violapoma@gmail.com",
      });
    }
    await community.save();
    return response.status(200).json(community);
  } catch (err) {
    return response.status(500).json({
      message: `${request.loggedUser.username} could NOT follow community with id ${communityId}`,
      error: err.message,
    });
  }
}

export async function deleteCommunity(request, response) {
  const { communityId } = request.params;
  try {
    const deleting = await Community.findByIdAndDelete(communityId);
    if (!deleting)
      return response
        .status(404)
        .json({ message: `Could NOT find community with id ${communityId}` });
    //TODO: send notification to all members that the community -with status active- has been cancelled
    if (deleting.status === "active") {
      const recipients = deleting.members.map((member) => member.email);
      const html = `
    <h1>Hey 😪</h1>
    <h2>Unfortunately, community ${deleting.name} no longer exists.</h2>
    <p>
    We are sorry! This can either be due to a code violation or to the moderator free will. Anyway, we hope you had a good time and, who knows, in the future you can try and open your very own communty with the same topic! 
    </p>
    To your next idea!
  `;
      const infoMail = await mailer.sendMail({
        bcc: recipients,
        to: "violapoma@gmail.com",
        subject: `Community ${deleting.name} has not enough members to stay up`,
        html: html,
        from: "violapoma@gmail.com",
      });
    }
    return response.status(200).json(deleting);
  } catch (err) {
    return response.status(500).json({
      message: `Something went wrong while tryng to delete community with id ${communityId}`,
      error: err.message,
    });
  }
}
