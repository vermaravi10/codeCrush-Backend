const express = require("express");

const app = express();
const bcrypt = require("bcrypt");

const { userAuth } = require("./middlewares/auth");

const { dataValidation } = require("./utils/validations");
const cookieParser = require("cookie-parser");

//database connection
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/User");

app.use(express.json()); // to parse JSON bodies
app.use(cookieParser()); // to parse cookies

app.post("/signup", async (req, res) => {
  try {
    dataValidation(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("user signed up successfully");
  } catch (err) {
    res.status(500).send("Error signing up user" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credientials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = await user.createJwt();
    res.cookie("token", token);
    res.send("User logged in successfully");
  } catch (err) {
    res.status(500).send("Error logging in user: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Something went wrong while fetching users");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(`${req.user.firstName} sent the connection request`);
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while sending connection request");
  }
});
app.get("/user", userAuth, async (req, res) => {
  try {
    const users = await UserModel.find({ emailId: req.body.emailId });
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).send("no user found");
    }
  } catch (err) {
    res.status(500).send("Something went wrong while fetching users");
  }
});

app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await UserModel.find({});
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).send("no user found");
    }
  } catch (err) {
    res.status(500).send("Something went wrong while fetching users");
  }
});

app.delete("/user", userAuth, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.body.userId);
    res.send("user deleted successfully");
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while fetching users" + err.message);
  }
});

app.patch("/user/:userId", userAuth, async (req, res) => {
  try {
    const allowedFields = ["about", "photo_url", "skills"];
    const updateFields = Object.keys(req.body);

    const isValidUpdate = updateFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidUpdate) {
      throw new Error("Invalid update fields");
    }

    await UserModel.findByIdAndUpdate(req.params.userId, req.body);
    res.send("user updated successfully");
  } catch (err) {
    res.status(500).send("Something went wrong while updating user");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
