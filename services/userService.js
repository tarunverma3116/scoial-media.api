const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const s3Service = require("../services/s3Service");
const EmailNotificationService = require("./EmailNotificationService");
const otpService = require("./otpService.js");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const createUser = async (req, res) => {
  try {
    const { emailId, password, name, userName } = req.body;
    const user = await User.create({
      emailId,
      password,
      name,
      userName,
    });
    // EmailNotificationService.sendSignUpSuccessEmail(emailId, userName);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const isPasswordMatched = user.password === password;
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      token,
      user,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  const { _id } = req.payload;
  console.log(_id);
  const user = await User.findOne({ _id: _id });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
  res.status(200).json({
    success: true,
    message: "User Details Found",
    data: user,
  });
};

const getUserFromId = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
  res.status(200).json({
    success: true,
    message: "User Details Found",
    data: user,
  });
};

const getHash = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

const updateUser = async (req, res) => {
  try {
    const { _id } = req.payload;
    const { name } = req.body;
    const files = req.files;
    const image_file_extension = ["jpg", "png", "jpeg"]; //TODO: add extension check
    console.log({
      files,
      name,
    });
    const user = await User.findOne({ _id });
    console.log("user searched for update", user);
    const profileImage = getHash(files.avatar.data);
    const coverImage = getHash(files.banner.data);
    await s3Service.uploadToS3(files.avatar.data, profileImage);
    await s3Service.uploadToS3(files.banner.data, coverImage);
    console.log(profileImage, coverImage);
    if (user) {
      console.log("updating");
      const result = await User.updateOne(
        { _id },
        {
          coverImage,
          profileImage,
          name,
        }
      );
      // await user.save();
      res.status(StatusCodes.OK).json({
        success: true,
        message: "User Successfully Updated",
        data: result,
      });
    } else {
      console.log("creating");
      const newUser = new User({
        coverImage,
        profileImage,
        name,
      });
      await newUser.save();
      res.status(StatusCodes.OK).json({
        success: true,
        message: "User Successfully Created",
        data: newUser,
      });
    }
    return true;
  } catch (err) {
    console.log(err);
  }
};

const getPostsForUser = async (req, res) => {
  const { _id } = req.payload;
  console.log(_id, "id to fetch posts");
  try {
    const posts = await Post.find({ userId: _id });
    res.status(200).json({
      success: true,
      message: "Posts Found",
      data: posts,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPostsForUserFromId = async (req, res) => {
  const { id } = req.params;
  console.log(id, "id to fetch posts");
  try {
    const posts = await Post.find({ userId: id });
    res.status(200).json({
      success: true,
      message: "Posts Found",
      data: posts,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const searchUser = async (req, res) => {
  try {
    const { keyword } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { userName: { $regex: keyword, $options: "i" } },
        { emailId: { $regex: keyword, $options: "i" } },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

const followUser = async (req, res) => {
  const { _id } = req.payload;
  const { id } = req.params;
  try {
    // Find the user to be followed
    const userToFollow = await User.findById(id);
    if (!userToFollow)
      return res.status(404).send({ message: "User not found" });

    // Find the current user
    const currentUser = await User.findById(_id);
    if (!currentUser)
      return res.status(404).send({ message: "User not found" });

    // Check if the current user is already following the target user
    if (currentUser.following.includes(userToFollow._id)) {
      res.status(201).json({
        success: true,
        message: "Already following the user",
      });
    } else {
      // Add the target user to the current user's "following" list
      currentUser.following.push(userToFollow._id);
      await currentUser.save();

      // Add the current user to the target user's "followers" list
      userToFollow.followers.push(currentUser._id);
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
};

const feedPostsForUser = async (req, res) => {
  const { _id } = req.payload;
  let feed_posts = [];
  try {
    const followedUsers = await User.findById(_id).populate("following");
    for (let i = 0; i < followedUsers.following.length; i++) {
      const posts = await Post.find({ userId: followedUsers.following[i]._id });
      for (let j = 0; j < posts.length; j++) {
        if (
          posts[j].createdAt >
          new Date(new Date().setDate(new Date().getDate() - 7))
        ) {
          feed_posts.push({
            post: posts[j],
            user: await User.findById(posts[j].userId),
          });
        }
      }
    }
    res.status(200).json({
      success: true,
      message: "Posts Found",
      data: feed_posts,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUserFollowing = async (req, res) => {
  const { _id } = req.payload;
  try {
    const user = await User.findById(_id);
    const followedUsers = [];
    for (let i = 0; i < user.following.length; i++) {
      followedUsers.push(await User.findById(user.following[i]));
    }
    res.status(200).json({
      success: true,
      message: "Users Found",
      data: followedUsers,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  getPostsForUser,
  searchUser,
  getUserFromId,
  followUser,
  getPostsForUserFromId,
  feedPostsForUser,
  getUserFollowing,
};
