const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");

var cors = require("cors");
const allowed = ["https://54.175.148.69", "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./Routes/auth");
const { profileRouter } = require("./Routes/profile");
const { requestRouter } = require("./Routes/request");
const { userRouter } = require("./Routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
