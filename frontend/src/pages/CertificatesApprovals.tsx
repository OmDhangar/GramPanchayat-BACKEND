import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Sample data structure
interface FormSubmission {
  id: string;
  formType: string;
  fullName: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected';
}

const sampleForms: FormSubmission[] = [
  {
    id: 'FORM-001',
    formType: 'Birth Certificate',
    fullName: 'Rahul Kumar',
    dateSubmitted: '2025-06-01',
    status: 'pending'
  },
  {
    id: 'FORM-002',
    formType: 'Residence Certificate',
    fullName: 'Priya Sharma',
    dateSubmitted: '2025-06-02',
    status: 'pending'
  },
  // Add more sample forms as needed
];

const CertificateApprovals = () => {
  const [forms, setForms] = useState<FormSubmission[]>(sampleForms);
  const navigate = useNavigate();

  const viewFormDetails = (formId: string) => {
    navigate(`/admin/form-details/${formId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Certificate Approvals</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <motion.div
              key={form.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => viewFormDetails(form.id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{form.formType}</h3>
                    <p className="text-gray-600">{form.fullName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    form.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    form.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Submitted: {new Date(form.dateSubmitted).toLocaleDateString()}</span>
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewFormDetails(form.id);
                    }}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificateApprovals;