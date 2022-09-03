const { Schema, model, Types } = require("mongoose");

const postSchema = new Schema(
    {
        caption: String,
        image: {
            type: String,
        },
        likes: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
        location: String,
        comments: [
            {
                type: Types.ObjectId,
                ref: "Comment",
            },
        ],
        user: {
            type: Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Post = model("Post", postSchema);
module.exports = Post;
