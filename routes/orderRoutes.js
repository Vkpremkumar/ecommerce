const express = require('express');
const router = express.Router();
const { verifyToken } = require('./verifyToken');
const Order = require('../models/OrderModel');

// create order
router.post('/addOrder', async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        return res.status(200).json({ savedOrder });
    } catch (err) {
        return res.status(500).json({ message: `Something  went wrong!..` })
    }
})

// Update order
router.put('/update/:id', verifyToken, async (req, res) => {

    try {
        // Update the product
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // stores the updated document
        );

        // If the user was not found
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(updatedOrder);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// delete the product

router.delete('/delete/:id', verifyToken, async (req, res) => {

    try {
        // Update the Order
        await Order.findByIdAndUpdate(req.params.id);
        return res.status(200).json({ message: "Order deleted successfully" });

    } catch (err) {
        return res.status(500).json(err);
    }
});

// get Order
router.get('/find/:userId', async (req, res) => {
    try {
        const existOrder = await Order.find({ userId: req.params.userId });
        return res.status(200).json(existOrder);

    } catch (err) {
        return res.status(404).json({ message: `Order not found!...` })
    }
});

//get all products
router.get('/getAllOrders', verifyToken, async (req, res) => {

    try {

        const orders = await Order.find();

        return res.status(200).json({ orders });
    } catch (err) {
        return res.status(404).json({ message: `Order not found!...` })
    }

});

// Order stats

router.get('/getIncome', verifyToken, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date(date.setMonth(date.getMonth() - 1)));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);
        return res.status(200).json(income);
    } catch (err) {
        return res.status(500).json(err);
    }
});




module.exports = router;