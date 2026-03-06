// import express from 'express';
// import { getAllJobs, getJobById } from '../controllers/jobController.js';

// const router = express.Router();

// router.get('/', getAllJobs);
// router.get('/:id', getJobById);

// export default router;

import express from 'express';
import { getAllJobs, getJobById, getProfileMatchedJobs } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js'; // Ensure the path to your auth middleware is correct

const router = express.Router();

// Public route to get all generic jobs
router.get('/', getAllJobs);

// PRIVATE route for AI Job Aggregator
// IMPORTANT: This must be placed BEFORE the '/:id' route!
router.get('/match-profile', protect, getProfileMatchedJobs);

// Public route to get a single job by its ID
router.get('/:id', getJobById);

export default router;