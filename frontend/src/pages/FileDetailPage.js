import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { filesAPI } from '../utils/api';

const FileDetailPage = () => {
  const { id } = useParams();
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
    } catch (err) {
      alert('Download failed');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  if (!file) {
    return <div className="text-center mt-8">File not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{file.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">File Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Subject</dt>
                  <dd className="text-sm text-gray-900">{file.subject}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="text-sm text-gray-900">{file.description || 'No description'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">File Type</dt>
                  <dd className="text-sm text-gray-900">{file.fileType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Original Name</dt>
                  <dd className="text-sm text-gray-900">{file.originalName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Uploaded By</dt>
                  <dd className="text-sm text-gray-900">{file.uploaderName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Upload Date</dt>
                  <dd className="text-sm text-gray-900">{new Date(file.uploadDate).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Download Count</dt>
                  <dd className="text-sm text-gray-900">{file.downloadCount}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              <button
                onClick={handleDownload}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailPage;
