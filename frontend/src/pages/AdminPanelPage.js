import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';
import { FaUsers, FaFileAlt, FaTrash, FaSignOutAlt, FaChartBar, FaShieldAlt, FaEye, FaDownload } from 'react-icons/fa';

const AdminPanelPage = () => {
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [activeTab, user, navigate]);

  const fetchData = async () => {
    try {
      if (activeTab === 'users') {
        const data = await adminAPI.getUsers();
        setUsers(data);
      } else {
        const data = await adminAPI.getFiles();
        setFiles(data);
      }
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await adminAPI.deleteFile(fileId);
      setSuccess('File deleted successfully');
      toast.success('File deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete file');
      toast.error('Failed to delete file');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h1>
            <p className="text-xl text-gray-600">Manage users and files in the system</p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="btn-danger flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt className="w-4 h-4 mr-2" />
            Logout
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div 
              className="mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{users.length}</h3>
              <p className="text-gray-600 font-semibold">Total Users</p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaFileAlt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{files.length}</h3>
              <p className="text-gray-600 font-semibold">Total Files</p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaShieldAlt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Admin</h3>
              <p className="text-gray-600 font-semibold">System Status</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <nav className="flex space-x-2 bg-white p-2 rounded-2xl shadow-lg">
            <motion.button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUsers className="w-4 h-4 mr-2" />
              Users ({users.length})
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('files')}
              className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center ${
                activeTab === 'files'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaFileAlt className="w-4 h-4 mr-2" />
              Files ({files.length})
            </motion.button>
          </nav>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaUsers className="mr-3 text-blue-600" />
                  User Management
                </h2>
                <p className="mt-2 text-gray-600">View and manage all registered users</p>
              </div>
              <div className="card-body">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user, index) => (
                        <motion.tr 
                          key={user._id} 
                          className="hover:bg-gray-50 transition-colors duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                  <span className="text-lg font-bold text-white">
                                    {user.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-lg font-bold text-gray-900">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              user.role === 'admin'
                                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                                : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrator' : 'Student'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaFileAlt className="mr-3 text-green-600" />
                  File Management
                </h2>
                <p className="mt-2 text-gray-600">View and manage all uploaded files</p>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  {files.map((file, index) => (
                    <motion.div 
                      key={file._id} 
                      className="card bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="card-body">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <FaFileAlt className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{file.title}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div className="flex items-center text-gray-600">
                                    <FaTag className="mr-2 text-blue-500" />
                                    <span className="font-medium">{file.subject}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <FaUser className="mr-2 text-green-500" />
                                    <span className="font-medium">{file.uploaderName}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <FaDownload className="mr-2 text-purple-500" />
                                    <span className="font-medium">{file.downloadCount} downloads</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <FaEye className="mr-2 text-orange-500" />
                                    <span className="font-medium">{new Date(file.uploadDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <motion.button
                              onClick={() => handleDeleteFile(file._id)}
                              className="btn-danger text-sm flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTrash className="w-4 h-4 mr-2" />
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanelPage;
