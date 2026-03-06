import asyncHandler from 'express-async-handler';
import InterviewExperience from '../models/interviewExperienceModel.js';

// @desc    Add a new interview experience
// @route   POST /api/interviews
// @access  Private (Freelancer/Student)
export const addExperience = asyncHandler(async (req, res) => {
    const {
        collegeName, companyName, roleAppliedFor, packageLPA,
        interviewDate, interviewQuestions, experienceDetails,
        tipsOrRemarks, difficulty, offerReceived
    } = req.body;

    // --- THIS IS THE FIX ---
    // The validation now checks for the same fields as your frontend form.
    // We check 'interviewQuestions.length' because it's an array.
    if (!collegeName || !companyName || !roleAppliedFor || !experienceDetails || !interviewQuestions || interviewQuestions.length === 0) {
        res.status(400);
        throw new Error('Please fill in all required fields marked with *');
    }
    // --- END OF FIX ---

    const experience = await InterviewExperience.create({
        user: req.user._id,
        userModelType: req.userType,
        collegeName,
        companyName,
        roleAppliedFor,
        packageLPA: Number(packageLPA) || 0,
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        interviewQuestions, // This is now correctly saved as an array
        experienceDetails,
        tipsOrRemarks,
        difficulty,
        offerReceived: offerReceived, // Allow null, true, or false
    });

    res.status(201).json(experience);
});

// @desc    Get all interview experiences
// @route   GET /api/interviews
// @access  Private (Logged-in users)
export const getAllExperiences = asyncHandler(async (req, res) => {
    const experiences = await InterviewExperience.find({})
        .populate('user', 'firstName lastName profileImage') // Populate user's name
        .sort({ createdAt: -1 });
    res.json(experiences);
});

// @desc    Get a single interview experience by ID
// @route   GET /api/interviews/:id
// @access  Private (Logged-in users)
export const getExperienceById = asyncHandler(async (req, res) => {
    const experience = await InterviewExperience.findById(req.params.id)
        .populate('user', 'firstName lastName profileImage');
        
    if (experience) {
        res.json(experience);
    } else {
        res.status(404);
        throw new Error('Experience not found.');
    }
});