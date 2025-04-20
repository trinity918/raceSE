// src/pages/ResumeBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ResumeBuilder = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [latexCode, setLatexCode] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle file upload
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setError('');
      setIsProcessing(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Send to backend - replace with your actual API endpoint
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Conversion failed');
        }

        const data = await response.json();
        setLatexCode(data.latex);
        setPdfUrl(data.pdfUrl);
        setEditedCode(data.latex);
      } catch (err) {
        setError('Failed to process file. Please try again.');
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    multiple: false
  });

  // Handle code editing and re-submission
  const handleSubmitEditedCode = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/latex-to-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: editedCode }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const data = await response.json();
      setPdfUrl(data.pdfUrl);
      setLatexCode(editedCode);
      setShowEditor(false);
    } catch (err) {
      setError('Failed to generate PDF. Please check your LaTeX code.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(latexCode);
    // Show toast or notification here
  };

  // Download PDF
  const handleDownloadPDF = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <main className="lg:ml-64 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              Resume Builder
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 animate-fade-in-delay">
              Convert your resume to LaTeX format instantly
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-12">
            <div
              {...getRootProps()}
              className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-[1.02]' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
                ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                cursor-pointer backdrop-blur-sm`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center ${isDragActive ? 'animate-bounce' : 'animate-pulse'}`}>
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-xl font-medium text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume file'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to select a file (PDF, DOC, DOCX, TXT, or Image)
                </p>
                {uploadedFile && (
                  <div className="mt-4 flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-600">{uploadedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          {latexCode && (
            <div className="flex justify-center space-x-4 mb-8 animate-slide-up">
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download PDF</span>
              </button>
              <button
                onClick={handleCopyCode}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Code</span>
              </button>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Code</span>
              </button>
            </div>
          )}

          {/* Code Editor */}
          {showEditor && (
            <div className="mb-8 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit LaTeX Code</h3>
                  <button
                    onClick={handleSubmitEditedCode}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Generate PDF'}
                  </button>
                </div>
                <textarea
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border-0 focus:ring-0"
                  placeholder="Edit your LaTeX code here..."
                />
              </div>
            </div>
          )}

          {/* Overleaf Link */}
          {latexCode && (
            <div className="text-center animate-fade-in">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Or edit your resume professionally on Overleaf:
              </p><a
              
                href="https://www.overleaf.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                Open in Overleaf
              </a>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
