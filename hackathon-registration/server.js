const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon-registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Student model
const Student = require('./models/Student');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    const newStudent = new Student({
        name: req.body.name,
        email: req.body.email,
        college: req.body.college,
        phone: req.body.phone
    });
    try {
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
