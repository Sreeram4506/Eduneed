import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { filesAPI } from '../utils/api';
import { FaUpload, FaFileAlt, FaTimes, FaCheck, FaCloudUploadAlt } from 'react-icons/fa';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success('File selected successfully!');
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      toast.success('File dropped successfully!');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file) {
      setError('Please select a file');
      toast.error('Please select a file');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('description', description);

    try {
      const data = await filesAPI.upload(formData);
      if (data.message === 'File uploaded successfully') {
        toast.success('File uploaded successfully!');
        navigate('/browse');
      } else {
        setError(data.message || 'Upload failed');
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Upload Study Material
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your notes, assignments, or study resources with the community. Help fellow students succeed!
          </p>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="card-header">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaCloudUploadAlt className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your File</h2>
              <p className="text-gray-600">Fill in the details below to share your study material</p>
            </div>
          </div>
          
          <div className="card-body">
            <motion.form 
              className="space-y-8" 
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {error && (
                <motion.div 
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <FaTimes className="w-5 h-5 mr-2" />
                  {error}
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                    File Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g., Calculus Chapter 5 Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Math">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.div>

                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select File *
                  </label>
                  <motion.div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      isDragOver 
                        ? 'border-blue-500 bg-blue-50 scale-105' 
                        : file 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      id="file"
                      name="file"
                      type="file"
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    
                    {file ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <FaCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-green-700 mb-2">File Selected!</p>
                          <p className="text-sm text-gray-600 flex items-center justify-center">
                            <FaFileAlt className="mr-2" />
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center justify-center mx-auto"
                        >
                          <FaTimes className="mr-1" />
                          Remove file
                        </button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <FaUpload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700 mb-2">
                            {isDragOver ? 'Drop your file here' : 'Choose a file or drag it here'}
                          </p>
                          <p className="text-sm text-gray-500">
                            PDF, DOC, DOCX, PPT, PPTX up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="form-textarea"
                    placeholder="Provide a brief description of the file content, what topics it covers, or any additional information..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </motion.div>
              </div>

              <motion.div 
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-blue-800">Important Note</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>By uploading, you agree to share this file with the student community. Make sure you have the right to share this content.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner w-5 h-5 mr-3"></div>
                      Uploading file...
                    </>
                  ) : (
                    <>
                      <FaUpload className="w-5 h-5 mr-2" />
                      Upload File
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
