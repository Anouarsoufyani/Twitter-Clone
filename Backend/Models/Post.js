import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, // ref: refer to the id of the model
            ref: "User", // the id will be of the user model
            required: true
        },
        caption: {
            type: String,
        },
        image: {
            type: String,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId, // ref: refer to the id of the model
                ref: "User", // the id will be of the user model
                default: []
            }
        ],
        comments: [
            {
                text: {
                    type: String,
                    required: true
                },
                postedBy: {
                    type: mongoose.Schema.Types.ObjectId, // ref: refer to the id of the model
                    ref: "User", // the id will be of the user model
                    required: true
                },
                default: []
            }
        ]
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postSchema);
export default Post