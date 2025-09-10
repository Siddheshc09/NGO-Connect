import Volunteer from '../models/volunteer.js';
import NGO from '../models/ngo.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new volunteer
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const { fullName, email, password, age, dateOfBirth, companyOrCollege, mobileNumber } = req.body;

  try {
    // Check if a volunteer with the same email already exists
    let volunteer = await Volunteer.findOne({ email });

    if (volunteer) {
      return res.status(400).json({ message: 'A volunteer with this email already exists' });
    }

    // Create a new volunteer instance (password will be hashed by pre-save hook)
    volunteer = new Volunteer({
      fullName,
      email,
      password,
      age,
      dateOfBirth,
      companyOrCollege,
      mobileNumber
    });

    // Save the new volunteer to the database
    await volunteer.save();

    // Create a payload for the JWT
    const payload = {
      volunteer: {
        id: volunteer.id
      }
    };

    // Sign the JWT and send it back to the client
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          volunteer: {
            id: volunteer.id,
            fullName: volunteer.fullName,
            email: volunteer.email
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate volunteer and get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the volunteer exists
    let volunteer = await Volunteer.findOne({ email });

    if (!volunteer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, volunteer.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a payload for the JWT
    const payload = {
      volunteer: {
        id: volunteer.id
      }
    };
    // Sign the JWT and send it back to the client
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          volunteer: {
            id: volunteer.id,
            fullName: volunteer.fullName,
            email: volunteer.email
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Register a new NGO
// @route   POST /api/auth/ngo/signup
// @access  Public
export const ngoSignup = async (req, res) => {
  const { name, email, password, shortInfo, founded, founder, aim, location, website, achievements, categories } = req.body;

  try {
    let ngo = await NGO.findOne({ email });
    if (ngo) {
      return res.status(400).json({ message: 'NGO with this email already exists' });
    }

    ngo = new NGO({
      name,
      email,
      password,
      shortInfo,
      founded,
      founder,
      aim,
      location,
      website,
      achievements,
      categories
    });

    await ngo.save();

    const payload = {
      ngo: {
        id: ngo.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          ngo: {
            id: ngo.id,
            name: ngo.name,
            email: ngo.email
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate NGO & get token
// @route   POST /api/auth/ngo/login
// @access  Public
export const ngoLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      ngo: {
        id: ngo.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          ngo: {
            id: ngo.id,
            name: ngo.name,
            email: ngo.email
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

