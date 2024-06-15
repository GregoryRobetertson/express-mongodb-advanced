'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');


const PORT = process.env.PORT || 3000; // Corrected PORT variable

// Middleware
app.use(cors());
app.use(express.json());

main().catch ((err)=> {
  console.log(err);
  
  } )
  
  async function main() {
      await mongoose.connect(process.env.DB);
      console.log('Connected to mongoose');
    
  
  
    
      // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    }
    

// Routes
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is online' });
});



// Start server
app.listen(PORT, () => {
  console.log('Server is running on port' + PORT);
});
