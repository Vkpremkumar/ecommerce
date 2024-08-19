const express = require('express')
const router = express.Router();
const { verifyToken } = require('./verifyToken');
const Cart = require('../models/CartModel');

// create Cart
router.post('/addCart', async (req, res) => {
    const newCart = new Product(req.body)
    try {
        const savedCart = await newCart.save();
        return res.status(200).json({ savedCart });
    } catch (err) {
        return res.status(500).json({ message: `Something  went wrong!..` })
    }
})

// Update Cart
router.put('/update/:id', async (req, res) => {

    try {
        // Update the Cart
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // stores the updated document
        );

        // If the Cart was not found
        if (!updatedCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json(updatedCart);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// delete the Cart

router.delete('/delete/:id', async (req, res) => {

    try {
        // Delete the cart
        await Cart.findByIdAndUpdate(req.params.id);
        return res.status(200).json({ message: "Cart deleted successfully" });

    } catch (err) {
        return res.status(500).json(err);
    }
});

// get user Cart
router.get('/find/:userId', async (req, res) => {
    try {
        const existCart = await Cart.findOne({ userId: req.params.userId });
        return res.status(200).json(existCart);

    } catch (err) {
        return res.status(404).json({ message: `Cart not found!...` })
    }
});

//get all Carts
router.get('/getAllCarts', verifyToken, async (req, res) => {

    try {
        const carts = await Product.find();
        return res.status(200).json({ carts });
    } catch (err) {
        return res.status(404).json({ message: `Cart not found!...` })
    }

});



module.exports = router;