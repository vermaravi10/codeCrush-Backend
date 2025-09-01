const express = require("express");
const { userAuth } = require("../middlewares/auth");

const { ConnectionRequest } = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id.toString();
      console.log("🚀 ~ fromUserId:", fromUserId);
      const toUserId = req.params.toUserId;
      console.log("🚀 ~ toUserId:", toUserId);
      const status = req.params.status;
      // Validate status
      const validStatuses = ["interested", "ignored"];
      if (!validStatuses.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      //validate existing request
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Connection request already exists");
      }

      const data = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      }).save();

      res
        .status(201)
        .json({
          message: `You have ${
            status === "interested" ? "shown interest in" : "ignored"
          } this user successfully.`,
          data: data,
        });
    } catch (err) {
      res.status(500).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      console.log("🚀 ~ loggedInUser:", loggedInUser);
      const requestId = req.params.requestId;
      const connectionRequest = await ConnectionRequest.findById(requestId);
      console.log("🚀 ~ connectionRequest:", connectionRequest);
      if (!connectionRequest) {
        return res.status(404).send("Connection request not found");
      }
      if (!loggedInUser._id.equals(connectionRequest.toUserId)) {
        return res
          .status(403)
          .send("You are not authorized to perform this action");
      }
      if (connectionRequest.status !== "interested") {
        return res.status(400).send("Only interested requests can be reviewed");
      }

      const allowedStatuses = ["accepted", "rejected"];
      const status = req.params.status;
      if (!allowedStatuses.includes(status)) {
        return res.status(400).send("Invalid status");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({
        message: "Connection request reviewed successfully",
        data: data,
      });
    } catch (err) {
      res.status(500).send("ERROR: " + err.message);
    }
  }
);
module.exports = { requestRouter };
