import React, { useState } from 'react';
import axios from 'axios';

const UploadAndDownload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const response = await axios.post('https://d9ad-103-104-226-58.ngrok-free.app/upload', formData, {
        responseType: 'blob', // Expecting a file in return
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get filename from Content-Disposition header (if available)
      const disposition = response.headers['content-disposition'];
      const match = disposition?.match(/filename="?(.+)"?/);
      const filename = match ? match[1] : 'downloaded_file';

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Upload and Download</h2>
      <input type="file" accept=".pdf,.txt,.docx,.png,.jpg" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {uploading ? 'Uploading...' : 'Upload & Get File'}
      </button>
    </div>
  );
};

export default UploadAndDownload;
