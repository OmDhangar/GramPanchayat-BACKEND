import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { notifyAdminNewApplication, notifyUserStatusUpdate } from "../utils/emailService.js";
import mongoose from "mongoose";
import fs from "fs";
import crypto from "crypto";

// Import models
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { BirthCertificate } from "../models/birthcertificate.model.js";
import { DeathCertificate } from "../models/deathcertificate.model.js";
import { MarriageCertificate } from "../models/marriagecertificate.model.js";
import { Notification } from "../models/notification.model.js";

// Helper to generate unique application ID
const generateApplicationId = (prefix) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = crypto.randomBytes(3).toString('hex');
  return `${prefix}-${timestamp}-${random}`;
};

// Helper to process uploaded files
const processUploadedFiles = async (files) => {
  if (!files || !files.length) return [];
  
  const uploadedFiles = [];
  
  for (const file of files) {
    const localPath = file.path;
    if (!localPath) continue;
    
    const cloudinaryResponse = await uploadOnCloudinary(localPath);
    
    if (cloudinaryResponse) {
      uploadedFiles.push({
        fileName: cloudinaryResponse.public_id,
        originalName: file.originalname,
        filePath: cloudinaryResponse.secure_url,
        fileType: file.mimetype,
        fileSize: file.size
      });
    }
  }
  

  return uploadedFiles;
};

// Helper to create notification
const createNotification = async (userId, applicationId, type, title, message) => {
  try {
    const notification = await Notification.create({
      userId,
      applicationId,
      type,
      title,
      message
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Submit Birth Certificate Application
const submitBirthCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    childName, dateOfBirth, placeOfBirth, gender,motherAdharNumber,parentsAddressAtBirth,
    fatherName,fatherAdharNumber,permanentAddressParent ,motherName, fatherOccupation, motherOccupation, hospitalName 
  } = req.body;
  
  // Validate date format
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) {
    throw new ApiError(400, "Invalid date format for date of birth");
  }
  
  // Validate gender

  const trimmedGender = gender.trim();
  console.log("Trimmed Gender:",trimmedGender);
  if(gender !== 'Male' && gender !== 'Female' && gender !== 'Other'){
    throw new ApiError(400,"Invalid gender");
  }
  
  // Process uploaded files
  const uploadedFiles = await processUploadedFiles(req.files);
  
  // Create application with unique ID
  const applicationId = generateApplicationId('BIRTH');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'birth_certificate',
    uploadedFiles
  };
  
  // Prepare form data
  const formData = {
    childName,
    dateOfBirth: birthDate,
    placeOfBirth,
    motherAdharNumber:motherAdharNumber || "",
    fatherAdharNumber:fatherAdharNumber || "",
    permanentAddressParent,
    parentsAddressAtBirth,
    gender,
    fatherName,
    motherName,
    fatherOccupation,
    motherOccupation,
    hospitalName
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  
  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Birth Certificate Application Submitted',
    `Your application for ${childName}'s birth certificate has been submitted successfully.`
  );
  
  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);
  
  return res.status(201).json(
    new ApiResponse(201, application, "Birth certificate application submitted successfully")
  );
});

// Submit Death Certificate Application
const submitDeathCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    deceasedName, dateOfDeath, addressOfDeath,placeOfDeath, age, gender, causeOfDeath,deceasedAdharNumber,
    fatherName,motherName ,spouseName, spouseAdhar, motherAdhar, fatherAdhar,permanentAddress 
  } = req.body;
  
  
  // Validate date format
  const deathDate = new Date(dateOfDeath);
  if (isNaN(deathDate.getTime())) {
    throw new ApiError(400, "Invalid date format for date of death");
  }
  
  // Validate age
  if (isNaN(age) || age < 0) {
    throw new ApiError(400, "Age must be a positive number");
  }
  
  // Validate gender
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    throw new ApiError(400, "Gender must be Male, Female, or Other");
  }
  
  // Process uploaded files
  const uploadedFiles = await processUploadedFiles(req.files);
  
  // Create application with unique ID
  const applicationId = generateApplicationId('DEATH');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'death_certificate',
    uploadedFiles
  };
  
  // Prepare form data
  const formData = {
    deceasedName,
    deceasedAdharNumber,
    dateOfDeath: deathDate,
    addressOfDeath,
    placeOfDeath,
    age: parseInt(age),
    gender,
    causeOfDeath,
    fatherName,
    motherName,
    spouseName: spouseName || "",
    spouseAdhar:spouseAdhar || "",
    fatherAdhar:fatherAdhar || "",
    motherAdhar:motherAdhar || "",
    permanentAddress,
    informantName,
    informantRelation,
    informantAddress
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  
  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Death Certificate Application Submitted',
    `Your application for ${deceasedName}'s death certificate has been submitted successfully.`
  );
  
  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);
  
  return res.status(201).json(
    new ApiResponse(201, application, "Death certificate application submitted successfully")
  );
});

