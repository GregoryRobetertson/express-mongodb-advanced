const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const authenticate = (req, res, next) => {
  // Get token from Authorization header (assuming Bearer scheme)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  // Verify token using secret key from environment
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; // Attach decoded user data to request object
    next(); // Continue to route handler if token is valid
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    } else {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  }
};

module.exports = authenticate;