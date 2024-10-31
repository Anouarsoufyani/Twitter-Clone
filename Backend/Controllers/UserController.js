import { v2 as cloudinary } from 'cloudinary';

import User from '../Models/User.js'
import Notification from '../Models/Notification.js'
import bcrypt from 'bcryptjs'

export const getUserProfile = async (req, res) => {

    // validation for req.params
    const {username} = req.params;

    try {
        // checking if user exists
        const user = await User.findOne({username}).select('-password');
        if (!user) {
            return res.status(404).json({success: false, error: 'User not found'})
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const followUnfollowUser = async (req, res) => {

    const {id} = req.params;

    try {
        // checking if user exists
        const userToFollow = await User.findOne({_id : id}).select('-password');
        const currentUser = await User.findById(req.user._id).select('-password');

        if(id === req.user.id) {
            return res.status(400).json({success: false, error: 'You cannot follow yourself'});
        }
        
        if (!userToFollow || !currentUser) {
            return res.status(404).json({success: false, error: 'User not found'})
        }

        const isFollowing = currentUser.following.includes(id);   

        if(isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(req.user.id, {
                $pull: {following: id}
            });

            await User.findByIdAndUpdate(id, {
                $pull: {followers: req.user._id}
            });
            // TODO return the id of the user as a response
            res.status(200).json({success: true, message: 'Unfollowed user successfully'});
        } else {
            // Follow user
            await User.findByIdAndUpdate(req.user.id, {
                $push: {following: id}
            });
            await User.findByIdAndUpdate(id, {
                $push: {followers: req.user._id}
            });

            const newNotification = new Notification({
                sender: req.user._id,
                receiver: userToFollow._id,
                type: 'follow'
            });

            if(newNotification) {
                await newNotification.save();
            }

            // TODO return the id of the user as a response
            res.status(200).json({success: true, message: 'Following user successfully'});
            // send notification
        }
    } catch (error) {
        return res.status(500).json({success: false, error: error.message});
    }
}

export const getSuggestedUsers = async (req, res) => {

    try {
        const userId = req.user._id;
        const userFollowedByMe = req.user.following;
        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId, $nin: userFollowedByMe}
                }
            },
            {$sample: {size: 10}},
        ])

        // const filteredUsers = users.filter(user => {
        //     return !userFollowedByMe.includes(user._id);
        // })

        const suggestedUsers = users.slice(0, 4);

        suggestedUsers.forEach(user => user.password = null);

        return res.status(200).json({
            success: true,
            data : suggestedUsers
        })
    } catch (error) {
        return res.status(500).json({success: false, error: error.message});
    }
}

export const updateProfile = async (req, res) => {
    const {fullName, username, email, newPassword, currentPassword, bio, links} = req.body;
    let { profilePic, coverPic} = req.body;

    try {
        let profile = await User.findById(req.user._id);

        if(!profile) {
            return res.status(404).json({success: false, error: 'User not found'});
        }

        // Password validation
        if((newPassword && !currentPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({success: false, error: 'All fields are required'});
        }else if(newPassword && currentPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, profile.password);
            if(!isPasswordValid) {
                return res.status(400).json({success: false, error: 'The passwords don\'t match'});
            }
            if(newPassword.length < 6) {
                return res.status(400).json({success: false, error: 'Password must be at least 6 characters'});
            }
            const salt = await bcrypt.genSalt(10);
            profile.password = await bcrypt.hash(newPassword, salt);
        }

        if(profilePic) {
            if(profile.profilePic) {
                await cloudinary.uploader.destroy(profile.profilePic.split('/').pop().split('.')[0]);
                // console.log(path.basename(profile.profilePic));
                // console.log(profile.profilePic.split('/').pop().split('.')[0]);
                // console.log(profile.profilePic.split('/').pop());
            }
            const uploadResult = await cloudinary.uploader.upload(profilePic);
            profile.profilePic = uploadResult.secure_url;
            // console.log(uploadResult, uploadResult.secure_url);
        }
        if(coverPic) {
            if(profile.coverPic) {
                await cloudinary.uploader.destroy(profile.coverPic.split('/').pop().split('.')[0]);
            }
            const uploadResult = await cloudinary.uploader.upload(coverPic);
            profile.coverPic = uploadResult.secure_url;
        }
        
        // if(fullName) {
        //     profile.fullName = fullName;
        // }
        // pareil mais plus simple
        profile.fullName = fullName || profile.fullName;
        profile.username = username || profile.username;
        profile.email = email || profile.email;
        profile.bio = bio || profile.bio;
        profile.links = links || profile.links;


        profile = await profile.save();

        // remove password from response
        profile.password = null;

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        })

    }catch(error) {
        return res.status(500).json({success: false, error: error.message});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        return res.status(200).json({
            success: true,
            data : users
        })
    } catch (error) {
        return res.status(500).json({success: false, error: 'Not connected'});
    }
}