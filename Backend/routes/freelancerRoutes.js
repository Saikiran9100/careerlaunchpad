import express from 'express';
import {
    getAppliedProjects,
    getActiveProjects,
    getCompletedProjects,
    getRejectedProjects // <-- 1. IMPORT NEW FUNCTION
} from '../controllers/freelancerController.js';
import { protect, isContributor } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and require a Freelancer or Student role
router.use(protect, isContributor);

router.get('/projects/applied', getAppliedProjects);
router.get('/projects/active', getActiveProjects);
router.get('/projects/completed', getCompletedProjects);

// --- 2. ADD THIS NEW ROUTE ---
// GET /api/freelancer/projects/rejected
router.get('/projects/rejected', getRejectedProjects);
// --- END OF NEW ROUTE ---

export default router;