const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/checkauth');

const Post = require('../models/Post');

// @router GET api/posts
// @desc Create a new posts
// @acces Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId })
            .populate('user', ['username', 'createAt']);
        res.json({ success: true, posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// @router POST api/posts
// @desc Create a new posts
// @acces Private
router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    // Simple validation
    if (!title)
        return res
            .status(400)
            .json({ success: false, message: "Title is required" });

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId,
        })

        await newPost.save();

        res.json({ success: true, message: 'Happy Learning!', post: newPost });

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: 'Internal Server Error' });
    }

});

// @router PUT api/posts
// @desc Update a new posts
// @acces Private
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    // Simple validation
    if (!title)
        return res
            .status(400)
            .json({ success: false, message: "Title is required" });

    try {
        let updatePost = {
            title,
            description: description || ' ',
            url: (url.startsWith('https://') ? url : `https://${url}`) || ' ',
            status: status || 'TO LEARN',
        }

        const postUpdateCondition = { _id: req.params.id, user: req.userId };

        updatePost = await Post.findOneAndUpdate(
            postUpdateCondition,
            updatePost,
            { new: true }
        );

        // User not authorized to update post
        if (!updatePost)
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'You are not authorized to update post or post not found'
                });
        res.json({
            success: true,
            message: 'Update post successfully',
            post: updatePost
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal Server Error',
        
            });
    }
});

// @router Delete  api/posts
// @desc Delete a new posts
// @acces Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletePostCondition = {_id: req.params.id, user: req.userId };
        const deletePost = await Post.findOneAndDelete(deletePostCondition);

        if (!deletePost)
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'You are not authorized to delete post or post not found'
                });
        res.json({
            success: true,
            message: 'Delete post successfully',
            post: deletePost,
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal Server Error',
               
            });
    }
});
module.exports = router;