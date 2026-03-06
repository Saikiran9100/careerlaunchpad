import express from 'express';
import {
    registerFreelancer,
    loginFreelancer
} from '../controllers/freelancerAuthController.js'; // <-- Use .js

const router = express.Router();

router.post('/register', registerFreelancer);
router.post('/login', loginFreelancer);

export default router; // <-- Use export default