import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Freelancer from '../models/freelancerModel.js';
import Client from '../models/clientModel.js';
import Student from '../models/studentModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- Find the user from the token ID ---
      // We must check all 3 models
      let user = await Freelancer.findById(decoded.id).select('-password');
      let userType = 'Freelancer';

      if (!user) {
         user = await Client.findById(decoded.id).select('-password');
         userType = 'Client';
      }
      
      if (!user) {
         user = await Student.findById(decoded.id).select('-password'); 
         userType = 'Student';
      }
      // --- End user search ---

      if (!user) {
          res.status(401); 
          throw new Error('User not found'); 
      }

      // Attach user and userType to the request object
      req.user = user; 
      req.userType = userType; 
      next(); // Proceed to the next middleware or controller

    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token was found in the header at all
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided'); // <-- THIS IS YOUR ERROR
  }
});

// Middleware to check if user is Freelancer or Student
export const isContributor = (req, res, next) => {
    if (req.user && (req.userType === 'Freelancer' || req.userType === 'Student' )) {
        next(); 
    } else {
        res.status(401);
        throw new Error('Not authorized as a contributor (Freelancer or Student)');
    }
};

// Middleware to check if user is Client
export const isClient = (req, res, next) => {
    if (req.user && req.userType === 'Client') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a client');
    }
};