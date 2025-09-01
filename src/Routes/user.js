const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/User");
const userRouter = express.Router();

const USER_SAFE = "firstName lastName age skills about photo_url";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser._id;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE);

    res.json({
      message: "Requests fetched successfully",
      data: pendingRequests,
    });
  } catch (err) {
    res.status(500).send("error fetching user requests" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_SAFE);

    const data = connections?.map((connection) => {
      if (connection.fromUserId._id.toString() === userId.toString()) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).send("error fetching user connections" + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (parseInt(req.query.page) - 1) * limit || 0;
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser._id.toString();

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).select("fromUserId toUserId");

    const hideUsers = new Set();
    connections?.forEach((connection) => {
      hideUsers.add(connection.fromUserId.toString());
      hideUsers.add(connection.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsers) },
        },
        {
          _id: { $ne: userId },
        },
      ],
    })
      .select(USER_SAFE)
      .skip(skip)
      .limit(limit);

    res.send({
      message: "User feed fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).send("error fetching user feed" + err.message);
  }
});

module.exports = { userRouter, USER_SAFE };
