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
const authenticate = require('./src/middleware/auth');
const authenticateRole = require('./src/middleware/role');

app.use(userRoutes);

// User registration route
app.post('/register', async (req, res) => {
  const { name,email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: 'This is the dashboard', user: req.user });
});

// Login route with JWT token generation
app.post('/login', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const hashedPassword = user.password;

    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Passwords match, generate JWT token without expiresIn
      const token = jwt.sign(
        { userId: user._id, email: user.email }, // Payload
        process.env.SECRET, // Secret key for signing
      );

      res.status(200).json({ token });

    } catch (bcryptError) {
      console.error('Error comparing passwords:', bcryptError.message);
      res.status(500).json({ error: 'Internal server error' });
    }

  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/admin', (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin area', user: req.user });
});

app.get('/user', (req, res) => {
  res.status(200).json({ message: 'Welcome to the user area', user: req.user });
});

app.get('/admin/resource', (req, res) => {
  
  authenticateRole(req, res, next, 'admin');
  res.status(200).json({ message: 'Access granted to admin resource', user: req.user });
});

app.get('/user/resource', (req, res) => {
  // Call authenticateRole middleware with 'user' role
  authenticateRole(req, res, next, 'user');
  res.status(200).json({ message: 'Access granted to user resource', user: req.user });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
