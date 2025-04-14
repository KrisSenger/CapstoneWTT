import React, { useState } from 'react';
import api from '../api';

function DocumentUpload() {
  console.log('DocumentUpload component rendered');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setExtractedData(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    if (!selectedFile) {
      setUploadError('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);

    setIsLoading(true);
    setUploadError('');
    setExtractedData(null);

    try {
      console.log('Sending request to API');
      const response = await api.post('/api/documents/process/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API response:', response.data);

      if (response.data) {
        setExtractedData(response.data);
      }
    } catch (error) {
      console.error('API error:', error);
      setUploadError(error.response?.data?.error || 'Failed to process document.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Previous Logs</h1>
      
      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {uploadError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="document" className="block text-gray-700 font-medium mb-2">
            Select a file:
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <input
                type="file"
                id="document"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                {selectedFile ? (
                  <span className="text-gray-700">{selectedFile.name}</span>
                ) : (
                  <span className="text-gray-500">Choose a file</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('document').click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Browse
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={!selectedFile || isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            !selectedFile || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Processing...' : 'Process Document'}
        </button>
      </form>

      {isLoading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Processing document...</p>
        </div>
      )}

      {extractedData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Extracted Data</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Document Name: {extractedData.document_name}</h3>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Extracted Entities:</h4>
              <div className="bg-white p-4 rounded border border-gray-200 overflow-auto max-h-96">
                <pre className="text-sm">
                  {JSON.stringify(extractedData.extracted_data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;