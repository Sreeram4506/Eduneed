import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { filesAPI } from '../utils/api';
import { FaDownload, FaShare, FaArrowLeft, FaFileAlt, FaUser, FaCalendarAlt, FaEye, FaTag } from 'react-icons/fa';

const FileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFile();
  }, [id]);

  const fetchFile = async () => {
    setLoading(true);
    try {
      const data = await filesAPI.getFile(id);
      setFile(data);
    } catch (err) {
      setError('Failed to load file details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await filesAPI.downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([await response.blob()]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('File downloaded successfully!');
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const handleShare = async () => {
    try {
      console.log('Attempting to share file:', id);
      const data = await filesAPI.shareFile(id);
      console.log('Share response:', data);
      
      if (data.shareUrl) {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(data.shareUrl);
          toast.success('Share link copied to clipboard!');
        } else {
          // Fallback copy method for broader compatibility
          const textArea = document.createElement('textarea');
          textArea.value = data.shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success('Share link copied to clipboard!');
        }
      } else {
        console.error('No shareUrl in response:', data);
        toast.error('Failed to generate share link');
      }
    } catch (err) {
      console.error('Share error:', err);
      toast.error(`Share failed: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading file details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="card bg-red-50 border-red-200 text-red-700 max-w-md">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-lg font-semibold mb-2">Error loading file</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card bg-gray-50 border-gray-200 text-gray-700 max-w-md">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold mb-2">File not found</p>
              <p className="text-sm">The file you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/browse')}
            className="btn-secondary flex items-center mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back to Browse
          </button>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="card-header">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <FaFileAlt className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{file.title}</h1>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        <FaTag className="mr-1" />
                        {file.subject}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <FaEye className="mr-1" />
                        {file.downloadCount} downloads
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
                      Description
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {file.description || 'No description provided for this file.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="card bg-gradient-to-br from-blue-50 to-indigo-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="card-body">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <FaFileAlt className="mr-2 text-blue-600" />
                          File Details
                        </h3>
                        <dl className="space-y-3">
                          <div className="flex justify-between items-center">
                            <dt className="text-sm font-medium text-gray-600">File Type:</dt>
                            <dd className="text-sm font-bold text-gray-900">{file.fileType}</dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-sm font-medium text-gray-600">Original Name:</dt>
                            <dd className="text-sm font-bold text-gray-900 truncate ml-2">{file.originalName}</dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-sm font-medium text-gray-600">Upload Date:</dt>
                            <dd className="text-sm font-bold text-gray-900">{new Date(file.uploadDate).toLocaleDateString()}</dd>
                          </div>
                        </dl>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="card bg-gradient-to-br from-green-50 to-emerald-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="card-body">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <FaUser className="mr-2 text-green-600" />
                          Uploader Info
                        </h3>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                              <FaUser className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-bold text-gray-900">{file.uploaderName}</p>
                            <p className="text-sm text-gray-600">File Contributor</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions</h2>
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleDownload}
                      className="btn-primary w-full flex justify-center items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaDownload className="w-5 h-5 mr-2" />
                      Download File
                    </motion.button>
                    <motion.button
                      onClick={handleShare}
                      className="btn-success w-full flex justify-center items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaShare className="w-5 h-5 mr-2" />
                      Share File
                    </motion.button>
                  </div>

                  <motion.div 
                    className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-blue-900 mb-2">Helpful Resource</h3>
                        <div className="text-sm text-blue-800">
                          <p>This file has been downloaded <span className="font-bold">{file.downloadCount}</span> times. Make sure to cite sources if using for academic work.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FileDetailPage;
