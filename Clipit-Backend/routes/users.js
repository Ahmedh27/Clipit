// users.js

const express = require('express');
const router = express.Router();
require('dotenv').config(); 

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', 
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], 
    },
});

const upload = multer({ storage: storage });

// POST route for file upload
router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({
            message: 'File uploaded successfully',
            file: req.file,
        });
    } catch (err) {
        next(err); 
    }
});

// Test route to verify that the router is working after errors
router.get('/test', (req, res) => {
    res.json({ message: 'Test route is working' });
});

module.exports = router;
