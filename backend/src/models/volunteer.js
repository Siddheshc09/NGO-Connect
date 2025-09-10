import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  companyOrCollege: {
    type: String,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  registeredCampaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }]
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;