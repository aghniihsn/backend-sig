// backend/server.js (Kode Lengkap yang Diperbaiki)

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // ✨ PERBAIKAN: Seharusnya require('cors')

const app = express();
const PORT = process.env.PORT || 5000; 

// --- 1. Konfigurasi MongoDB dan Model Mongoose ---
mongoose.connect(process.env.MONGO_URI) 
.then(() => console.log('MongoDB Connected successfully!'))
.catch(err => console.log('MongoDB connection error:', err));

// Skema Model Lokasi
const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

const Location = mongoose.model('Location', LocationSchema);

// Middleware
app.use(express.json()); 
app.use(cors()); // Middleware CORS

// --- 2. Endpoint API (Back-End) ---

// GET: Mengambil semua lokasi
app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving locations', error: err.message });
    }
});

// POST: Menambah lokasi baru
app.post('/api/locations', async (req, res) => {
    const { name, description, latitude, longitude } = req.body; 
    try {
        const newLocation = new Location({ name, description, latitude, longitude });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(400).json({ message: 'Error saving new location', error: err.message });
    }
});

// DELETE: Menghapus lokasi berdasarkan ID
app.delete('/api/locations/:id', async (req, res) => {
    try {
        const result = await Location.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (err) {
        // Jika ID tidak valid, Mongoose akan menangani dan kita kirim error 500
        res.status(500).json({ message: 'Error deleting location (Invalid ID format)', error: err.message });
    }
});


// --- 3. Melayani Front-End (Static Files) ---
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Endpoint root akan melayani index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});


// Mulai Server
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));