import express from 'express';
import {
    addExperience,
    getAllExperiences,
    getExperienceById
} from '../controllers/interviewExperienceController.js'; // <-- Use .js
import { protect, isContributor } from '../middleware/authMiddleware.js'; // <-- Use .js

const router = express.Router();

// GET /api/interviews (Get all)
router.get('/', protect, getAllExperiences);

// POST /api/interviews (Create one)
router.post('/', protect, isContributor, addExperience);

// GET /api/interviews/:id (Get one)
router.get('/:id', protect, getExperienceById);

export default router; // <-- Use export default