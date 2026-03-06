import express from 'express';
import { protect, isClient } from '../middleware/authMiddleware.js'; 
import { 
    getClientProfile, 
    updateClientProfile 
} from '../controllers/clientProfileController.js';

const router = express.Router();

// The route is '/api/client/profile/me'
// We use .route() to handle both GET and PUT on the same URL
router.route('/me')
    .get(protect, isClient, getClientProfile)   // Fetch
    .put(protect, isClient, updateClientProfile); // Update

export default router;