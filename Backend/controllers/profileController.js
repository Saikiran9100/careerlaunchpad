

// import asyncHandler from 'express-async-handler';
// import Freelancer from '../models/freelancerModel.js';
// import Student from '../models/studentModel.js';
// import Review from '../models/reviewModel.js';
// import Application from '../models/applicationModel.js';
// import Project from '../models/projectModel.js'; // Ensure Project model is imported
// import mongoose from 'mongoose';

// const getModelByUserType = (userType) => {
//     if (userType === 'Freelancer') return Freelancer;
//     if (userType === 'Student') return Student;
//     return null;
// };

// // @desc    Get the logged-in user's own profile
// export const getMyProfile = asyncHandler(async (req, res) => {
//     const Model = getModelByUserType(req.userType);
//     if (!Model) {
//         res.status(400); throw new Error('Invalid user type');
//     }
//     const profile = await Model.findById(req.user._id).select('-password');
//     if (!profile) {
//         res.status(404); throw new Error('Profile not found');
//     }

//     // --- FIX: Populate 'projectId' to get the real title ---
//     const reviews = await Review.find({ freelancerId: req.user._id })
//         .populate('projectId', 'title') // Look up the Project Title
//         .sort({ createdAt: -1 });

//     // Calculate Completed Projects
//     const completedApps = await Application.find({ applicantId: req.user._id, status: 'completed' });
    
//     const profileObject = profile.toObject();
    
//     // --- MAP REVIEWS: Replace name with Project Title ---
//     profileObject.reviews = reviews.map(review => {
//         const r = review.toObject();
//         // If projectId exists and has a title, use it. Otherwise keep existing name.
//         if (review.projectId && review.projectId.title) {
//             r.name = review.projectId.title; 
//         } else {
//             r.name = r.name || "Untitled Project";
//         }
//         return r;
//     });

//     profileObject.completedProjects = completedApps.length || 0;
    
//     if (reviews.length > 0) {
//         const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
//         profileObject.rating = Math.round(avgRating * 10) / 10;
//     } else {
//         profileObject.rating = 0;
//     }
//     res.json(profileObject);
// });

// // @desc    Update the logged-in user's own profile
// export const updateMyProfile = asyncHandler(async (req, res) => {
//     const Model = getModelByUserType(req.userType);
//     if (!Model) {
//         res.status(400); throw new Error('Invalid user type');
//     }
//     const profile = await Model.findById(req.user._id);
//     if (!profile) {
//         res.status(404); throw new Error('Profile not found');
//     }
//     const {
//         profileImage, title, bio, rate, location, availability, age, gender,
//         skills, education, experience, projects
//     } = req.body;

//     profile.profileImage = profileImage || profile.profileImage;
//     profile.title = title;
//     profile.bio = bio;
//     profile.rate = rate;
//     profile.location = location;
//     profile.availability = availability;
//     profile.age = age;
//     profile.gender = gender;
//     profile.skills = skills || [];
//     profile.education = education || [];
//     profile.experience = experience || [];
//     profile.projects = projects || []; // Note: Manual projects, not work history

//     const updatedProfile = await profile.save();
//     const profileObject = updatedProfile.toObject();
//     delete profileObject.password;
//     res.json(profileObject);
// });

// // @desc    Get any user's profile by their ID
// export const getProfileById = asyncHandler(async (req, res) => {
//     const userId = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//          res.status(400); throw new Error('Invalid user ID');
//     }
//     let profile = await Freelancer.findById(userId).select('-password');
//     if (!profile) {
//          profile = await Student.findById(userId).select('-password');
//     }
//     if (!profile) {
//         res.status(404); throw new Error('Profile not found');
//     }

//     // --- FIX: Populate 'projectId' to get the real title ---
//     const reviews = await Review.find({ freelancerId: userId })
//         .populate('projectId', 'title') // Look up the Project Title
//         .sort({ createdAt: -1 });

//     const completedApps = await Application.find({ applicantId: userId, status: 'completed' });
    
//     const profileObject = profile.toObject();

//     // --- MAP REVIEWS: Replace name with Project Title ---
//     profileObject.reviews = reviews.map(review => {
//         const r = review.toObject();
//         if (review.projectId && review.projectId.title) {
//             r.name = review.projectId.title;
//         } else {
//             r.name = r.name || "Untitled Project";
//         }
//         return r;
//     });

//     profileObject.completedProjects = completedApps.length || 0;
    
//     if (reviews.length > 0) {
//         const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
//         profileObject.rating = Math.round(avgRating * 10) / 10;
//     } else {
//         profileObject.rating = 0;
//     }
//     res.json(profileObject);
// });





