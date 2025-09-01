const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { dataValidation } = require("../utils/validations");
const { User } = require("../models/User");

authRouter.post("/signup", async (req, res) => {
  try {
    dataValidation(req);

    const { firstName, lastName, emailId, password, photo_url } = req.body.data;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      photo_url,
    });
    await user.save();
    res.json({ data: user, message: "User signed up successfully" });
  } catch (err) {
    console.log("🚀 ~ err:", err);
    res.status(500).send("Error signing up user" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credientials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = await user.createJwt();
    res.cookie("token", token);
    res.send({ message: "User logged in successfully", data: user });
  } catch (err) {
    res.status(500).send("Error logging in user: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("User logged out successfully");
  } catch (err) {
    res.status(500).send("Error logging out user: " + err.message);
  }
});

module.exports = { authRouter };
