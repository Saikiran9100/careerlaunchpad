import Student from '../models/studentModel.js'; // <-- Default import
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';

// @desc    Register a new student
// @route   POST /api/auth/student/register
// @access  Public
export const registerStudent = asyncHandler(async (req, res) => { // <-- Use export const
  const { fullName, email, mobile, password } = req.body;

  const studentExists = await Student.findOne({ email });

  if (studentExists) {
    res.status(400); 
    throw new Error('Student with this email already exists');
  }

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || ' '; 

  const student = await Student.create({
    firstName,
    lastName,
    email,
    mobile,
    password,
  });

  if (student) {
    res.status(201).json({ 
      _id: student._id,
      firstName: student.firstName,
      email: student.email,
      role: 'STUDENT',
      token: generateToken(student._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid student data');
  }
});

// @desc    Auth student (login)
// @route   POST /api/auth/student/login
// @access  Public
export const loginStudent = asyncHandler(async (req, res) => { // <-- Use export const
    const { email, password } = req.body;
    const user = await Student.findOne({ email }); 

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            email: user.email,
            role: 'STUDENT',
            token: generateToken(user._id),
        });
    } else {
        res.status(401); 
        throw new Error('Invalid email or password');
    }
});