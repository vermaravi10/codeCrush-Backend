const adminAuth = (req, res, next) => {
  let token = "xyz";
  if (token === "xyz") {
    console.log("admin auth middleware called");
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

const userAuth = (req, res, next) => {
  let token = "1212";
  if (token === "1212") {
    console.log("Auth middleware called");
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

module.exports = { adminAuth, userAuth };
