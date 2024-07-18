'use strict';

const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const SALT_WORK_FACTOR = 10; // Adjust this value to control hashing time (higher = slower but more secure)

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Define allowed roles (optional)
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Pre-save hook to hash password before saving the user
userSchema.pre('save', async function (next) {
  // Check if password is modified, otherwise skip hashing
  if (!this.isModified('password')) return next();

  // Generate a salt for password hashing
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  // Hash the password with the generated salt
  const hash = await bcrypt.hash(this.password, salt);

  // Replace plain text password with the hashed password
  this.password = hash;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
