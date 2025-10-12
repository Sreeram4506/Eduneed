import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';

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
      fetchData();
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'files' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Files
            </button>
          </nav>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">User Management</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">Role: {user.role}</p>
                      <p className="text-sm text-gray-500">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">File Management</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li key={file._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{file.title}</p>
                      <p className="text-sm text-gray-500">Subject: {file.subject}</p>
                      <p className="text-sm text-gray-500">Uploader: {file.uploaderName}</p>
                      <p className="text-sm text-gray-500">Downloads: {file.downloadCount}</p>
                      <p className="text-sm text-gray-500">Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDeleteFile(file._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
