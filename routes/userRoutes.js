'use strict'
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
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get active users (GET /users/active)
router.get('/active', async (req, res) => {
  try {
    const activeUsers = await User.find({ isActive: true });
    res.status(200).json(activeUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a user
router.put('/users/:id', async (req,res) => {
    const userId = req.params.id;
        const {name, email, age, isActive} = req.body
    try {
      const user = await User.findByIdAndUpdate(userId, {name, email, age, isActive}, {new: true});
      if(!user ) {
        return res.status(400).json({error: 'User not found'})
       
      }
       return res.send(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
    // Route to deactivate a user
    router.put('/users/:id/deactivate', async (req, res) => {
        const userId = req.params.id;
      
        try {
          const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
      
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          // Send a response indicating successful deactivation
          res.status(200).json(user);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      });
      
})
module.exports = router;