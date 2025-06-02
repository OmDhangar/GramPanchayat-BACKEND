import mongoose from "mongoose";

const birthCertificateSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
  },
  
  // Form Fields
  childName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  placeOfBirth: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  // Add these new fields
  motherAdharNumber: {
    type: String,
    trim: true
  },
  fatherAdharNumber: {
    type: String,
    trim: true
  },
  parentsAddressAtBirth: {
    type: String,
    required: true,
    trim: true
  },
  permanentAddressParent: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  fatherOccupation: {
    type: String,
    trim: true
  },
  motherOccupation: {
    type: String,
    trim: true
  },
  hospitalName: {
    type: String,
    trim: true
  },
  
  // Payment Amount
  paymentAmount: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

export const BirthCertificate = mongoose.model("BirthCertificate", birthCertificateSchema);