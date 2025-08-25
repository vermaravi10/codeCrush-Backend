const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User");

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
      throw new Error("Unauthorized: No token provided");
    }

    const decoded = await jwt.verify(token, "devTinderSecretKey");
    if (!decoded) {
      throw new Error("Unauthorized: Invalid token");
    }

    let user = await UserModel.findById(decoded._id);
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

module.exports = { adminAuth, userAuth };
