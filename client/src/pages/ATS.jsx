import React, { useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ATS = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisType, setAnalysisType] = useState('review');
  const [response, setResponse] = useState('');
  const [score, setScore] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [keywordAnalysis, setKeywordAnalysis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert('Please upload a resume and enter a job description');
      return;
    }

    setIsLoading(true);
    setActiveTab('results');
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    formData.append('analysisType', analysisType);

    try {
      const { data } = await axios.post('/api/analyze', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        timeout: 15000
      });

      setResponse(data.analysis);
      setScore(data.score);

      if (data.heatmap) {
        const formatted = Object.entries(data.heatmap).map(([section, value]) => ({
          section: section.charAt(0).toUpperCase() + section.slice(1),
          value,
          status: value > 5 ? 'high' : value > 2 ? 'medium' : 'low'
        }));
        setHeatmapData(formatted);
      }

      setKeywordAnalysis(data.keywordAnalysis || []);

    } catch (error) {
      console.error('Error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      alert(error.response?.data?.error || 'Failed to analyze resume. Please try again.');
      setActiveTab('input');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAnalysis = (text) => {
    if (!text) return null;
    
    return text.split('\n\n').map((section, i) => {
      const isHeader = section.startsWith('**') && section.endsWith('**');
      const isList = section.includes('* ');
      
      if (isHeader) {
        return <h3 key={i} className="text-xl font-semibold mt-6 mb-2 text-blue-800">
          {section.replace(/\*\*/g, '')}
        </h3>;
      }
      
      if (isList) {
        return (
          <ul key={i} className="mb-4 pl-6 list-disc">
            {section.split('* ').filter(item => item.trim()).map((item, j) => (
              <li key={j} className="mb-2">{item.trim()}</li>
            ))}
          </ul>
        );
      }
      
      return (
        <p key={i} className="mb-4 leading-relaxed">
          {section}
        </p>
      );
    });
  };

  const getColor = (status) => {
    switch (status) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'low': return '#F44336';
      default: return '#82ca9d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="inline mr-1" size={16} color="#4CAF50" />;
      case 'missing': return <XCircle className="inline mr-1" size={16} color="#F44336" />;
      case 'partial': return <AlertTriangle className="inline mr-1" size={16} color="#FFC107" />;
      default: return null;
    }
  };

  const renderInputForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-3">Resume Analysis Tool</h2>
      
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2 text-gray-700">
          Upload Resume (PDF)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="mx-auto text-blue-500 mb-2" size={32} />
          <p className="mb-2 text-sm text-gray-600">Drag & drop your PDF resume or</p>
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="hidden"
            disabled={isLoading}
          />
          <label 
            htmlFor="resumeUpload" 
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors inline-block"
          >
            Browse Files
          </label>
          {resumeFile && (
            <div className="mt-3 flex items-center justify-center">
              <FileText size={16} className="text-blue-500 mr-2" />
              <span className="text-sm text-gray-700">{resumeFile.name}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2 text-gray-700">
          Job Description
        </label>
        <textarea
          rows="10"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="analysisType" className="block text-lg font-medium mb-2 text-gray-700">
          Analysis Type
        </label>
        <select
          id="analysisType"
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
          disabled={isLoading}
        >
          <option value="review">Comprehensive Review</option>
          <option value="skills">Skills Gap Analysis</option>
          <option value="match">ATS Match Score</option>
          <option value="tips">Interview Preparation</option>
        </select>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full py-3 px-6 text-lg font-medium rounded-lg transition-all ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-8">
      {/* Score Card */}
      {score !== null && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-3">ATS Compatibility Score</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              {/* Score Circle */}
              <div className="w-full h-full rounded-full bg-gray-100"></div>
              <div 
                className="absolute top-0 left-0 w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(${
                    score >= 75 ? '#4CAF50' : score >= 50 ? '#FFC107' : '#F44336'
                  } 0% ${score}%, transparent ${score}% 100%)`
                }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-white rounded-full w-36 h-36 flex items-center justify-center">
                  <span className="text-4xl font-bold">{score}%</span>
                </div>
              </div>
            </div>
            <p className={`text-xl font-semibold ${
              score >= 75 ? 'text-green-600' : 
              score >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {score >= 75 ? 'Excellent match!' : 
               score >= 50 ? 'Good match' : 'Needs improvement'}
            </p>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {response && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-3">AI Analysis</h2>
          <div className="prose max-w-none">
            {formatAnalysis(response)}
          </div>
        </div>
      )}

      {/* Heatmap */}
      {heatmapData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-3">Resume Section Heatmap</h2>
          <p className="mb-4 text-gray-700">
            Keyword matches between your resume and job description by section:
          </p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmapData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="section" />
                <YAxis label={{ 
                  value: 'Keyword Matches', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#666' }
                }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" name="Keyword Matches">
                  {heatmapData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getColor(entry.status)} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Keyword Analysis */}
      {keywordAnalysis.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-3">Keyword Analysis</h2>
          <p className="mb-4 text-gray-700">
            Key terms from the job description and their presence in your resume:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Keyword</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Found In</th>
                </tr>
              </thead>
              <tbody>
                {keywordAnalysis.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="py-3 px-4 font-medium">{item.keyword}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center font-medium ${
                        item.status === 'missing' ? 'text-red-600' :
                        item.status === 'partial' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.section || 'Not found'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setActiveTab('input')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all shadow"
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        <SideBar />
        
        <main className="flex-1 p-4 pt-20 lg:p-6 lg:pt-20 lg:ml-64 overflow-auto">
        <div className="max-w-6xl mx-auto ml-16">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">ATS Resume Analyzer</h1>
              <p className="text-gray-600 mt-2">Upload your resume and job description to get AI-powered insights</p>
            </div>
            
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 md:py-3 md:px-6 font-medium transition-colors ${
                    activeTab === 'input' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('input')}
                  disabled={isLoading}
                >
                  Input
                </button>
                <button
                  className={`py-2 px-4 md:py-3 md:px-6 font-medium transition-colors ${
                    activeTab === 'results' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('results')}
                  disabled={isLoading || (!response && !score)}
                >
                  Results
                </button>
              </div>
            </div>
            
            {activeTab === 'input' ? renderInputForm() : renderResults()}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default ATS;