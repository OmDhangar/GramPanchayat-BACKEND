import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';

interface FormDetails {
  id: string;
  formType: string;
  fullName: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected';
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  purpose: string;
  attachments: string[];
}

const FormDetails = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState<null | 'approve' | 'reject'>(null);

  const formDetails: FormDetails = {
    id: formId || '',
    formType: 'Birth Certificate',
    fullName: 'Rahul Kumar',
    dateSubmitted: '2025-06-01',
    status: 'pending',
    dateOfBirth: '1995-03-15',
    address: '123 Main Street, City, State',
    phoneNumber: '+91 9876543210',
    email: 'rahul@example.com',
    purpose: 'School Admission',
    attachments: ['id_proof.pdf', 'address_proof.pdf']
  };

  const handleApprove = async () => {
    setShowAnimation('approve');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowAnimation(null);
    setLoading(false);
    navigate('/admin/approvals');
  };

  const handleReject = async () => {
    setShowAnimation('reject');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowAnimation(null);
    setLoading(false);
    navigate('/admin/approvals');
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-8">
      {/* Animation Overlay */}
      {showAnimation && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <video
            src={
              showAnimation === 'approve'
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

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/admin/approvals')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft /> Back to Approvals
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Form Details</h1>
            <span className={`px-4 py-2 rounded-full text-sm ${
              formDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              formDetails.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {formDetails.status.charAt(0).toUpperCase() + formDetails.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Form Type</label>
                <p className="font-semibold">{formDetails.formType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="font-semibold">{formDetails.fullName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>
                <p className="font-semibold">{formDetails.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <p className="font-semibold">{formDetails.phoneNumber}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-semibold">{formDetails.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Address</label>
                <p className="font-semibold">{formDetails.address}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Purpose</label>
                <p className="font-semibold">{formDetails.purpose}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Attachments</h3>
            <div className="space-y-2">
              {formDetails.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <a href="#" className="underline">{attachment}</a>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
            >
              <FaCheck /> Approve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReject}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700"
            >
              <FaTimes /> Reject
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDetails;
