const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      required: true,
    },
    conversation: {
      type: [
        {
          senderId: String,
          text: String,
          time: { type: Date, default: Date.now },
        },
      ],
      default: [{}],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
