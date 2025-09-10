import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    trim: true
  },
  shortInfo: {
    type: String,
    required: true,
    trim: true
  },
  founded: {
    type: String,
    required: true,
    trim: true
  },
  founder: {
    type: String,
    required: true,
    trim: true
  },
  aim: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  achievements: [{
    type: String
  }],
  categories: [{
    type: String
  }],
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }]
}, { timestamps: true });

// Hash password before saving
ngoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const NGO = mongoose.model('NGO', ngoSchema);

export default NGO;

