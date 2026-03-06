

// import asyncHandler from 'express-async-handler';
// import Review from '../models/reviewModel.js';
// import Project from '../models/projectModel.js';
// import Application from '../models/applicationModel.js';
// import Freelancer from '../models/freelancerModel.js'; 

// // @desc    Create a new review
// // @route   POST /api/reviews
// // @access  Private (Client)
// export const createReview = asyncHandler(async (req, res) => {
//     const { projectId, rating, comment } = req.body;
//     const clientId = req.user._id;

//     if (req.userType !== 'Client') {
//         res.status(403);
//         throw new Error('Only clients can leave reviews.');
//     }

//     const project = await Project.findById(projectId);
//     if (!project) {
//         res.status(404); throw new Error('Project not found.');
//     }
//     if (project.postedBy.toString() !== clientId.toString()) {
//         res.status(403); throw new Error('You are not authorized to review this project.');
//     }
    
//     const existingReview = await Review.findOne({ projectId });
//     if (existingReview) {
//         res.status(400); throw new Error('This project has already been reviewed.');
//     }

//     const application = await Application.findOne({ 
//         projectId, 
//         status: { $in: ['hired', 'completed'] } 
//     });

//     if (!application) {
//         res.status(404); throw new Error('Could not find the hired freelancer for this project.');
//     }

//     const review = await Review.create({
//         projectId,
//         clientId,
//         rating: Number(rating),
//         comment,
//         freelancerId: application.applicantId,
//         freelancerModelType: application.applicantModelType,
//     });

//     // UPDATE FREELANCER PROFILE
//     if (application.applicantModelType === 'Freelancer') {
//         const freelancer = await Freelancer.findById(application.applicantId);
        
//         if (freelancer) {
//             if (!Array.isArray(freelancer.reviews)) {
//                 freelancer.reviews = [];
//             }

//             // --- FIX: USE COMPANY NAME IF AVAILABLE ---
//             const reviewerName = req.user.companyName || `${req.user.firstName} ${req.user.lastName}`.trim() || 'Client';

//             const newReview = {
//                 name: reviewerName, // <--- Corrected Name Logic
//                 rating: Number(rating),
//                 comment,
//                 clientId: req.user._id,
//                 projectId: projectId,
//                 createdAt: new Date()
//             };

//             freelancer.reviews.push(newReview);

//             // Recalculate Average Rating
//             const totalStars = freelancer.reviews.reduce((acc, item) => item.rating + acc, 0);
//             freelancer.rating = totalStars / freelancer.reviews.length;

//             await freelancer.save();
//         }
//     }

//     application.isReviewed = true;
//     await application.save();

//     res.status(201).json(review);
// });

// // @desc    Get review for a specific project
// // @route   GET /api/reviews/project/:projectId
// // @access  Private
// export const getReviewByProject = asyncHandler(async (req, res) => {
//     const review = await Review.findOne({ projectId: req.params.projectId });
//     if (review) {
//         res.json(review);
//     } else {
//         res.status(404);
//         throw new Error('Review not found');
//     }
// });



import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Project from '../models/projectModel.js';
import Application from '../models/applicationModel.js';
import Freelancer from '../models/freelancerModel.js'; 

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Client)
export const createReview = asyncHandler(async (req, res) => {
    const { projectId, rating, comment } = req.body;
    const clientId = req.user._id;

    if (req.userType !== 'Client') {
        res.status(403);
        throw new Error('Only clients can leave reviews.');
    }

    // 1. Fetch Project
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404); throw new Error('Project not found.');
    }
    if (project.postedBy.toString() !== clientId.toString()) {
        res.status(403); throw new Error('You are not authorized to review this project.');
    }
    
    // 2. Check for existing review
    const existingReview = await Review.findOne({ projectId });
    if (existingReview) {
        res.status(400); throw new Error('This project has already been reviewed.');
    }

    // 3. Find the Hired Application
    const application = await Application.findOne({ 
        projectId, 
        status: { $in: ['hired', 'completed'] } 
    });

    if (!application) {
        res.status(404); throw new Error('Could not find the hired freelancer for this project.');
    }

    // 4. Create Standalone Review Document
    const review = await Review.create({
        projectId,
        clientId,
        rating: Number(rating),
        comment,
        freelancerId: application.applicantId,
        freelancerModelType: application.applicantModelType,
    });

    // 5. UPDATE FREELANCER PROFILE WITH REVIEW
    if (application.applicantModelType === 'Freelancer') {
        const freelancer = await Freelancer.findById(application.applicantId);
        
        if (freelancer) {
            if (!Array.isArray(freelancer.reviews)) {
                freelancer.reviews = [];
            }

            // --- FIX IS HERE: USE PROJECT TITLE INSTEAD OF CLIENT NAME ---
            // This guarantees no "Anonymous" because Project Title is mandatory
            const displayTitle = project.title || "Untitled Project";

            const newReview = {
                name: displayTitle, // <--- Saving Project Title here
                rating: Number(rating),
                comment,
                clientId: req.user._id,
                projectId: projectId,
                createdAt: new Date()
            };

            freelancer.reviews.push(newReview);

            // Recalculate Average Rating
            const totalStars = freelancer.reviews.reduce((acc, item) => item.rating + acc, 0);
            freelancer.rating = totalStars / freelancer.reviews.length;

            await freelancer.save();
        }
    }

    application.isReviewed = true;
    await application.save();

    res.status(201).json(review);
});

// @desc    Get review for a specific project
// @route   GET /api/reviews/project/:projectId
// @access  Private
export const getReviewByProject = asyncHandler(async (req, res) => {
    const review = await Review.findOne({ projectId: req.params.projectId });
    if (review) {
        res.json(review);
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});