// Submit Marriage Certificate Application
const submitMarriageCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    dateOfMarriage, placeOfMarriage,
    HusbandName, HusbandAge, HusbandFatherName, HusbandAddress, HusbandOccupation,
    wifeName, wifeAge, wifeFatherName, wifeAddress, wifeOccupation, SolemnizedOn,
  } = req.body;
  
  
  // Validate date format
  const marriageDate = new Date(dateOfMarriage);
  if (isNaN(marriageDate.getTime())) {
    throw new ApiError(400, "Invalid date format for date of marriage");
  }
  
  // Validate ages
  if (isNaN(HusbandAge) || HusbandAge < 21) {
    throw new ApiError(400, "Groom's age must be at least 21 years");
  }
  
  if (isNaN(wifeAge) || wifeAge < 18) {
    throw new ApiError(400, "Bride's age must be at least 18 years");
  }
  
  // Process uploaded files
  const uploadedFiles = await processUploadedFiles(req.files);
  
  // Create application with unique ID
  const applicationId = generateApplicationId('MARRIAGE');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'marriage_certificate',
    uploadedFiles
  };
  
  // Prepare form data
  const formData = {
    dateOfMarriage: marriageDate,
    placeOfMarriage,
    HusbandName,
    HusbandAge: parseInt(HusbandAge),
    HusbandFatherName,
    HusbandAddress,
    HusbandOccupation,
    wifeName,
    wifeAge: parseInt(wifeAge),
    wifeFatherName,
    wifeAddress,
    wifeOccupation,
    SolemnizedOn,
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  
  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Marriage Certificate Application Submitted',
    `Your marriage certificate application for ${HusbandName} and ${wifeName} has been submitted successfully.`
  );
  
  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);
  
  return res.status(201).json(
    new ApiResponse(201, application, "Marriage certificate application submitted successfully")
  );
});

// Get user's applications
const getUserApplications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const applications = await Application.find({ applicantId: userId })
    .sort({ createdAt: -1 })
    .lean();
  
  return res.status(200).json(
    new ApiResponse(200, applications, "User applications retrieved successfully")
  );
});

 

// Get admin's applications
const getAdminApplications = asyncHandler(async (req, res) => {
  if(req.user.role !== 'admin'){
    throw new ApiError(403,"Unauthorized access");
  }
  const applications = await Application.find(
    {
      status:{
        $in:['pending','approved','rejected']
      }
    }
  )
   .sort({ createdAt: -1 })
   .lean();

  return res.status(200).json(
    new ApiResponse(200, applications, "Admin applications retrieved successfully")
  );
  
})

// Get application details
const getApplicationDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  
  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }
  
  const application = await Application.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(applicationId) ? applicationId : null },
      { applicationId }
    ]
  });
  
  if (!application) {
    throw new ApiError(404, "Application not found");
  }
  
  // Check if the user is authorized to view this application
  if (req.user.role !== 'admin' && application.applicantId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view this application");
  }
  
  // Get form data
  const formData = await application.getFormData();
  
  return res.status(200).json(
    new ApiResponse(200, { application, formData }, "Application details retrieved successfully")
  );
});

export {
  getAdminApplications,
  submitBirthCertificateApplication,
  submitDeathCertificateApplication,
  submitMarriageCertificateApplication,
  getUserApplications,
  getApplicationDetails
};