const validator = require("validator");
const { UserModel } = require("../models/User");

function dataValidation(req) {
  const errors = {};

  const { firstName, lastName, emailId, password } = req.body || {};

  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.length < 4 ||
    firstName.length > 50
  ) {
    throw new Error(
      "First name is required and must be between 4 and 50 characters."
    );
  }
  if (
    !lastName ||
    typeof lastName !== "string" ||
    lastName.length < 4 ||
    lastName.length > 50
  ) {
    throw new Error(
      "Last name is required and must be between 4 and 50 characters."
    );
  }
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid Email Id");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Weak password");
  }
}

const validateProfileEditData = async (req) => {
  loggedInUser = req.user;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["gender", "about", "photoUrl", "skills"];
  const isValidOperation = updates?.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    throw new Error("Invalid updates!");
  }
  Object.keys(req.body).forEach((key) => {
    loggedInUser[key] = req.body[key];
  });

  await loggedInUser.save();
  return loggedInUser;
};

module.exports = { dataValidation, validateProfileEditData };
