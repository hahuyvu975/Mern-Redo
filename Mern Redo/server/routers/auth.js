const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @route POST api/auth.register
// @desc Register a user
// @access public
router.post('/register', async (req, res) => {
    const { username, password } = req.body;


    // Simple validation
    if (!(username) || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Invalid username or password are required' });

    try {
        // Check for existing user
        const user = await User.findOne({ username: username });

        if (user)
            return res
                .status(404)
                .json({ success: false, message: 'Username already in use' });


        //All good
        const hashedPasswords = await argon2.hash(password);
        const newUser = new User({ username, password: hashedPasswords });
        await newUser.save();

        // Return token
        const accessToken = jwt.sign(
            { userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: 'User created successfully', accessToken: accessToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}
);

// @route POST api/auth.login
// @desc Register a user
// @access public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: '1Invalid username or password are required' });

    try {
        // Check for existing user
        const user = await User.findOne({ username });
        if (!user)
            return res
                .status(400)
                .send({ success: false, message: 'Incorrect username ' });

        // username found
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res
                .status(400)
                .json({ success: false, message: 'Incorrect password' });

        //All good
        // Return token
        const accessToken = jwt.sign(
            { userId: user._id }, 
            process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: 'Login successfully', accessToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

});
// router.get('/', (req, res) =>  res.send('User Router')); 

module.exports = router;