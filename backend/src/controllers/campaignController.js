import Campaign from '../models/campaign.js';
import Volunteer from '../models/volunteer.js';
import NGO from '../models/ngo.js';

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).populate('ngo', 'name');
    res.json(campaigns);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Register for a campaign
// @route   POST /api/campaigns/:id/register
// @access  Private (Volunteers)
export const registerForCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    const volunteer = await Volunteer.findById(req.volunteer.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if already registered
    if (campaign.registeredVolunteers.includes(req.volunteer.id)) {
      return res.status(400).json({ message: 'You are already registered for this campaign' });
    }

    campaign.registeredVolunteers.push(req.volunteer.id);
    volunteer.registeredCampaigns.push(campaign.id);

    await campaign.save();
    await volunteer.save();

    res.json({ message: 'Successfully registered for the campaign' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get campaigns for a specific NGO
// @route   GET /api/campaigns/my-campaigns
// @access  Private (NGOs)
export const getNgoCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ ngo: req.ngo.id });
        res.json(campaigns);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Create a campaign
// @route   POST /api/campaigns
// @access  Private (NGOs)
export const createCampaign = async (req, res) => {
    try {
        const { title, date, location, description, fullDescription, category, timeRequired } = req.body;
        const ngoId = req.ngo.id;

        const newCampaign = new Campaign({
            title,
            ngo: ngoId,
            date,
            location,
            description,
            fullDescription,
            category,
            timeRequired
        });

        const campaign = await newCampaign.save();

        // Add campaign to NGO's list of campaigns
        await NGO.findByIdAndUpdate(ngoId, { $push: { campaigns: campaign._id } });

        res.status(201).json(campaign);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
// @access  Private (NGOs)
export const updateCampaign = async (req, res) => {
    try {
        let campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Ensure the NGO owns the campaign
        if (campaign.ngo.toString() !== req.ngo.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title, date, location, description, fullDescription, category, timeRequired } = req.body;

        campaign.title = title || campaign.title;
        campaign.date = date || campaign.date;
        campaign.location = location || campaign.location;
        campaign.description = description || campaign.description;
        campaign.fullDescription = fullDescription || campaign.fullDescription;
        campaign.category = category || campaign.category;
        campaign.timeRequired = timeRequired || campaign.timeRequired;

        const updatedCampaign = await campaign.save();
        res.json(updatedCampaign);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

