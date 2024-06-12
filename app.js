'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 3002

app.use(cors());

app.use(express.json());

const mongoose = require('mongoose');
const User = require('./models/User');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB);
  console.log('Connected to mongoose');



  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}




app.get('/', (req, res, next) => {
  res.status(200).json({message: 'Server is online'})
})

// new user route
app.post('/users', async (req, res) => {
  try {
      const { name, email, age, isActive } = req.body;
      const user = new User({ name, email, age, isActive });
      await user.save();
      res.status(201).json(user);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

// route to get all user
app.get('/users', async (req, res) => {
  try {
      const users = await User.find();
      res.status(200).json(users);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});






app.listen(PORT, () => {
    console.log('Connected to server on' + PORT);
})

