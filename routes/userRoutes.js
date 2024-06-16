'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to add a new user (POST /users)
router.post('/users', async (req, res) => {
  try {
    const { name, email, age, isActive } = req.body;
    const user = new User({ name, email, age, isActive });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get all users (GET /users)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get active users (GET /users/active)
router.get('/users/active', async (req, res) => {
  try {
    const activeUsers = await User.find({ isActive: true });
    res.status(200).json(activeUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a user (PUT /users/:id)
router.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, age, isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { name, email, age, isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to deactivate a user (PUT /users/:id/deactivate)
router.put('/users/:id/deactivate', async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to delete a user (DELETE /users/:id)
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
