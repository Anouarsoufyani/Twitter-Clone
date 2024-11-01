import { v2 as cloudinary } from 'cloudinary';

import Post from '../Models/Post.js'
import User from '../Models/User.js';
import Notification from '../Models/Notification.js';

export const createPost = async (req, res) => {

    const { caption } = req.body;
    let { image } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (!caption && !image) {
            return res.status(400).json({ success: false, error: 'The post cannot be empty' });
        }

        if(image) {
            const uploadResult = await cloudinary.uploader.upload(image);
            image = uploadResult.secure_url;
        }

        const newPost = new Post({
            postedBy: userId,
            caption,
            image,
        });

        await newPost.save();

        console.log(newPost);

        return res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const commentPost = async (req, res) => {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        if (!text) {
            return res.status(400).json({ success: false, error: 'The comment cannot be empty' });
        }


        const comment = {
            text,
            postedBy: userId
        };

        post.comments.push(comment);
        await post.save();
        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const likeUnlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const isPostLiked = post.likes.includes(userId);

        if (isPostLiked) {
            await Post.findByIdAndUpdate(postId, {
                $pull: { likes: userId }
            });

            await User.findByIdAndUpdate(userId, {
                $pull: { likedPosts: postId }
            });

            return res.status(200).json({ success: true, message: 'Post unliked successfully' });
        } else {
            await Post.findByIdAndUpdate(postId, {
                $push: { likes: userId }
            });

            await User.findByIdAndUpdate(userId, {
                $push: { likedPosts: postId }
            });

            const notification = new Notification({
                sender: userId,
                receiver: post.postedBy,
                type: 'like',
            })

            return res.status(200).json({ success: true, message: 'Post liked successfully' });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        if (post.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        if (post.image) {
            const imgId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        // const posts = await Post.find({}).populate('postedBy', '-password');
        // const posts = await Post.find({}).populate('postedBy', 'username profilePic fullName');
        const posts = await Post.find({}).populate({
            path: 'postedBy',
            select: 'username profilePic fullName'
        }).populate({
            path: 'comments.postedBy',
            select: 'username profilePic fullName'
        });

        // if (!posts) {
        //     return res.status(404).json({ success: false, error: 'Posts not found' });
        // }

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const getUserLikedPosts = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('_id');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // dans la video il fait passer l'id en param pas l'username
        // ensuite il fait
        // const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
        //     path: 'postedBy',
        //     select: 'username profilePic fullName',
        // }).populate({
        //     path: 'comments.postedBy',
        //     select: 'username profilePic fullName'
        // });

        const posts = await Post.find({ likes: user._id })
            .populate({
                path: 'postedBy',
                select: 'username profilePic fullName',
            })
            .populate({
                path: 'comments.postedBy',
                select: 'username profilePic fullName'
        });

        if (!posts) {
            return res.status(404).json({ success: false, error: 'Posts not found' });
        }
        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export  const getFollowingPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found TEST' });
        }

        const following = user.following;

        const feedPosts = await Post.find({ postedBy: { $in: following } })
        .populate({
            path: 'postedBy',
            select: 'username profilePic fullName',
        }).populate({
            path: 'comments.postedBy',
            select: 'username profilePic fullName'
        });
        return res.status(200).json({ success: true, data: feedPosts });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Errorororor" });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('_id');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const posts = await Post.find({ postedBy: user._id });
        if (!posts) {
            return res.status(404).json({ success: false, error: 'Posts not found' });
        }
        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}