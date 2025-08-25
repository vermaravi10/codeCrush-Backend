const validator = require("validator");

function dataValidation(req) {
  const errors = {};

  const { firstName, lastName, emailId, password } = req.body || {};

  // Validate firstName
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

  // Validate lastName
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

  // Validate emailId
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid Email Id");
  }

  // Validate password
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Weak password");
  }
}

module.exports = { dataValidation };
