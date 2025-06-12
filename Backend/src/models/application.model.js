import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Application Basics
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Document Type
  documentType: {
    type: String,
    enum: ['marriage_certificate', 'birth_certificate', 'death_certificate'],
    required: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending','approved', 'certificate_generated','rejected', 'completed'],
    default: 'pending'
  },
  
  // Form Data (Dynamic based on document type)
 formDataRef: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'formDataModel'
  },
  formDataModel: {
    type: String,
    enum: ['BirthCertificate', 'DeathCertificate', 'MarriageCertificate']
  },


  // File Uploads
  uploadedFiles: [{
    fileName: String,
    originalName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Admin Processing
  assignedAt: Date,
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminRemarks: String,
  
  // Generated Certificate
  generatedCertificate: {
    fileName: String,
    filePath: String,
    generatedAt: Date
  },
  
  // Payment Info
  paymentDetails: {
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paidAt: Date,
  }
}, {
  timestamps: true
});


// Method to get payment amount from referenced form
applicationSchema.methods.getPaymentAmount = async function() {
  if (!this.formDataRef) return 0;
  
  const FormModel = mongoose.model(this.formDataModel);
  const formData = await FormModel.findById(this.formDataRef);
  return formData ? formData.paymentAmount : 0;
};

// Method to get form data
applicationSchema.methods.getFormData = async function() {
  if (!this.formDataRef) return null;
  
  const FormModel = mongoose.model(this.formDataModel);
  return await FormModel.findById(this.formDataRef);
};

// Static method to create application with form data
applicationSchema.statics.createWithFormData = async function(applicationData, formData) {
  const { documentType } = applicationData;

  // Validate form data based on document type
  let validationResult;
  switch(documentType) {
    case 'birth_certificate':
      validationResult = validateBirthCertificate(formData);
      break;
    case 'death_certificate':
      validationResult = validateDeathCertificate(formData);
      break;
    case 'marriage_certificate':
      validationResult = validateMarriageCertificate(formData);
      break;
    default:
      throw new Error('Invalid document type');
  }
  
  // Check validation result
  if (!validationResult.isValid) {
    throw new Error(`Missing required fields: ${validationResult.missingFields.join(', ')}`);
  }

  
  // Create the application first
  const application = new this(applicationData);
  await application.save();
  
  // Determine form model and create form data
  let FormModel, formDataModel;
  
  switch(documentType) {
    case 'birth_certificate':
      FormModel = mongoose.model('BirthCertificate');
      formDataModel = 'BirthCertificate';
      break;
    case 'death_certificate':
      FormModel = mongoose.model('DeathCertificate');
      formDataModel = 'DeathCertificate';
      break;
    case 'marriage_certificate':
      FormModel = mongoose.model('MarriageCertificate');
      formDataModel = 'MarriageCertificate';
      break;
    default:
      throw new Error('Invalid document type');
  }
  
  // Create form data with application reference
  const formDataDoc = new FormModel({
    applicationId: application._id,
    ...formData
  });
  await formDataDoc.save();
  
  // Update application with form data reference
  application.formDataRef = formDataDoc._id;
  application.formDataModel = formDataModel;
  await application.save();
  
  return application;
};

// ===================================
// FORM VALIDATION HELPERS
// ===================================

// Birth Certificate Validation
const validateBirthCertificate = (data) => {
  const required = ['childName', 'dateOfBirth', 'gender', 'fatherName', 'motherName', 'placeOfBirth', 'parentsAddressAtBirth', 'permanentAddressParent'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Death Certificate Validation
const validateDeathCertificate = (data) => {
  const required = ['deceasedName', 'deceasedAdharNumber', 'dateOfDeath', 'addressOfDeath', 'placeOfDeath', 'age', 'gender', 'causeOfDeath', 'fatherName', 'motherName', 'permanentAddress'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};
// Marriage Certificate Validation
const validateMarriageCertificate = (data) => {
  const required = [
    'dateOfMarriage', 'placeOfMarriage', 'HusbandName', 'HusbandAge', 'HusbandFatherName',
    'wifeName', 'wifeAge', 'wifeFatherName', 'SolemnizedOn'
  ];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};
export const Application = mongoose.model('Application', applicationSchema);
