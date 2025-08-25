const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./Routes/auth");
const { profileRouter } = require("./Routes/profile");
const { requestRouter } = require("./Routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
