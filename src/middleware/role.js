// middleware/role.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Replace with your User model

const authenticateRole = async (req, res, next, role) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Check if user exists and has the required role
    const user = await User.findOne({ _id: decoded.userId });
    if (!user || user.role !== role) {
      throw new Error();
    }

    // Attach user object to request for further use
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ error: 'Forbidden' });
  }
};

module.exports = authenticateRole;
