import NGO from '../models/ngo.js';

// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
export const getNgos = async (req, res) => {
  try {
    const ngos = await NGO.find({}).populate('campaigns');
    res.json(ngos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get logged in NGO profile
// @route   GET /api/ngos/me
// @access  Private
export const getNgoProfile = async (req, res) => {
  try {
    // req.ngo.id is attached from the auth middleware
    const ngo = await NGO.findById(req.ngo.id).select('-password').populate('campaigns');
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    res.json(ngo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update NGO profile
// @route   PUT /api/ngos/me
// @access  Private
export const updateNgoProfile = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.ngo.id);

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    // Update fields
    const { name, shortInfo, founded, founder, aim, location, website, achievements, categories } = req.body;
    ngo.name = name || ngo.name;
    ngo.shortInfo = shortInfo || ngo.shortInfo;
    ngo.founded = founded || ngo.founded;
    ngo.founder = founder || ngo.founder;
    ngo.aim = aim || ngo.aim;
    ngo.location = location || ngo.location;
    ngo.website = website || ngo.website;
    ngo.achievements = achievements || ngo.achievements;
    ngo.categories = categories || ngo.categories;

    const updatedNgo = await ngo.save();
    res.json(updatedNgo);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
