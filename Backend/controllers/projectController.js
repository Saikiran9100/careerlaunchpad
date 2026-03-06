




// import asyncHandler from 'express-async-handler';
// import Project from '../models/projectModel.js';
// import Client from '../models/clientModel.js';
// import Application from '../models/applicationModel.js';
// import Freelancer from '../models/freelancerModel.js'; // Imported Freelancer Model for profile updates
// import mongoose from 'mongoose';

// // @desc    Create a new project
// // @route   POST /api/projects
// // @access  Private (Client)
// export const createProject = asyncHandler(async (req, res) => {
//     const { title, description, skillsRequired, budget, deadline } = req.body;

//     if (!title || !description || !skillsRequired || !budget) {
//          res.status(400);
//          throw new Error('Please provide all required fields.');
//     }

//     const skillsArray = typeof skillsRequired === 'string' 
//         ? skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill)
//         : (Array.isArray(skillsRequired) ? skillsRequired : []);

//     if (skillsArray.length === 0) {
//          res.status(400);
//          throw new Error('Please provide at least one skill.');
//     }

//     if (req.userType !== 'Client') {
//          res.status(403);
//          throw new Error('Only clients can create projects.');
//     }

//     const projectData = {
//         title, 
//         description, 
//         skillsRequired: skillsArray, 
//         budget: Number(budget),
//         deadline: deadline ? new Date(deadline) : undefined,
//         postedBy: req.user._id, 
//         status: 'open',
//     };

//     const createdProject = await Project.create(projectData);
//     res.status(201).json(createdProject);
// });

// // @desc    Get all projects for the logged-in client
// // @route   GET /api/projects/client
// // @access  Private (Client)
// export const getClientProjects = asyncHandler(async (req, res) => {
//     if (req.userType !== 'Client') {
//          res.status(401);
//          throw new Error('Not authorized as a client.');
//     }
    
//     const projects = await Project.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).lean();

//     // Attach hired application info if relevant
//     for (let project of projects) {
//         if (['in-progress', 'submitted', 'completed'].includes(project.status)) {
//             const application = await Application.findOne({
//                 projectId: project._id, 
//                 status: { $in: ['hired', 'completed'] } 
//             }).lean();
            
//             if (application) project.application = application;
//         }
//     }

//     res.status(200).json(projects);
// });

// // @desc    Get a single project by ID (for the client who posted it)
// // @route   GET /api/projects/client/:id
// // @access  Private (Client)
// export const getClientProjectById = asyncHandler(async (req, res) => {
//      if (req.userType !== 'Client') {
//          res.status(401);
//          throw new Error('Not authorized as a client.');
//     }

//     const project = await Project.findOne({ _id: req.params.id, postedBy: req.user._id });

//     if (!project) {
//         res.status(404);
//         throw new Error('Project not found or you do not have permission.');
//     }
//     res.status(200).json(project);
// });

// // @desc    Get all 'open' projects (for freelancers/students)
// // @route   GET /api/projects
// // @access  Private (Logged-in users)
// export const getAllOpenProjects = asyncHandler(async (req, res) => {
//     if (!req.user) {
//          res.status(401);
//          throw new Error('Not authorized.');
//     }
//     const projects = await Project.find({ status: 'open' })
//         .populate('postedBy', 'firstName lastName companyName')
//         .sort({ createdAt: -1 });
    
//     res.status(200).json(projects);
// });

// // @desc    Get a single project by ID (for freelancers/students)
// // @route   GET /api/projects/:id
// // @access  Private (Logged-in users)
// export const getProjectById = asyncHandler(async (req, res) => {
//      if (!req.user) {
//          res.status(401);
//          throw new Error('Not authorized.');
//     }

//     const project = await Project.findById(req.params.id).populate('postedBy', 'firstName lastName companyName');
    
//     if (!project) {
//         res.status(404);
//         throw new Error('Project not found.');
//     }

//     let hasApplied = false;
//     if (req.userType === 'Freelancer' || req.userType === 'Student') {
//         const existingApplication = await Application.findOne({
//             projectId: project._id, applicantId: req.user._id,
//         });
//         if (existingApplication) hasApplied = true;
//     }

