import mongoose from 'mongoose';
const documentRequirementSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ['birth_certificate', 'death_certificate', 'marriage_certificate'],
    unique: true,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: String,
  processingTime: {
    type: String,
    default: '3-5 business days'
  },
  
  // Required Documents List
  requiredDocuments: [{
    name: String,
    description: String,
    mandatory: {
      type: Boolean,
      default: true
    }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const documentRequirement = mongoose.model("documentRequirement",documentRequirementSchema);