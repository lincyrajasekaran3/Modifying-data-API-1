require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(express.json()); // Allows JSON request bodies
app.use(cors()); // Enables CORS

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Define MenuItem Schema
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// POST /menu - Add new menu item
app.post('/menu', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: "Name and price are required" });
        }

        const newItem = new MenuItem({ name, description, price });
        await newItem.save();

        res.status(201).json({ message: "Menu item added successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /menu - Fetch all menu items
app.get('/menu', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
