const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

//single request handler and regext routes

// app.use("/", (req, res) => {
//   res.send("hello from the server");
// });

// app.use("/test/result/:userID", (req, res) => {
//   res.send("this is test result");
//   console.log(req.params);
// });

// app.get(/^\/tes?t$/, (req, res) => {
//   res.send("this is test");
// });

//multiple request handlers

// app.use(
//   "/user",
//   (req, res, next) => {
//     // res.send("hello user from the server");
//     next();
//   },
//   (req, res, next) => {
//     // res.send("hello from user2");
//     next();
//   },
//   (req, res) => {
//     // res.send("hello from user2");
//   },
//   (req, res) => {
//     res.send("hello from user2");
//   },
//   (req, res) => {
//     res.send("hello from user2");
//   }
// );

//middleware for specific routes

// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res) => {
//   console.log("hello from admin");
//   res.send("this is admin data");
// });
// app.get("/admin", (req, res) => {
//   console.log("hello from original admin");
//   res.send("this is admin  original data");
// });

// app.use("/user", userAuth, (req, res) => {
//   res.send("this is user data");
// });

//database connection
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");

app.post("/signup", async (req, res) => {
  //creating the instance of user model
  const userObj = {
    firstName: "akshay",
    lastName: "saini",
    emailId: "raviv@gmail.com",
    password: "12345",

    gender: "Male",
  };

  const user = new UserModel(userObj);
  await user
    .save()
    .then((data) => {
      console.log(data);
      res.send("user signed up successfully");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error signing up user");
    });
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
