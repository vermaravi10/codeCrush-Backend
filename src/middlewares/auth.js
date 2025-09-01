const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const adminAuth = (req, res, next) => {
  let token = "xyz";
  if (token === "xyz") {
    console.log("admin auth middleware called");
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Please Login");
    }

    const decoded = await jwt.verify(token, "devTinderSecretKey");
    if (!decoded) {
      throw new Error(" Please login again");
    }

    let user = await User.findById(decoded._id);
    if (!user) {
      throw new Error(" User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

module.exports = { adminAuth, userAuth };
