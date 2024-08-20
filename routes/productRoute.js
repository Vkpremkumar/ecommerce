const express = require('express');
const router = express.Router();
const { verifyToken } = require('./verifyToken');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const cors = require('cors')



// Set up storage for multer
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads") // specify the destination folder
    },
    filename: function(req,file,cb){
        console.log(file)
        cb(null,Date.now() + path.extname(file.originalname)) // filename will include timestamps to avoid collisions
    }
});

// initialize upload middleware
const upload = multer({storage:storage});


// create product
router.post('/addProduct', verifyToken, upload.single('image'), async (req, res) => {
    // const newProduct = new Product(req.body)
    try {
        const newProduct = new Product({
            title: req.body.title,
            desc: req.body.description,
            img: req.file ? `/uploads/${req.file.filename}` : '', // Save the image file path in the database
            categories: req.body.category ? [req.body.category] : [],
            size: req.body.size,
            color: req.body.color,
            price: req.body.price
        });
        const savedProduct = await newProduct.save();
        return res.status(200).json({ savedProduct });
    } catch (err) {
        return res.status(400).json({ message: `Something went wrong while adding product!..` })
    }
})

// Update product
router.put('/update/:id', verifyToken, async (req, res) => {

    try {
        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // stores the updated document
        );

        // If the user was not found
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// delete the product

router.delete('/delete/:id', verifyToken, async (req, res) => {

    try {
        // Update the product
        await Product.findByIdAndUpdate(req.params.id);
        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (err) {
        return res.status(500).json(err);
    }
});

// get Product
router.get('/getById/:id', async (req, res) => {
    try {
        const existProduct = await Product.findById(req.params.id)
        return res.status(200).json(existProduct);

    } catch (err) {
        return res.status(404).json({ message: `Product not found!...` })
    }
});

//get all products
router.get('/getAllProducts', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = await Product.find();
        }
        return res.status(200).json({products});
    } catch (err) {
        return res.status(404).json({ message: `Product not found!...` })
    }

});




module.exports = router;