const express = require('express');
const router = express.Router();
const { verifyToken } = require('./verifyToken');
const User = require('../models/User');


router.put('/update/:id', verifyToken, async (req, res) => {

    try {
        // Check if password is provided, and hash it if necessary
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Return the updated document
        );

        // If the user was not found
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/getAllUsers', verifyToken, async (req, res) => {
    const query = req.query.new;
    try {
        const allUser = query ? await User.find().sort({ _id: -1 }).limit(2) : await User.find();
        return res.status(200).json({ allUser, message: `Users fetched successfully...` })
    } catch (err) {
        return res.status(404).json({ message: `User not found!...` })
    }

});

router.get('/getById/:id', async (req, res) => {
    try {
        const existUser = await User.findById(req.params.id)
        return res.status(200).json(existUser);

    } catch (err) {
        return res.status(404).json({ message: `User not found!...` })
    }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: `User deleted successfully...` });
    } catch (err) {
        return res.status(404).json({ message: `User not found` });
    }
})

router.get('/stats', verifyToken, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum : 1 },
                },
            }
        ])
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router;