import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId, // ref: refer to the id of the model
                ref: "User", // the id will be of the user model
                default: []
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId, // ref: refer to the id of the model
                ref: "User", // the id will be of the user model
                default: []
            }
        ],
        profilePic: {
            type: String,
            default: ""
        },
        coverPic: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: ""
        },
        links: {
            type: String,
            default: ""
        },
        likedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId, // ref: refer to the id of the model
                ref: "Post", // the id will be of the post model
                default: []
            }
        ]
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

export default User;