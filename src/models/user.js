const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("This is not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true, // ensures "Male"/"FEMALE" become "male"/"female"
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("This is not a valid gender");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about section",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {   // fixed mismatch with error message
          throw new Error("Skills should not be more than 10");
        }
      },
    },
    PhotoURL: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("This is not a valid URL");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
