const Post = require("../models/Post");
const s3Service = require("../services/s3Service");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const getHash = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const { _id } = req.payload;
    const files = req.files;
    const postImage = getHash(files.post.data);
    await s3Service.uploadToS3(files.post.data, postImage);
    const post = await Post.create({
      userId: _id,
      caption,
      image: postImage,
    });
    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createPost,
  getPosts,
};
