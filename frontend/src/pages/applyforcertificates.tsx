import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBaby, FaSkull, FaHeart } from "react-icons/fa";

type CertificateType = "birth" | "death" | "marriage";

const certificateLabels: Record<CertificateType, { label: string; icon: React.ReactNode; color: string }> = {
  birth: {
    label: "जन्म प्रमाणपत्र",
    icon: <FaBaby className="text-blue-400" size={28} />,
    color: "from-blue-100 to-blue-50",
  },
  death: {
    label: "मृत्यू प्रमाणपत्र ",
    icon: <FaSkull className="text-red-400" size={28} />,
    color: "from-red-100 to-red-50",
  },
  marriage: {
    label: "विवाह प्रमाणपत्र ",
    icon: <FaHeart className="text-pink-400" size={28} />,
    color: "from-pink-100 to-pink-50",
  },
};

// Dummy admin check (replace with real auth logic)
const isAdmin = false; // Set to true for admin

const formVariants = {
  initial: { opacity: 0, y: 40, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } },
  exit: { opacity: 0, y: -40, scale: 0.97, transition: { duration: 0.3 } },
};

const FormsPage = () => {
  const [selected, setSelected] = useState<CertificateType>("birth");
  const [formData, setFormData] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Payment logic here
  };

  const handlePayment = () => {
    setPaid(true);
    // Payment gateway integration here
  };

  const renderForm = () => {
    switch (selected) {
      case "birth":
        return (
          <motion.form
            key="birth"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex flex-col items-center gap-2">
              <FaBaby className="text-blue-400 mb-1" size={40} />
              <h2 className="text-xl font-bold text-blue-700">जन्म प्रमाणपत्र अर्ज</h2>
              <span className="text-gray-500 text-sm">कृपया सर्व माहिती भरा</span>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">नाव:</label>
              <input name="name" placeholder="Child's Name" onChange={handleInputChange} className="input_field" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">जन्म तारीख :</label>
              <input name="dob" type="date" onChange={handleInputChange} className="input_field" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1"> जन्म ठिकाण  </label>
              <input name="placeOfBirth" placeholder="Place of Birth" onChange={handleInputChange} className="input_field" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1"> आईचे पूर्ण नाव: </label>
              <input name="father" placeholder="Father's Name" onChange={handleInputChange} className="input_field" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">वडिलांचे पूर्ण नाव:</label>
              <input name="mother" placeholder="Mother's Name" onChange={handleInputChange} className="input_field" required />
            </div>
            <div>
  <label className="block text-gray-700 font-medium mb-1">आईचे आधार क्रमांक:</label>
  <input
    type="text"
    name="aadhar"
    placeholder="Mother's Aadhar Number"
    onChange={handleInputChange}
    className="input_field"
    required
    maxLength={12}
    pattern="\d{12}"
    title="Enter a valid 12-digit Aadhar number"
  />
</div>
<div>
  <label className="block text-gray-700 font-medium mb-1">वडिलांचे आधार क्रमांक:</label>
  <input
    type="text"
    name="aadhar"
    placeholder="Father's Aadhar Number"
    onChange={handleInputChange}
    className="input_field"
    required
    maxLength={12}
    pattern="\d{12}"
    title="Enter a valid 12-digit Aadhar number"
  />
</div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">आई वडिलांचा कायमचा पत्ता:</label>
              <input name="father" placeholder="Parent Address" onChange={handleInputChange} className="input_field" required />
            </div>
            <div>
  <label className="block text-gray-700 font-medium mb-1">नोंदणी क्रमांक:</label>
  <input
    type="text"
    name="registrationNumber"
    placeholder="Registration Number"
    onChange={handleInputChange}
    className="input_field"
    required
  />
</div>
<div>
              <label className="block text-gray-700 font-medium mb-1">नोंदणी दिनांक:</label>
              <input name="dor" type="date" onChange={handleInputChange} className="input_field" required />
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded font-semibold shadow transition"
            >
              Submit
            </motion.button>
          </motion.form>
        );
      case "death":
        return (
          <motion.form
            key="death"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex flex-col items-center gap-2">
              <FaSkull className="text-red-400 mb-1" size={40} />
              <h2 className="text-xl font-bold text-red-700">मृत्यू प्रमाणपत्र अर्ज</h2>
              <span className="text-gray-500 text-sm">कृपया सर्व माहिती भरा</span>
            </div>
            <div>
    <label className="block text-gray-700 font-medium mb-1">मृत व्यक्तीचे नाव</label>
    <input name="name" placeholder="Full Name of Deceased" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">लिंग</label>
    <select name="gender" onChange={handleInputChange} className="input_field" required>
      <option value="">लिंग निवडा</option>
      <option value="पुरुष">पुरुष</option>
      <option value="स्त्री">स्त्री</option>
      <option value="इतर">इतर</option>
    </select>
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">आधार क्रमांक</label>
    <input name="aadhar" placeholder="Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">मृत व्यक्तीचे वय</label>
    <input name="age" type="number" placeholder="Age" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">मृत्यूचा दिनांक</label>
    <input name="dateOfDeath" type="date" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">मृत्यूचे ठिकाण</label>
    <input name="placeOfDeath" placeholder="Place of Death" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">जोडीदाराचे नाव</label>
    <input name="spouseName" placeholder="Spouse Name" onChange={handleInputChange} className="input_field" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">पती / पत्नीचा आधार क्रमांक</label>
    <input name="spouseAadhar" placeholder="Spouse Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">आईचे नाव</label>
    <input name="motherName" placeholder="Mother's Name" onChange={handleInputChange} className="input_field" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">आईचा आधार क्रमांक</label>
    <input name="motherAadhar" placeholder="Mother's Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">वडिलांचे नाव</label>
    <input name="fatherName" placeholder="Father's Name" onChange={handleInputChange} className="input_field" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">वडिलांचा आधार क्रमांक</label>
    <input name="fatherAadhar" placeholder="Father's Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">मृतसमयी मृत व्यक्तीचा पत्ता</label>
    <textarea name="addressAtDeath" placeholder="Address at Time of Death" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">मृत व्यक्तीचा कायमचा पत्ता</label>
    <textarea name="permanentAddress" placeholder="Permanent Address" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">नोंदणी क्रमांक</label>
    <input name="registrationNumber" placeholder="Registration Number" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">नोंदणी दिनांक</label>
    <input name="registrationDate" type="date" onChange={handleInputChange} className="input_field" required />
  </div>

  <div className="md:col-span-2">
    <label className="block text-gray-700 font-medium mb-1">शेरा</label>
    <textarea name="note" placeholder="Additional Notes" onChange={handleInputChange} className="input_field" />
  </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-red-500 text-white px-6 py-3 rounded font-semibold shadow transition"
            >
              Submit
            </motion.button>
          </motion.form>
        );
      case "marriage":
        return (
          <motion.form
            key="marriage"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex flex-col items-center gap-2">
              <FaHeart className="text-pink-400 mb-1" size={40} />
              <h2 className="text-xl font-bold text-pink-700">विवाह प्रमाणपत्र अर्ज</h2>
              <span className="text-gray-500 text-sm">कृपया सर्व माहिती भरा</span>
            </div>
            <div>
    <label className="block text-gray-700 font-medium mb-1">पतीचे नाव</label>
    <input name="husbandName" placeholder="Husband's Name" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">पत्नीचे नाव</label>
    <input name="wifeName" placeholder="Wife's Name" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">लग्नाची दिनांक</label>
    <input type="date" name="marriageDate" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">लग्नाचे ठिकाण</label>
    <input name="marriagePlace" placeholder="Place of Marriage" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">पतीचे वय</label>
    <input type="number" name="husbandAge" placeholder="Husband's Age" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">पत्नीचे वय</label>
    <input type="number" name="wifeAge" placeholder="Wife's Age" onChange={handleInputChange} className="input_field" required />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">पतीचा व्यवसाय</label>
    <input name="husbandOccupation" placeholder="Husband's Occupation" onChange={handleInputChange} className="input_field" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">पत्नीचा व्यवसाय</label>
    <input name="wifeOccupation" placeholder="Wife's Occupation" onChange={handleInputChange} className="input_field" />
  </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-pink-500 text-white px-6 py-3 rounded font-semibold shadow transition"
            >
              Submit
            </motion.button>
          </motion.form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 py-10 px-2">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-900"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        Certificate Forms
      </motion.h1>
      <motion.div
        className="flex justify-center flex-wrap gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {Object.entries(certificateLabels).map(([key, { label, icon, color }]) => (
          <motion.button
            key={key}
            onClick={() => {
              setSelected(key as CertificateType);
              setSubmitted(false);
              setPaid(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 bg-gradient-to-br ${color} ${
              selected === key ? "scale-105 ring-2 ring-blue-400" : "hover:scale-105"
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
          >
            {icon}
            <span>{label}</span>
          </motion.button>
        ))}
      </motion.div>
      <div className="w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!submitted && (
            <motion.div
              key={selected}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={formVariants}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {renderForm()}
            </motion.div>
          )}
          {submitted && !paid && (
            <motion.div
              key="payment"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={formVariants}
              className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4"
            >
              <p className="mb-4 text-lg">Please proceed to payment to download your certificate.</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className="bg-green-500 text-white px-6 py-3 rounded font-semibold w-full shadow"
              >
                Pay & Download
              </motion.button>
            </motion.div>
          )}
          {submitted && paid && (
            <motion.div
              key="download"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={formVariants}
              className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4"
            >
              <p className="mb-4 text-lg">Payment successful!</p>
              <a href="#" className="text-blue-600 underline font-semibold text-lg">
                Download Certificate
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isAdmin && (
        <motion.div
          className="mt-8 p-6 border-t bg-white rounded-xl shadow animate-fade-in-up"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="font-semibold mb-2 text-xl">Admin Section</h2>
          <p>Edit certificate templates and manage submissions here.</p>
        </motion.div>
      )}
      <style>
        {`
        .input_field {
          width: 100%;
          height: 42px;
          padding: 0 0 0 12px;
          border-radius: 8px;
          outline: none;
          border: 1.5px solid #e5e5e5;
          background: #f8fafc;
          font-size: 1rem;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .input_field:focus {
          border: 1.5px solid #115DFC;
          box-shadow: 0px 0px 0px 2px #e3eafe;
          background-color: #f7faff;
        }
        `}
      </style>
    </div>
  );
};

export default FormsPage;