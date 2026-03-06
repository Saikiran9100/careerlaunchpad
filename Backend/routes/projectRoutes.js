// // import express from 'express';
// // import {
// //     createProject,
// //     getClientProjects,
// //     getClientProjectById,
// //     getAllOpenProjects,
// //     getProjectById,
// //     applyToProject,
// //     getProjectApplicants,
// //     markProjectFinished
// // } from '../controllers/projectController.js'; // <-- Use .js
// // import { protect, isContributor } from '../middleware/authMiddleware.js'; // <-- Use .js

// // const router = express.Router();

// // // --- Client Routes ---
// // router.post('/', protect, createProject); 
// // router.get('/client', protect, getClientProjects);
// // router.get('/client/:id', protect, getClientProjectById);
// // router.get('/:id/applicants', protect, getProjectApplicants);

// // // --- Freelancer/Student Routes ---
// // router.get('/', protect, getAllOpenProjects);
// // router.get('/:id', protect, getProjectById);
// // router.post('/:id/apply', protect, isContributor, applyToProject);

// // // --- Both Roles Route ---
// // router.put('/:id/finish', protect, markProjectFinished);

// // export default router; // <-- Use export default





// import express from 'express';
// import {
//     createProject,
//     getClientProjects,
//     getClientProjectById,
//     getAllOpenProjects,
//     getProjectById,
//     applyToProject,
//     getProjectApplicants,
//     markProjectFinished,
//     submitProjectWork // <-- Import the new function
// } from '../controllers/projectController.js'; 
// import { protect, isContributor } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // --- Client Routes ---
// router.post('/', protect, createProject); 
// router.get('/client', protect, getClientProjects);
// router.get('/client/:id', protect, getClientProjectById);
// router.get('/:id/applicants', protect, getProjectApplicants);

// // --- Freelancer/Student Routes ---
// router.get('/', protect, getAllOpenProjects);
// router.get('/:id', protect, getProjectById);
// router.post('/:id/apply', protect, isContributor, applyToProject);

// // --- NEW: Project Submission Route ---
// router.put('/:id/submit', protect, isContributor, submitProjectWork);

// // --- Both Roles Route ---
// router.put('/:id/finish', protect, markProjectFinished);

// export default router;




import express from 'express';
import {
    createProject,
    getClientProjects,
    getClientProjectById,
    getAllOpenProjects,
    getProjectById,
    applyToProject,
    getProjectApplicants,
    markProjectFinished,
    submitProjectWork,
    getAIShortlistedApplicants // <--- Import the new function
} from '../controllers/projectController.js'; 
import { protect, isContributor } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Client Routes ---
router.post('/', protect, createProject); 
router.get('/client', protect, getClientProjects);
router.get('/client/:id', protect, getClientProjectById);
router.get('/:id/applicants', protect, getProjectApplicants);

// --- NEW: AI Shortlist Route (Client) ---
router.post('/:id/ai-shortlist', protect, getAIShortlistedApplicants);

// --- Freelancer/Student Routes ---
router.get('/', protect, getAllOpenProjects);
router.get('/:id', protect, getProjectById);
router.post('/:id/apply', protect, isContributor, applyToProject);

// --- Project Submission Route ---
router.put('/:id/submit', protect, isContributor, submitProjectWork);

// --- Both Roles Route ---
router.put('/:id/finish', protect, markProjectFinished);

export default router;