//     res.status(200).json({ project: project, hasApplied: hasApplied });
// });

// // @desc    Apply to a project
// // @route   POST /api/projects/:id/apply
// // @access  Private (Freelancer/Student)
// export const applyToProject = asyncHandler(async (req, res) => {
//     const projectId = req.params.id;
//     const applicantId = req.user._id;
//     const applicantModelType = req.userType;

//     if (applicantModelType !== 'Freelancer' && applicantModelType !== 'Student') {
//          res.status(403);
//          throw new Error('Only freelancers or students can apply.');
//     }

//     const project = await Project.findById(projectId);
//     if (!project) {
//         res.status(404);
//         throw new Error('Project not found.');
//     }
//     if (project.status !== 'open') {
//          res.status(400);
//          throw new Error('Project is no longer open for applications.');
//     }

//     const existingApplication = await Application.findOne({ projectId, applicantId });
//     if (existingApplication) {
//         res.status(400);
//         throw new Error('You have already applied to this project.');
//     }

//     const application = await Application.create({
//         projectId, 
//         applicantId, 
//         applicantModelType,
//         clientId: project.postedBy, 
//         status: 'applied',
//     });

//     res.status(201).json({ message: 'Application submitted successfully', application });
// });

// // @desc    Get all applicants for a specific project
// // @route   GET /api/projects/:id/applicants
// // @access  Private (Client only)
// export const getProjectApplicants = asyncHandler(async (req, res) => {
//     const projectId = req.params.id;
//     const clientId = req.user._id;
//     const clientModelType = req.userType;

//     if (clientModelType !== 'Client') {
//          res.status(403);
//          throw new Error('Only clients can view applicants.');
//     }

//     const project = await Project.findById(projectId);
//     if (!project) {
//         res.status(404); throw new Error('Project not found.');
//     }
    
//     if (project.postedBy.toString() !== clientId.toString()) {
//         res.status(403);
//         throw new Error('You are not authorized to view applicants.');
//     }

//     const applications = await Application.find({ projectId: projectId })
//         .populate({
//             path: 'applicantId',
//             select: 'firstName lastName email mobile collegeName campus skills',
//         });

//     res.status(200).json({
//         projectTitle: project.title,
//         applications: applications, 
//     });
// });

// // @desc    Submit project work (Freelancer/Student)
// // @route   PUT /api/projects/:id/submit
// // @access  Private (Assigned Freelancer/Student)
// export const submitProjectWork = asyncHandler(async (req, res) => {
//     const { repoLink, liveLink, videoLink, description } = req.body;
//     const projectId = req.params.id;
//     const userId = req.user._id;

//     // Validate inputs (at least description or one link required)
//     if (!repoLink && !liveLink && !description) {
//         res.status(400);
//         throw new Error('Please provide at least a repository link, live link, or description.');
//     }

//     const project = await Project.findById(projectId);
//     if (!project) {
//         res.status(404);
//         throw new Error('Project not found');
//     }

//     // Verify the user is the one hired for this project
//     const application = await Application.findOne({
//         projectId: projectId, 
//         applicantId: userId, 
//         status: { $in: ['hired', 'completed'] } 
//     });

//     if (!application) {
//         res.status(403);
//         throw new Error('You are not the hired freelancer for this project.');
//     }

//     // Update Project Model with Submission Data
//     project.submission = {
//         repoLink,
//         liveLink,
//         videoLink,
//         description,
//         submittedAt: Date.now()
//     };
    
//     // Update status to 'submitted' so client sees it
//     project.status = 'submitted'; 
    
//     await project.save();

//     res.status(200).json({ message: 'Project submitted successfully', project });
// });

// // @desc    Mark a project as finished
// // @route   PUT /api/projects/:id/finish
// // @access  Private
// export const markProjectFinished = asyncHandler(async (req, res) => {
//     const projectId = req.params.id;
//     const userId = req.user._id;
//     const userType = req.userType;

//     const project = await Project.findById(projectId);
//     if (!project) {
//         res.status(404); throw new Error('Project not found.');
//     }
    
//     const application = await Application.findOne({
//         projectId: projectId, 
//         status: 'hired', 
//     });
    
//     if (!application) {
//         res.status(404);
//         throw new Error('No active application found for this project.');
//     }

//     // 1. Update Application Flags based on who clicked "Finish"
//     if (userType === 'Client') {
//         if (project.postedBy.toString() !== userId.toString()) {
//             res.status(403); throw new Error('Not authorized.');
//         }
//         application.clientMarkedComplete = true;
//     } else if (userType === 'Freelancer' || userType === 'Student') {
//         if (application.applicantId.toString() !== userId.toString()) {
//             res.status(403);
//             throw new Error('Not authorized.');
//         }
//         application.freelancerMarkedComplete = true;
//     } else {
//          res.status(403); throw new Error('User role cannot finish project.');
//     }

//     // 2. Check if BOTH have marked complete -> Update Status and Profile
//     if (application.clientMarkedComplete && application.freelancerMarkedComplete) {
//         application.status = 'completed';
//         project.status = 'completed';
        
//         // --- NEW LOGIC START: Update Freelancer Work History ---
//         if (application.applicantModelType === 'Freelancer') {
//             const freelancer = await Freelancer.findById(application.applicantId);
//             const client = await Client.findById(project.postedBy); // Fetch client for Company Name

//             if (freelancer) {
//                 // Prepare the Work History Object
//                 const workHistoryItem = {
//                     projectTitle: project.title,
//                     companyName: client.companyName || `${client.firstName} ${client.lastName}`, // Use Company Name if available
//                     repoLink: project.submission?.repoLink || '',
//                     liveLink: project.submission?.liveLink || '',
//                     description: project.submission?.description || project.description, // Use submission description (overview)
//                     completedAt: Date.now()
//                 };

//                 // Add to workHistory array
//                 freelancer.workHistory.push(workHistoryItem);
                
//                 // Increment completed count
//                 freelancer.completedProjects = (freelancer.completedProjects || 0) + 1;

//                 await freelancer.save();
//             }
//         }
//         // --- NEW LOGIC END ---

//         await project.save();
//     }

//     await application.save();
//     res.status(200).json(application);
// });






import asyncHandler from 'express-async-handler';
import Project from '../models/projectModel.js';
import Client from '../models/clientModel.js';
import Application from '../models/applicationModel.js';
import Freelancer from '../models/freelancerModel.js'; 
import mongoose from 'mongoose';
import { rankApplicants } from '../utils/geminiService.js'; // <--- NEW IMPORT

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Client)
export const createProject = asyncHandler(async (req, res) => {
    const { title, description, skillsRequired, budget, deadline } = req.body;

    if (!title || !description || !skillsRequired || !budget) {
         res.status(400);
         throw new Error('Please provide all required fields.');
    }

    const skillsArray = typeof skillsRequired === 'string' 
        ? skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill)
        : (Array.isArray(skillsRequired) ? skillsRequired : []);

    if (skillsArray.length === 0) {
         res.status(400);
         throw new Error('Please provide at least one skill.');
    }

    if (req.userType !== 'Client') {
         res.status(403);
         throw new Error('Only clients can create projects.');
    }

    const projectData = {
        title, 
        description, 
        skillsRequired: skillsArray, 
        budget: Number(budget),
        deadline: deadline ? new Date(deadline) : undefined,
        postedBy: req.user._id, 
        status: 'open',
    };

    const createdProject = await Project.create(projectData);
    res.status(201).json(createdProject);
});

// @desc    Get all projects for the logged-in client
// @route   GET /api/projects/client
// @access  Private (Client)
export const getClientProjects = asyncHandler(async (req, res) => {
    if (req.userType !== 'Client') {
         res.status(401);
         throw new Error('Not authorized as a client.');
    }
    
    const projects = await Project.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).lean();

    // Attach hired application info if relevant
    for (let project of projects) {
        if (['in-progress', 'submitted', 'completed'].includes(project.status)) {
            const application = await Application.findOne({
                projectId: project._id, 
                status: { $in: ['hired', 'completed'] } 
            }).lean();
            
            if (application) project.application = application;
        }
    }

    res.status(200).json(projects);
});

// @desc    Get a single project by ID (for the client who posted it)
// @route   GET /api/projects/client/:id
// @access  Private (Client)
export const getClientProjectById = asyncHandler(async (req, res) => {
     if (req.userType !== 'Client') {
         res.status(401);
         throw new Error('Not authorized as a client.');
    }

    const project = await Project.findOne({ _id: req.params.id, postedBy: req.user._id });

    if (!project) {
        res.status(404);
        throw new Error('Project not found or you do not have permission.');
    }
    res.status(200).json(project);
});

// @desc    Get all 'open' projects (for freelancers/students)
// @route   GET /api/projects
// @access  Private (Logged-in users)
export const getAllOpenProjects = asyncHandler(async (req, res) => {
    if (!req.user) {
         res.status(401);
         throw new Error('Not authorized.');
    }
    const projects = await Project.find({ status: 'open' })
        .populate('postedBy', 'firstName lastName companyName')
        .sort({ createdAt: -1 });
    
    res.status(200).json(projects);
});

// @desc    Get a single project by ID (for freelancers/students)
// @route   GET /api/projects/:id
// @access  Private (Logged-in users)
export const getProjectById = asyncHandler(async (req, res) => {
     if (!req.user) {
         res.status(401);
         throw new Error('Not authorized.');
    }

    const project = await Project.findById(req.params.id).populate('postedBy', 'firstName lastName companyName');
    
    if (!project) {
        res.status(404);
        throw new Error('Project not found.');
    }

    let hasApplied = false;
    if (req.userType === 'Freelancer' || req.userType === 'Student') {
        const existingApplication = await Application.findOne({
            projectId: project._id, applicantId: req.user._id,
        });
        if (existingApplication) hasApplied = true;
    }

    res.status(200).json({ project: project, hasApplied: hasApplied });
});

// @desc    Apply to a project
// @route   POST /api/projects/:id/apply
// @access  Private (Freelancer/Student)
export const applyToProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const applicantId = req.user._id;
    const applicantModelType = req.userType;

    if (applicantModelType !== 'Freelancer' && applicantModelType !== 'Student') {
         res.status(403);
         throw new Error('Only freelancers or students can apply.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error('Project not found.');
    }
    if (project.status !== 'open') {
         res.status(400);
         throw new Error('Project is no longer open for applications.');
    }

    const existingApplication = await Application.findOne({ projectId, applicantId });
    if (existingApplication) {
        res.status(400);
        throw new Error('You have already applied to this project.');
    }

    const application = await Application.create({
        projectId, 
        applicantId, 
        applicantModelType,
        clientId: project.postedBy, 
        status: 'applied',
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
});

// @desc    Get all applicants for a specific project
// @route   GET /api/projects/:id/applicants
// @access  Private (Client only)
export const getProjectApplicants = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const clientId = req.user._id;
    const clientModelType = req.userType;

    if (clientModelType !== 'Client') {
         res.status(403);
         throw new Error('Only clients can view applicants.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404); throw new Error('Project not found.');
    }
    
    if (project.postedBy.toString() !== clientId.toString()) {
        res.status(403);
        throw new Error('You are not authorized to view applicants.');
    }

    const applications = await Application.find({ projectId: projectId })
        .populate({
            path: 'applicantId',
            select: 'firstName lastName email mobile collegeName campus skills',
        });

    res.status(200).json({
        projectTitle: project.title,
        applications: applications, 
    });
});

// @desc    Submit project work (Freelancer/Student)
// @route   PUT /api/projects/:id/submit
// @access  Private (Assigned Freelancer/Student)
export const submitProjectWork = asyncHandler(async (req, res) => {
    const { repoLink, liveLink, videoLink, description } = req.body;
    const projectId = req.params.id;
    const userId = req.user._id;

    // Validate inputs (at least description or one link required)
    if (!repoLink && !liveLink && !description) {
        res.status(400);
        throw new Error('Please provide at least a repository link, live link, or description.');
    }

    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Verify the user is the one hired for this project
    const application = await Application.findOne({
        projectId: projectId, 
        applicantId: userId, 
        status: { $in: ['hired', 'completed'] } 
    });

    if (!application) {
        res.status(403);
        throw new Error('You are not the hired freelancer for this project.');
    }

    // Update Project Model with Submission Data
    project.submission = {
        repoLink,
        liveLink,
        videoLink,
        description,
        submittedAt: Date.now()
    };
    
    // Update status to 'submitted' so client sees it
    project.status = 'submitted'; 
    
    await project.save();

    res.status(200).json({ message: 'Project submitted successfully', project });
});

// @desc    Mark a project as finished
// @route   PUT /api/projects/:id/finish
// @access  Private
export const markProjectFinished = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user._id;
    const userType = req.userType;

    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404); throw new Error('Project not found.');
    }
    
    const application = await Application.findOne({
        projectId: projectId, 
        status: 'hired', 
    });
    
    if (!application) {
        res.status(404);
        throw new Error('No active application found for this project.');
    }

    // 1. Update Application Flags based on who clicked "Finish"
    if (userType === 'Client') {
        if (project.postedBy.toString() !== userId.toString()) {
            res.status(403); throw new Error('Not authorized.');
        }
        application.clientMarkedComplete = true;
    } else if (userType === 'Freelancer' || userType === 'Student') {
        if (application.applicantId.toString() !== userId.toString()) {
            res.status(403);
            throw new Error('Not authorized.');
        }
        application.freelancerMarkedComplete = true;
    } else {
         res.status(403); throw new Error('User role cannot finish project.');
    }

    // 2. Check if BOTH have marked complete -> Update Status and Profile
    if (application.clientMarkedComplete && application.freelancerMarkedComplete) {
        application.status = 'completed';
        project.status = 'completed';
        
        // --- Update Freelancer Work History ---
        if (application.applicantModelType === 'Freelancer') {
            const freelancer = await Freelancer.findById(application.applicantId);
            const client = await Client.findById(project.postedBy); // Fetch client for Company Name

            if (freelancer) {
                // Prepare the Work History Object
                const workHistoryItem = {
                    projectTitle: project.title,
                    companyName: client.companyName || `${client.firstName} ${client.lastName}`, // Use Company Name if available
                    repoLink: project.submission?.repoLink || '',
                    liveLink: project.submission?.liveLink || '',
                    description: project.submission?.description || project.description, // Use submission description (overview)
                    completedAt: Date.now()
                };

                // Add to workHistory array
                freelancer.workHistory.push(workHistoryItem);
                
                // Increment completed count
                freelancer.completedProjects = (freelancer.completedProjects || 0) + 1;

                await freelancer.save();
            }
        }

        await project.save();
    }

    await application.save();
    res.status(200).json(application);
});

// --- NEW FUNCTION: AI Shortlisting ---
// @desc    Get AI Shortlisted Applicants
// @route   POST /api/projects/:id/ai-shortlist
// @access  Private (Client)
export const getAIShortlistedApplicants = asyncHandler(async (req, res) => {
    const projectId = req.params.id;

    // 1. Fetch Project Details
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404); throw new Error('Project not found');
    }

    // 2. Fetch All "Applied" Applications
    // We populate the applicantId with fields the AI needs (skills, rating, etc.)
    const applications = await Application.find({ 
        projectId: projectId, 
        status: 'applied' 
    }).populate({
        path: 'applicantId',
        select: 'firstName lastName title skills bio rating completedProjects experience'
    });

    // Validations
    if (applications.length === 0) {
        res.status(400); throw new Error('No applicants to shortlist.');
    }

    // 3. Call our Gemini Service
    // The rankApplicants function handles the "Top 5" vs "2:3" logic internally
    const aiResults = await rankApplicants(project, applications);

    // 4. Merge AI Data with Full Application Objects
    // This ensures the frontend gets the full profile data + the new AI reason/score
    const shortlistedApps = aiResults.map(rankItem => {
        const originalApp = applications.find(
            app => app.applicantId._id.toString() === rankItem.id
        );

        if (originalApp) {
            // Return a new object combining the DB data and AI data
            return {
                ...originalApp.toObject(),
                aiReason: rankItem.reason,
                aiMatchScore: rankItem.matchScore
            };
        }
        return null;
    }).filter(item => item !== null);

    // 5. Send the sorted shortlist back to frontend
    res.status(200).json(shortlistedApps);
});