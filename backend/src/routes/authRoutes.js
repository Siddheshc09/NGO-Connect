import express from 'express';
const router = express.Router();
import { signup, login, ngoSignup, ngoLogin } from '../controllers/authController.js';

// Volunteer routes
router.post('/signup', signup);
router.post('/login', login);

// NGO routes
router.post('/ngo/signup', ngoSignup);
router.post('/ngo/login', ngoLogin);


export default router;
