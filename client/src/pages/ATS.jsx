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

const ATS = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisType, setAnalysisType] = useState('review');
  const [response, setResponse] = useState('');
  const [score, setScore] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [keywordAnalysis, setKeywordAnalysis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert('Please upload a resume and enter a job description');
      return;
    }

    setIsLoading(true);
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
        return <h3 key={i} style={{ margin: '1.5rem 0 0.5rem 0', color: '#333' }}>
          {section.replace(/\*\*/g, '')}
        </h3>;
      }
      
      if (isList) {
        return (
          <ul key={i} style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
            {section.split('* ').filter(item => item.trim()).map((item, j) => (
              <li key={j} style={{ marginBottom: '0.5rem' }}>{item.trim()}</li>
            ))}
          </ul>
        );
      }
      
      return (
        <p key={i} style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
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
      case 'present': return '✅';
      case 'missing': return '❌';
      case 'partial': return '⚠️';
      default: return '';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>ATS Resume Analyzer</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Upload Resume (PDF)</h3>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setResumeFile(e.target.files[0])}
              style={{ width: '100%', padding: '0.5rem' }}
              disabled={isLoading}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Job Description</h3>
            <textarea
              rows="10"
              style={{ 
                width: '100%', 
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                minHeight: '150px'
              }}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="analysisType" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Analysis Type:
            </label>
            <select
              id="analysisType"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              style={{ 
                padding: '0.75rem',
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
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
            style={{
              padding: '0.75rem 1.5rem',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              fontSize: '1rem',
              width: '100%'
            }}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>

        {score !== null && (
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              background: '#f5f5f5',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <h2 style={{ marginTop: 0 }}>ATS Compatibility Score</h2>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `conic-gradient(#4CAF50 0% ${score}%, #f5f5f5 ${score}% 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                {score}%
              </div>
              <p style={{ 
                textAlign: 'center', 
                marginTop: '1rem',
                fontSize: '1.1rem',
                fontWeight: '500',
                color: score >= 75 ? '#4CAF50' : 
                      score >= 50 ? '#FFC107' : '#F44336'
              }}>
                {score >= 75 ? 'Excellent match!' : 
                 score >= 50 ? 'Good match' : 'Needs improvement'}
              </p>
            </div>
          </div>
        )}
      </div>

      {response && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0 }}>AI Analysis</h2>
          <div style={{ 
            whiteSpace: 'pre-wrap',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: '1.6'
          }}>
            {formatAnalysis(response)}
          </div>
        </div>
      )}

      {heatmapData.length > 0 && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0 }}>Resume Section Heatmap</h2>
          <p style={{ marginBottom: '1rem' }}>
            Keyword matches between your resume and job description by section:
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis label={{ 
                value: 'Keyword Matches', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#666' }
              }} />
              <Tooltip />
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
      )}

      {keywordAnalysis.length > 0 && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '8px'
        }}>
          <h2 style={{ marginTop: 0 }}>Keyword Analysis</h2>
          <p style={{ marginBottom: '1rem' }}>
            Key terms from the job description and their presence in your resume:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{ background: '#e0e0e0' }}>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left',
                    borderBottom: '2px solid #bbb'
                  }}>Keyword</th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left',
                    borderBottom: '2px solid #bbb'
                  }}>Status</th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left',
                    borderBottom: '2px solid #bbb'
                  }}>Found In</th>
                </tr>
              </thead>
              <tbody>
                {keywordAnalysis.map((item, index) => (
                  <tr 
                    key={index} 
                    style={{ 
                      borderBottom: '1px solid #ddd',
                      background: index % 2 === 0 ? '#fafafa' : 'white'
                    }}
                  >
                    <td style={{ 
                      padding: '0.75rem',
                      fontWeight: '500'
                    }}>{item.keyword}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        color: item.status === 'missing' ? '#F44336' :
                               item.status === 'partial' ? '#FFC107' : '#4CAF50',
                        fontWeight: '500'
                      }}>
                        {getStatusIcon(item.status)} {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.section || 'Not found'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATS;