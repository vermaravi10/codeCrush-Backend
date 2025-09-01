const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Id");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      //   required: true,
      minvalue: 18,
      maxvalue: 100,
    },
    gender: {
      type: String,
      //   required: true,
      lowercase: true,
      validator: function (value) {
        const allowedGenders = [" male", "female", "other"];
        if (!allowedGenders.includes(value)) {
          throw new Error("Gender not supported");
        }
      },
    },
    about: {
      type: String,
      maxlength: 500,
      trim: true,
      default: "This is a user about section",
    },
    skills: {
      type: [String],
      default: ["JavaScript"],
      validate: {
        validator: function (value) {
          return value.length <= 50;
        },
        message: "A user can have a maximum of 50 skills",
      },
    },
    photo_url: {
      type: String,
      trim: true,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLRMYH57Eg7Mcu5fyGw4bd6dLIADSfM6PLbQ&s",
      validate: {
        validator: function (value) {
          if (value && !validator.isURL(value)) {
            throw new Error("Invalid URL");
          }
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (inputPassword) {
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);
  return isPasswordValid;
};

userSchema.methods.createJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "devTinderSecretKey", {
    expiresIn: "1d",
  });

  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
