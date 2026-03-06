import Freelancer from '../models/freelancerModel.js'; // <-- Default import
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';

// @desc    Register a new freelancer
// @route   POST /api/auth/freelancer/register
// @access  Public
export const registerFreelancer = asyncHandler(async (req, res) => { // <-- Use export const
  const { fullName, email, mobile, password } = req.body;

  const freelancerExists = await Freelancer.findOne({ email });

  if (freelancerExists) {
    res.status(400); 
    throw new Error('Freelancer with this email already exists');
  }

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || ' '; 

  const freelancer = await Freelancer.create({
    firstName,
    lastName,
    email,
    mobile,
    password, 
  });

  if (freelancer) {
    res.status(201).json({ 
      _id: freelancer._id,
      firstName: freelancer.firstName,
      email: freelancer.email,
      role: 'FREELANCER', 
      token: generateToken(freelancer._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth freelancer (login)
// @route   POST /api/auth/freelancer/login
// @access  Public
export const loginFreelancer = asyncHandler(async (req, res) => { // <-- Use export const
  const { email, password } = req.body;
  
  const user = await Freelancer.findOne({ email }); 

  if (user && (await user.matchPassword(password))) {
    res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: 'FREELANCER',
        token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});