import Client from '../models/clientModel.js'; // <-- Default import
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler'; // Optional, but good practice

// @desc    Register a new client
// @route   POST /api/auth/client/register
// @access  Public
export const registerClient = asyncHandler(async (req, res) => { // <-- Use export const
  const { fullName, email, mobile, password } = req.body;

  const clientExists = await Client.findOne({ email });

  if (clientExists) {
    res.status(400); 
    throw new Error('Client with this email already exists');
  }

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || ' '; 

  const client = await Client.create({
    firstName,
    lastName,
    email,
    mobile,
    password, 
  });

  if (client) {
    res.status(201).json({ 
      _id: client._id,
      firstName: client.firstName,
      email: client.email,
      role: 'CLIENT', // Send uppercase role
      token: generateToken(client._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth client (login)
// @route   POST /api/auth/client/login
// @access  Public
export const loginClient = asyncHandler(async (req, res) => { // <-- Use export const
  const { email, password } = req.body;
  
  const user = await Client.findOne({ email }); // This will now work

  if (user && (await user.matchPassword(password))) {
    res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: 'CLIENT', // Send uppercase role
        token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});