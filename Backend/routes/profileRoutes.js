import express from 'express';
import {
    getMyProfile,
    updateMyProfile,
    getProfileById
} from '../controllers/profileController.js'; // <-- Use .js
import { protect } from '../middleware/authMiddleware.js'; // <-- Use .js

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/:id', protect, getProfileById);

export default router; // <-- U