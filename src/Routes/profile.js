const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/User");
const { validateProfileEditData } = require("../utils/validations");
const bycrpt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ message: "Profile fetched successfully", data: user });
  } catch (err) {
    res.status(500).send("Something went wrong while fetching users");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const updatedData = await validateProfileEditData(req);
    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedData,
    });
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while editing profile" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordChangeApproved = await bycrpt.compare(
      oldPassword,
      loggedInUser.password
    );
    if (!isPasswordChangeApproved) {
      throw new Error("Old password is incorrect");
    }
    loggedInUser.password = await bycrpt.hash(newPassword, 10);
    await loggedInUser.save();
    res.send("Password Updated successfully");
  } catch (err) {
    res.status(500).send("Unable to change the password" + err.message);
  }
});

module.exports = { profileRouter };
