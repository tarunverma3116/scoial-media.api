const mongoose = require("mongoose");
const PostSchema = require("./Post");
mongoose.set("strictQuery", false);

const UserSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
