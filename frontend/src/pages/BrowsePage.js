import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filesAPI } from '../utils/api';

const BrowsePage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');

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
    } catch (err) {
      alert('Download failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Browse Files</h2>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Subjects</option>
            <option value="Math">Math</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="English">English</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 flex-1"
          />
        </div>
        {loading ? (
          <div className="text-center mt-8">Loading...</div>
        ) : error ? (
          <div className="text-center mt-8 text-red-600">{error}</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div key={file._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{file.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{file.subject}</p>
                  <p className="mt-2 text-sm text-gray-500">{file.description}</p>
                  <p className="mt-2 text-sm text-gray-500">Uploaded by: {file.uploaderName}</p>
                  <p className="mt-2 text-sm text-gray-500">Downloads: {file.downloadCount}</p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/file/${file._id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDownload(file._id, file.originalName)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
