import express from 'express';
import { updateApplicationStatus } from '../controllers/applicationController.js'; // <-- Use .js
import { protect } from '../middleware/authMiddleware.js'; // <-- Use .js

const router = express.Router();

router.put('/:id/status', protect, updateApplicationStatus);

export default router; // <-- Use export default