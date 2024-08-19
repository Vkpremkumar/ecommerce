const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.post("/register", async (req, res) => {

    if (!req.body.password) {
        return res.status(400).json({ error: `Password is required...` })
    }

    // if(!process.env.SECRET || process.env.SECRET.length<8){
    //     return res.status(500).json({error: `Password must be minimum 8 characters...`})
    // }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        // password:req.body.password
        password: hashPassword,
        role:req.body.role
    })

    try {
        const savedUser = await newUser.save();
        return res.status(200).json({ savedUser });

    } catch (error) {
        res.status(400).json({error:error.message});
    }

})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: `User not found!..` })
        }
        // if user exists then verify the password match with the user given password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(404).json({ message: `Password does not match!..` })
        }

        // const { password, ...others } = user;
        // if Password matched then generate JWT token 
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role:user.role
        }, process.env.JWT_SECRET, { expiresIn: "1h" }) // token valid for one hour

        console.log(`Token:`,accessToken)

        return res.status(200).json({user,Token: accessToken, message: `User logged in successfully..`})
    } catch (err) {
        return res.status(404).json({ message: `login failed...` })
    }
})



module.exports = router;