const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoutes')
const authRoute = require('./routes/authRoutes');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoutes');
const cors = require('cors');


dotenv.config();



const app = express();
const PORT = process.env.PORT || 4000;

// establish middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


// Establish database connection

const Connection =  () => {
    try {
        mongoose.connect(process.env.URL)
        console.log("DB Connected successfully...")
    } catch (err) {
        console.log("Error: " + err)
    }
}

Connection()

// routes
app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/product',productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/order',orderRoute);

// server listening port
app.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
});

