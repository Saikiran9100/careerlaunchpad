import asyncHandler from 'express-async-handler';
import Application from '../models/applicationModel.js';

// Helper function (already in your file)
const getProjectsByStatus = asyncHandler(async (req, res, statusQuery) => {
    const applicantId = req.user._id;
    
    const applications = await Application.find({ 
        applicantId: applicantId,
        status: statusQuery
    })
    .populate({
        path: 'projectId', 
        model: 'Project'
    })
    .populate({
        path: 'clientId',
        select: 'firstName lastName companyName'
    })
    .sort({ createdAt: -1 });

    res.status(200).json(applications);
});

// @desc    Get all projects freelancer has applied to (pending)
export const getAppliedProjects = asyncHandler(async (req, res) => {
    await getProjectsByStatus(req, res, { $in: ['applied', 'shortlisted'] });
});

// @desc    Get all projects freelancer is actively working on
export const getActiveProjects = asyncHandler(async (req, res) => {
    await getProjectsByStatus(req, res, 'hired');
});

// @desc    Get all projects freelancer has completed
export const getCompletedProjects = asyncHandler(async (req, res) => {
    await getProjectsByStatus(req, res, 'completed');
});

// --- 1. ADD THIS NEW FUNCTION ---
// @desc    Get all projects freelancer was rejected from
// @route   GET /api/freelancer/projects/rejected
// @access  Private (Freelancer/Student)
export const getRejectedProjects = asyncHandler(async (req, res) => {
    await getProjectsByStatus(req, res, 'rejected');
});