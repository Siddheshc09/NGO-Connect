import express from 'express';
import { getNgos, getNgoProfile, updateNgoProfile } from '../controllers/ngoController.js';
import { protectNgo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getNgos);
router.get('/me', protectNgo, getNgoProfile);
router.put('/me', protectNgo, updateNgoProfile);

export default router;
