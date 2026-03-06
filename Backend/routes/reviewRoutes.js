// // import express from 'express';
// // import { createReview } from '../controllers/reviewController.js'; // <-- Use .js
// // import { protect } from '../middleware/authMiddleware.js'; // <-- Use .js

// // const router = express.Router();

// // // POST /api/reviews
// // router.post('/', protect, createReview); // The controller will check if the user is a Client

// // export default router; // <-- Use ex



// import express from 'express';
// import { createReview } from '../controllers/reviewController.js';
// import { protect, isClient } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/', protect, isClient, createReview);

// export default router;



import express from 'express';
import { createReview, getReviewByProject } from '../controllers/reviewController.js';
import { protect, isClient } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isClient, createReview);

// New Route for Freelancer Dashboard
router.get('/project/:projectId', protect, getReviewByProject);

export default router;