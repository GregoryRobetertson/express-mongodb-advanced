'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import for JWT functionality

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function main() {
  try {
    await mongoose.connect(process.env.DB);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process if MongoDB connection fails
  }
}

main().catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1); // Exit process if main() fails
});

const userRoutes = require('./src/routes/userRoutes'); // Might need adjustment based on your folder structure
const User = require('./src/models/User'); // Might need adjustment based on your folder structure

app.use(userRoutes);

// User registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route with JWT token generation
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Find user by email

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Ensure hashed password is retrieved from the database
    const hashedPassword = user.password; // Assuming 'password' is the field storing the hash

    const isMatch = await bcrypt.compare(password, hashedPassword); // Compare passwords

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // ... rest of the login logic (token generation, etc.) ...

  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
