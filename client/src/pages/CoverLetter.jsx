// src/pages/CoverLetter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CoverLetter = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setIsProcessingFile(true);

      // Simulate processing
      setTimeout(() => {
        setResumeText(`Jake Ryan
123-456-7890 | jake@su.edu | linkedin.com/in/jake | github.com/jake

Education:
Southwestern University - Georgetown, TX
Bachelor of Arts in Computer Science, Minor in Business
Aug. 2018 -- May 2021

Blinn College - Bryan, TX
Associate's in Liberal Arts
Aug. 2014 -- May 2018

Experience:
Undergraduate Research Assistant
Texas A and M University - College Station, TX
June 2020 -- Present
- Developed a REST API using FastAPI and PostgreSQL
- Developed a full-stack web app using Flask, React, PostgreSQL, Docker
- Explored ways to visualize GitHub collaboration in classrooms

Skills:
Languages: Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R
Frameworks: React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI
Tools: Git, Docker, TravisCI, GCP, VS Code, PyCharm, IntelliJ, Eclipse
Libraries: pandas, NumPy, Matplotlib`);
        setIsProcessingFile(false);
      }, 1500);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const generateCoverLetter = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      setCoverLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the position at your company, as advertised. With my experience in software development and proven track record of delivering high-quality solutions, I am confident in my ability to contribute to your team's success.

During my time as an Undergraduate Research Assistant at Texas A&M University, I developed REST APIs using FastAPI and PostgreSQL, created full-stack web applications with Flask, React, and Docker, and explored innovative ways to visualize GitHub collaboration in educational settings. These experiences have equipped me with both technical expertise and collaborative skills essential for this role.

My background in computer science from Southwestern University, combined with hands-on projects involving various technologies including Java, Python, and React, aligns perfectly with the requirements of this position. I am particularly drawn to your company's innovative approach and believe my skills would be valuable additions to your team.

I am excited about the opportunity to bring my passion for technology and problem-solving to your organization. Thank you for considering my application. I look forward to discussing how my skills and experiences align with your team's needs.

Sincerely,
Jake Ryan`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'cover-letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="lg:ml-64 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Cover Letter Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Create a personalized cover letter using your resume and job description
            </p>
          </div>

          {/* INPUTS */}
          {/* (Upload/Manual + Job Description) */}
          {/* ... upload/resume & job description code here as shown earlier ... */}

          {/* GENERATE BUTTON */}
          <div className="flex justify-center mb-8">
            <button
              onClick={generateCoverLetter}
              disabled={!resumeText || !jobDescription || isGenerating}
              className={`px-8 py-4 rounded-lg text-lg font-semibold text-white
                       flex items-center justify-center space-x-2
                       transform transition-all duration-300
                       ${!resumeText || !jobDescription || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>

          {/* OUTPUT */}
          {coverLetter && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-slideUp">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Cover Letter</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    {isEditing ? 'Preview' : 'Edit'}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {copySuccess ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8m-4-4h4m-4-4h4M4 6h16v12H4z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <textarea
                    className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-100">{coverLetter}</pre>
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default CoverLetter;
