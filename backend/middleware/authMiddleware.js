const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../utils/errorUtils');

const protect = async (req, res, next) => {
  try {
    let token;


    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(createError('Access denied. No token provided', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      

      const user = await User.findById(decoded._id);
      
      if (!user) {
        return next(createError('Invalid token. User not found', 401));
      }


      if (user.isLocked) {
        return next(createError('Account is temporarily locked due to failed login attempts', 423));
      }


      req.user = {
        _id: user._id,
        email: user.email,
        isBusiness: user.isBusiness,
        isAdmin: user.isAdmin,
        name: user.name
      };

      next();
    } catch (error) {
      return next(createError('Invalid token', 401));
    }
  } catch (error) {
    next(error);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(createError('Access denied. Authentication required', 401));
  }

  if (!req.user.isAdmin) {
    return next(createError('Access denied. Admin privileges required', 403));
  }

  next();
};

const businessOrAdmin = (req, res, next) => {
  if (!req.user) {
    return next(createError('Access denied. Authentication required', 401));
  }

  if (!req.user.isBusiness && !req.user.isAdmin) {
    return next(createError('Access denied. Business account or admin privileges required', 403));
  }

  next();
};

const ownerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return next(createError('Access denied. Authentication required', 401));
  }

  const resourceId = req.params.id;
  const userId = req.user._id.toString();

  if (req.user.isAdmin) {
    return next();
  }

  if (req.baseUrl.includes('/users')) {
    if (resourceId !== userId) {
      return next(createError('Access denied. You can only access your own profile', 403));
    }
    return next();
  }

  next();
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = {
  protect,
  adminOnly,
  businessOrAdmin,
  ownerOrAdmin,
  generateToken
};