import mongoose from 'mongoose';
const marriageCertificateSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
  },
  
  // Marriage Details
  dateOfMarriage: {
    type: Date,
    required: true
  },
  placeOfMarriage: {
    type: String,
    required: true,
    trim: true
  },
  
  // Husband Details (renamed from Groom)
  HusbandName: {
    type: String,
    required: true,
    trim: true
  },
  HusbandAge: {
    type: Number,
    required: true,
    min: 21
  },
  HusbandFatherName: {
    type: String,
    required: true,
    trim: true
  },
  HusbandAddress: {
    type: String,
    trim: true
  },
  HusbandOccupation: {
    type: String,
    trim: true
  },

  // Wife Details (renamed from Bride)
  wifeName: {
    type: String,
    required: true,
    trim: true
  },
  wifeAge: {
    type: Number,
    required: true,
    min: 18
  },
  wifeFatherName: {
    type: String,
    required: true,
    trim: true
  },
  wifeAddress: {
    type: String,
    trim: true
  },
  wifeOccupation: {
    type: String,
    trim: true
  },

  // Add this new field
  SolemnizedOn: {
    type: String,
    required: true,
    trim: true
  },
  
  // Payment Amount
  paymentAmount: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

export const MarriageCertificate = mongoose.model("MarriageCertificate",marriageCertificateSchema);