import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaFile, FaCheck, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

interface ApprovedForm {
  id: string;
  formType: string;
  fullName: string;
  dateApproved: string;
  certificateStatus: 'pending' | 'uploaded';
}

const sampleApprovedForms: ApprovedForm[] = [
  {
    id: 'FORM-001',
    formType: 'Birth Certificate',
    fullName: 'Rahul Kumar',
    dateApproved: '2025-06-01',
    certificateStatus: 'pending'
  },
  {
    id: 'FORM-002',
    formType: 'Residence Certificate',
    fullName: 'Priya Sharma',
    dateApproved: '2025-06-02',
    certificateStatus: 'pending'
  }
];
const API_BASE_URL = 'http://localhost:5000/api'; // adjust to match your backend URL

export const certificateService = {
  async uploadCertificate(formId: string, file: File) {
    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('formId', formId);

    const response = await axios.post(
      `${API_BASE_URL}/certificates/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  async getApprovedForms() {
    const response = await axios.get(`${API_BASE_URL}/forms/approved`);
    return response.data;
  }
};

const UploadCertificates = () => {
  const [forms, setForms] = useState<ApprovedForm[]>(sampleApprovedForms);
  const [uploading, setUploading] = useState<string | null>(null);


  const handleFileUpload = async (formId: string, file: File) => {
    try {
      setUploading(formId);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('certificate', file);
      formData.append('formId', formId);

      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update local state
      setForms(prevForms =>
        prevForms.map(form =>
          form.id === formId
            ? { ...form, certificateStatus: 'uploaded' }
            : form
        )
      );

      // Show success message
      alert('Certificate uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload certificate. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Certificates</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <motion.div
              key={form.id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{form.formType}</h3>
                <p className="text-gray-600">{form.fullName}</p>
                <p className="text-sm text-gray-500">
                  Approved: {new Date(form.dateApproved).toLocaleDateString()}
                </p>
              </div>

              {form.certificateStatus === 'pending' ? (
                <div className="mt-4">
                  <label 
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed
                      ${uploading === form.id 
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                        : 'border-blue-300 hover:border-blue-400 cursor-pointer'
                      }
                    `}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(form.id, file);
                      }}
                      disabled={uploading === form.id}
                    />
                    {uploading === form.id ? (
                      <>
                        <FaSpinner className="animate-spin text-blue-600" />
                        <span className="text-gray-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaUpload className="text-blue-600" />
                        <span className="text-blue-600">Upload Certificate</span>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <FaCheck />
                  <span>Certificate Uploaded</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {forms.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No approved forms waiting for certificates.
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCertificates;