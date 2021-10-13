const mongoose = require("mongoose");

const peopleSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      // required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetToken: {
      type: String,
    },
    resetTokenTimeout: {
      type: mongoose.Schema.Types.Date,
    }
  },
  {
    timestamps: true,
  }
);

const People = mongoose.model("People", peopleSchema);

module.exports = People;