import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { filesAPI } from '../utils/api';
import { FaSearch, FaFilter, FaDownload, FaShare, FaEye, FaFileAlt, FaUser, FaCalendarAlt } from 'react-icons/fa';

const BrowsePage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [animateSearch, setAnimateSearch] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [subject, search]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (subject) params.subject = subject;
      if (search) params.search = search;
      const data = await filesAPI.getFiles(params);
      setFiles(data);
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, originalName) => {
    try {
      const response = await filesAPI.downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([await response.blob()]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('File downloaded successfully!');
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const handleShare = async (id) => {
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            Browse Files
          </h1>
          <p className="page-subtitle">
            Discover and download study materials from your peers. Find the perfect resources for your studies.
          </p>
        </motion.div>

        <motion.div 
          className="search-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                Filter by Subject
              </label>
              <div className="filter-select">
                <FaFilter className="filter-icon" />
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  <option value="Math">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <FaSearch className="mr-2 text-blue-600" />
                Search Files
              </label>
              <div className="search-input">
                <FaSearch className="search-icon" />
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="inline-flex flex-col items-center">
                <div className="loading-spinner w-12 h-12 mb-4"></div>
                <span className="text-xl text-gray-600">Loading files...</span>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="card bg-red-50 border-red-200 text-red-700 max-w-md mx-auto">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold mb-2">Error loading files</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          ) : files.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="card bg-gray-50 border-gray-200 text-gray-700 max-w-md mx-auto">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileAlt className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold mb-2">No files found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {files.map((file, index) => (
                <motion.div 
                  key={file._id} 
                  className="file-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="file-icon">
                    <FaFileAlt className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="file-title">
                    {file.title}
                  </h3>
                  
                  <span className="file-category">
                    {file.subject}
                  </span>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {file.description || 'No description provided'}
                  </p>

                  <div className="file-meta">
                    <div className="file-meta-item">
                      <FaUser className="w-4 h-4" />
                      <span>{file.uploaderName}</span>
                    </div>
                    <div className="file-meta-item">
                      <FaDownload className="w-4 h-4" />
                      <span>{file.downloadCount} downloads</span>
                    </div>
                    <div className="file-meta-item">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="file-actions">
                    <Link
                      to={`/file/${file._id}`}
                      className="action-btn action-btn-secondary"
                    >
                      <FaEye />
                      View Details
                    </Link>
                    <motion.button
                      onClick={() => handleDownload(file._id, file.originalName)}
                      className="action-btn action-btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaDownload />
                      Download
                    </motion.button>
                    <motion.button
                      onClick={() => handleShare(file._id)}
                      className="action-btn action-btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaShare />
                      Share
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrowsePage;
