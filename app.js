'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function main() {
  await mongoose.connect(process.env.DB);
  console.log('Connected to MongoDB');
}

main().catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1);
});

const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is online' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
