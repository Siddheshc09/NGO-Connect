import express from 'express';
import { getCampaigns, registerForCampaign, createCampaign, updateCampaign, getNgoCampaigns } from '../controllers/campaignController.js';
import { protect, protectNgo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCampaigns);
router.post('/:id/register', protect, registerForCampaign);

// NGO specific routes
router.get('/my-campaigns', protectNgo, getNgoCampaigns);
router.post('/', protectNgo, createCampaign);
router.put('/:id', protectNgo, updateCampaign);


export default router;
