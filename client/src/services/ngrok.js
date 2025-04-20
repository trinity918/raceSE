// This code would go in your frontend React application
// For example, in your src/api.js file or within a component

// Example with fetch API
async function sendResumeDataWithFetch(resumeData) {
    const ngrokUrl = 'https://d9ad-103-104-226-58.ngrok-free.app ';
    
    try {
      const response = await fetch(`${ngrokUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Success:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  // Example with axios (which you already have in your project)
  import axios from 'axios';
  
  async function sendResumeDataWithAxios(resumeData) {
    const ngrokUrl = 'https://4aba-103-104-226-58.ngrok-free.app';
    
    try {
      const response = await axios.post(`${ngrokUrl}/generate-resume`, resumeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
  
  // Example of how you might use this in a React component
  // This could be part of your ResumeBuilder.jsx file
  
  import React, { useState } from 'react';
  import { sendResumeDataWithAxios } from '../api'; // Adjust path as needed
  
  function ResumeBuilder() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      setError(null);
      
      // Example resume data that would come from your form
      const resumeData = {
        personalInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          address: "123 Main St, City, Country"
        },
        education: [
          {
            institution: "University of Example",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2016-09",
            endDate: "2020-05"
          }
        ],
        experience: [
          {
            company: "Tech Company",
            position: "Software Developer",
            startDate: "2020-06",
            endDate: "Present",
            description: "Developed web applications using React and Node.js"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL"]
      };
      
      try {
        const response = await sendResumeDataWithAxios(resumeData);
        setResult(response);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div>
        <h1>Resume Builder</h1>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Resume'}
        </button>
        
        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className="result">
            <h2>Success!</h2>
            <p>Resume ID: {result.resume_id}</p>
            <p>{result.message}</p>
          </div>
        )}
      </div>
    );
  }
  
  export default ResumeBuilder;
  
  // You can also test this with a simple HTML file if needed
  /*
  <!DOCTYPE html>
  <html>
  <head>
    <title>Test Ngrok POST Request</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  </head>
  <body>
    <h1>Test POST Request via Ngrok</h1>
    <button id="testButton">Send Test Data</button>
    <pre id="result"></pre>
  
    <script>
      document.getElementById('testButton').addEventListener('click', async () => {
        const ngrokUrl = 'https://4aba-103-104-226-58.ngrok-free.app';
        const resumeData = {
          personalInfo: { name: "John Doe", email: "john@example.com" },
          skills: ["JavaScript", "React", "Python"]
        };
        
        try {
          const response = await axios.post(`${ngrokUrl}/generate-resume`, resumeData);
          document.getElementById('result').textContent = JSON.stringify(response.data, null, 2);
        } catch (error) {
          document.getElementById('result').textContent = 'Error: ' + 
            (error.response ? JSON.stringify(error.response.data) : error.message);
        }
      });
    </script>
  </body>
  </html>
  */