import express from 'express';
import { protect, isContributor } from '../middleware/authMiddleware.js'; 
import { 
    getStudentProfile, 
    updateStudentProfile 
} from '../controllers/studentProfileController.js';

const router = express.Router();

// Using 'isContributor' because students are contributors (or you can create isStudent)
router.route('/me')
    .get(protect, getStudentProfile)
    .put(protect, updateStudentProfile);

export default router;