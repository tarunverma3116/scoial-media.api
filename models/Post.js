const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const PostSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true, 
    },
    image: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    likes: {
        type: [String],
        default:[""],
    },
    comments: {
        type: [
            {
                text: String,
                userId: String
            }
        ],
        default: [{}],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);
