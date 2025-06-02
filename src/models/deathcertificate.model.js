import mongoose from "mongoose";

const deathCertificateSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
  },
  
  // Form Fields
  deceasedName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfDeath: {
    type: Date,
    required: true
  },
  placeOfDeath: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  causeOfDeath: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  spouseName: {
    type: String,
    trim: true
  },
  // Add these new fields
  spouseAdhar: {
    type: String,
    trim: true
  },
  fatherAdhar: {
    type: String,
    trim: true
  },
  motherAdhar: {
    type: String,
    trim: true
  },
  permanentAddress: {
    type: String,
    required: true,
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

export const DeathCertificate = mongoose.model("DeathCertificate", deathCertificateSchema);