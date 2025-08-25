const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(`${req.user.firstName} sent the connection request`);
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while sending connection request");
  }
});
module.exports = { requestRouter };
