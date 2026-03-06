import express from 'express';
import {
    registerClient,
    loginClient
} from '../controllers/clientAuthController.js'; // <-- Use .js

const router = express.Router();

router.post('/register', registerClient);
router.post('/login', loginClient);

export default router; // <-- Use export default