import asyncHandler from 'express-async-handler';
import Freelancer from '../models/freelancerModel.js';
import Student from '../models/studentModel.js';
import Review from '../models/reviewModel.js';
import Application from '../models/applicationModel.js';
import Project from '../models/projectModel.js'; // Ensure Project model is imported
import mongoose from 'mongoose';

const getModelByUserType = (userType) => {
    if (userType === 'Freelancer') return Freelancer;
    if (userType === 'Student') return Student;
    return null;
};

// @desc    Get the logged-in user's own profile
export const getMyProfile = asyncHandler(async (req, res) => {
    const Model = getModelByUserType(req.userType);
    if (!Model) {
        res.status(400); throw new Error('Invalid user type');
    }
    const profile = await Model.findById(req.user._id).select('-password');
    if (!profile) {
        res.status(404); throw new Error('Profile not found');
    }

    // --- FIX: Populate 'projectId' to get the real title ---
    const reviews = await Review.find({ freelancerId: req.user._id })
        .populate('projectId', 'title') // Look up the Project Title
        .sort({ createdAt: -1 });

    // Calculate Completed Projects
    const completedApps = await Application.find({ applicantId: req.user._id, status: 'completed' });
    
    const profileObject = profile.toObject();
    
    // --- MAP REVIEWS: Replace name with Project Title ---
    profileObject.reviews = reviews.map(review => {
        const r = review.toObject();
        // If projectId exists and has a title, use it. Otherwise keep existing name.
        if (review.projectId && review.projectId.title) {
            r.name = review.projectId.title; 
        } else {
            r.name = r.name || "Untitled Project";
        }
        return r;
    });

    profileObject.completedProjects = completedApps.length || 0;
    
    if (reviews.length > 0) {
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        profileObject.rating = Math.round(avgRating * 10) / 10;
    } else {
        profileObject.rating = 0;
    }
    res.json(profileObject);
});

// @desc    Update the logged-in user's own profile
export const updateMyProfile = asyncHandler(async (req, res) => {
    const Model = getModelByUserType(req.userType);
    if (!Model) {
        res.status(400); throw new Error('Invalid user type');
    }
    const profile = await Model.findById(req.user._id);
    if (!profile) {
        res.status(404); throw new Error('Profile not found');
    }
    
    const {
        profileImage, title, bio, rate, location, availability, age, gender,
        skills, education, experience, projects
    } = req.body;

    profile.profileImage = profileImage || profile.profileImage;
    profile.title = title !== undefined ? title : profile.title;
    profile.bio = bio !== undefined ? bio : profile.bio;
    profile.rate = rate !== undefined ? rate : profile.rate;
    profile.location = location !== undefined ? location : profile.location;
    profile.availability = availability !== undefined ? availability : profile.availability;
    profile.age = age !== undefined ? age : profile.age;
    profile.gender = gender !== undefined ? gender : profile.gender;
    
    // --- THE FIX: Safely update skills array so it doesn't wipe out ---
    profile.skills = skills !== undefined ? skills : profile.skills;
    
    profile.education = education !== undefined ? education : profile.education;
    profile.experience = experience !== undefined ? experience : profile.experience;
    profile.projects = projects !== undefined ? projects : profile.projects; 

    const updatedProfile = await profile.save();
    const profileObject = updatedProfile.toObject();
    delete profileObject.password;
    
    res.json(profileObject);
});

// @desc    Get any user's profile by their ID
export const getProfileById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
         res.status(400); throw new Error('Invalid user ID');
    }
    let profile = await Freelancer.findById(userId).select('-password');
    if (!profile) {
         profile = await Student.findById(userId).select('-password');
    }
    if (!profile) {
        res.status(404); throw new Error('Profile not found');
    }

    // --- FIX: Populate 'projectId' to get the real title ---
    const reviews = await Review.find({ freelancerId: userId })
        .populate('projectId', 'title') // Look up the Project Title
        .sort({ createdAt: -1 });

    const completedApps = await Application.find({ applicantId: userId, status: 'completed' });
    
    const profileObject = profile.toObject();

    // --- MAP REVIEWS: Replace name with Project Title ---
    profileObject.reviews = reviews.map(review => {
        const r = review.toObject();
        if (review.projectId && review.projectId.title) {
            r.name = review.projectId.title;
        } else {
            r.name = r.name || "Untitled Project";
        }
        return r;
    });

    profileObject.completedProjects = completedApps.length || 0;
    
    if (reviews.length > 0) {
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        profileObject.rating = Math.round(avgRating * 10) / 10;
    } else {
        profileObject.rating = 0;
    }
    res.json(profileObject);
});