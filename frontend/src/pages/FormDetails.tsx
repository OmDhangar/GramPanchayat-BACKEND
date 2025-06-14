import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

interface UploadedFile {
  _id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

interface PaymentDetails {
  paymentStatus: 'pending' | 'completed' | 'failed';
}

interface FormDetails {
  _id: string;
  applicationId: string;
  applicantId: string;
  documentType: 'birth_certificate' | string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedFiles: UploadedFile[];
  paymentDetails: PaymentDetails;
  createdAt: string;
  updatedAt: string;
  formDataModel: string;
  formDataRef: string;
  __v: number;
}

interface BirthCertificateFormData {
  _id: string;
  applicationId: string;
  childName: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  fatherAdharNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherAdharNumber: string;
  motherOccupation: string;
  hospitalName: string;
  placeOfBirth: string;
  parentsAddressAtBirth: string;
  permanentAddressParent: string;
  paymentAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Generic form data interface for other certificate types
interface GenericFormData {
  [key: string]: any;
}

type FormData = BirthCertificateFormData | GenericFormData;

const FormDetails = () => {
  const { applicationId } = useParams();
  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState<null | 'approved' | 'rejected'>(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!applicationId) {
        setError('No application ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setFormDetails(null);
        setFormData(null);
        
        console.log('Fetching data for applicationId:', applicationId);
        
        const res = await axios.get(`http://localhost:8000/api/v1/applications/${applicationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        console.log('Full API Response:', res.data);
        console.log('Application data:', res.data.data.application);
        console.log('Form data:', res.data.data.formData);
        
        // Access the correct nested data structure
        const applicationData = res.data.data.application;
        const formDataResponse = res.data.data.formData;
        
        // Verify the applicationId matches what we requested
        if (applicationData.applicationId !== applicationId) {
          console.warn('Mismatch: Requested ID:', applicationId, 'Received ID:', applicationData.applicationId);
        }
        
        setFormDetails(applicationData);
        setFormData(formDataResponse);
      } catch (err: any) {
        console.error('Error fetching data for applicationId:', applicationId, err);
        setError(err.response?.data?.message || 'Failed to fetch application details');
        setFormDetails(null);
        setFormData(null);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchData();
    } else {
      setFormDetails(null);
      setFormData(null);
      setError('No application ID provided');
    }

    return () => {};
  }, [applicationId]);

  const updateStatus = async (status: 'approved' | 'rejected') => {
    if (!applicationId) {
      setError('No application ID available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Updating status for applicationId:', applicationId, 'to:', status);
      
      const response = await axios.post(
        `http://localhost:8000/api/v1/applications/admin/review/${applicationId}`,
        {
          status,
          adminRemarks: remarks,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
        }
      );

      console.log('Status update response:', response.data);

      setShowAnimation(status);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowAnimation(null);
      navigate('/admin/approvals');
    } catch (error: any) {
      console.error('Error updating status for applicationId:', applicationId, error);
      setError(error.response?.data?.message || 'Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    if (!remarks.trim()) {
      setError('Please provide remarks for the approval');
      return;
    }
    updateStatus('approved');
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      setError('Please provide remarks for the rejection');
      return;
    }
    updateStatus('rejected');
  };

  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/Id$/, ' ID')
      .replace(/Adhar/, 'Aadhaar');
  };

  const formatFieldValue = (value: any, fieldName: string): string => {
    if (value === null || value === undefined) return 'N/A';
    
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    if (fieldName.toLowerCase().includes('date') && typeof value === 'string') {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    if (typeof value === 'number') {
      if (fieldName.toLowerCase().includes('amount')) {
        return `₹${value}`;
      }
      return value.toString();
    }
    
    return value.toString();
  };

  const renderFormDataFields = (data: FormData) => {
    if (!data) return null;

    // Fields to exclude from display
    const excludeFields = ['_id', '__v', 'createdAt', 'updatedAt', 'applicationId'];
    
    const fields = Object.entries(data).filter(([key]) => !excludeFields.includes(key));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(([key, value]) => (
          <div key={key}>
            <label className="text-sm text-gray-600">{formatFieldName(key)}</label>
            <p className="font-semibold">{formatFieldValue(value, key)}</p>
          </div>
        ))}
      </div>
    );
  };

  // Show loading state while fetching
  if (loading && !formDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading application details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !formDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!formDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <p>No application data available</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 p-8">
      {showAnimation && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <video
            src={
              showAnimation === 'approved'
                ? '../../public/images/Animation - 1749657387951.webm'
                : '../../public/images/Animation - 1749657542955.webm'
            }
            autoPlay
            playsInline
            muted
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg shadow-md border-4 border-white"
            style={{ background: "#fff" }}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin/approvals')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft /> Back to Approvals
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Application Details
              <span className="text-sm font-normal text-gray-500 block">
                ID: {formDetails.applicationId}
              </span>
            </h1>
            <span className={`px-4 py-2 rounded-full text-sm ${
              formDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              formDetails.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {formDetails.status.charAt(0).toUpperCase() + formDetails.status.slice(1)}
            </span>
          </div>

          {/* Application Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Application Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Application ID</label>
                  <p className="font-semibold">{formDetails.applicationId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Document Type</label>
                  <p className="font-semibold capitalize">{formDetails.documentType.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Applicant ID</label>
                  <p className="font-semibold">{formDetails.applicantId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Form Data Model</label>
                  <p className="font-semibold">{formDetails.formDataModel}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Created At</label>
                  <p className="font-semibold">{new Date(formDetails.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Updated At</label>
                  <p className="font-semibold">{new Date(formDetails.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Payment Status</label>
                  <p className={`font-semibold capitalize ${
                    formDetails.paymentDetails.paymentStatus === 'pending' ? 'text-yellow-600' :
                    formDetails.paymentDetails.paymentStatus === 'completed' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {formDetails.paymentDetails.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Data Section */}
          {formData && (
            <div className="mb-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Form Details</h3>
              {renderFormDataFields(formData)}
            </div>
          )}

          {/* Uploaded Files Section */}
          {formDetails.uploadedFiles && formDetails.uploadedFiles.length > 0 && (
            <div className="mb-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
              <div className="space-y-2">
                {formDetails.uploadedFiles.map((file, index) => (
                  <div key={file._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{file.originalName || file.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {file.fileType} • {Math.round(file.fileSize / 1024)} KB
                      </p>
                    </div>
                    <a 
                      href={file.filePath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <label className="text-sm text-gray-600 block mb-2">Admin Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter remarks for approval/rejection"
            />
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {formDetails.status === 'pending' && (
            <div className="mt-8 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
              >
                <FaCheck /> {loading ? 'Processing...' : 'Approve'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReject}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50"
              >
                <FaTimes /> {loading ? 'Processing...' : 'Reject'}
              </motion.button>
            </div>
          )}

          {formDetails.status !== 'pending' && (
            <div className="mt-8 text-center text-gray-600">
              <p>This application has already been {formDetails.status}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormDetails;