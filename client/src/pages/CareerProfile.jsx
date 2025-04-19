// src/pages/CareerProfile.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CareerProfile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Apply dark mode when toggled
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial resume data
  const [resumeData, setResumeData] = useState({
    name: "Jake Ryan",
    phone: "123-456-7890",
    email: "jake@su.edu",
    linkedin: "linkedin.com/in/jake",
    github: "github.com/jake",
    education: [
      {
        institution: "Southwestern University",
        location: "Georgetown, TX",
        degree: "Bachelor of Arts in Computer Science, Minor in Business",
        dates: "Aug. 2018 -- May 2021"
      },
      {
        institution: "Blinn College",
        location: "Bryan, TX",
        degree: "Associate's in Liberal Arts",
        dates: "Aug. 2014 -- May 2018"
      }
    ],
    experience: [
      {
        title: "Undergraduate Research Assistant",
        company: "Texas A and M University",
        location: "College Station, TX",
        dates: "June 2020 -- Present",
        details: [
          "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
          "Developed a full-stack web app using Flask, React, PostgreSQL, Docker",
          "Explored ways to visualize GitHub collaboration in classrooms"
        ]
      },
      {
        title: "Information Technology Support Specialist",
        company: "Southwestern University",
        location: "Georgetown, TX",
        dates: "Sep. 2018 -- Present",
        details: [
          "Communicated with managers to set up campus computers",
          "Troubleshot issues for students, faculty, and staff",
          "Maintained computers and 200 printers across campus"
        ]
      }
    ],
    projects: [
      {
        name: "Gitlytics",
        stack: "Python, Flask, React, PostgreSQL, Docker",
        dates: "June 2020 -- Present",
        details: [
          "Developed full-stack app with Flask (REST API) and React frontend",
          "Implemented GitHub OAuth and visualized collaboration data",
          "Used Celery + Redis for async tasks"
        ]
      },
      {
        name: "Simple Paintball",
        stack: "Spigot API, Java, Maven, TravisCI, Git",
        dates: "May 2018 -- May 2020",
        details: [
          "Built Minecraft server plugin, 2K+ downloads and 4.5+ star rating",
          "CI/CD with TravisCI on releases",
          "Collaborated with community for feedback and improvements"
        ]
      }
    ],
    skills: {
      languages: "Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R",
      frameworks: "React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI",
      tools: "Git, Docker, TravisCI, GCP, VS Code, PyCharm, IntelliJ, Eclipse",
      libraries: "pandas, NumPy, Matplotlib"
    }
  });

  // Calculate profile completeness
  const calculateCompleteness = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Check basic info
    if (resumeData.name) completedFields++;
    if (resumeData.phone) completedFields++;
    if (resumeData.email) completedFields++;
    if (resumeData.linkedin) completedFields++;
    if (resumeData.github) completedFields++;
    totalFields += 5;

    // Check education
    if (resumeData.education.length > 0) completedFields++;
    totalFields++;

    // Check experience
    if (resumeData.experience.length > 0) completedFields++;
    totalFields++;

    // Check projects
    if (resumeData.projects.length > 0) completedFields++;
    totalFields++;

    // Check skills
    if (resumeData.skills.languages) completedFields++;
    if (resumeData.skills.frameworks) completedFields++;
    if (resumeData.skills.tools) completedFields++;
    if (resumeData.skills.libraries) completedFields++;
    totalFields += 4;

    return Math.round((completedFields / totalFields) * 100);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSkillsChange = (e, field) => {
    const { value } = e.target;
    setResumeData(prevData => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        [field]: value
      }
    }));
  };

  const handleArrayChange = (e, index, field, arrayName) => {
    const { name, value } = e.target;
    setResumeData(prevData => {
      const updatedArray = [...prevData[arrayName]];
      if (name === 'detail') {
        updatedArray[index].details[field] = value;
      } else {
        updatedArray[index][name] = value;
      }
      return {
        ...prevData,
        [arrayName]: updatedArray
      };
    });
  };

  const addNewItem = (arrayName) => {
    const newItem = arrayName === 'education' 
      ? { institution: '', location: '', degree: '', dates: '' }
      : arrayName === 'experience'
      ? { title: '', company: '', location: '', dates: '', details: [''] }
      : { name: '', stack: '', dates: '', details: [''] };
    
    setResumeData(prevData => ({
      ...prevData,
      [arrayName]: [...prevData[arrayName], newItem]
    }));
  };

  const removeItem = (arrayName, index) => {
    setResumeData(prevData => ({
      ...prevData,
      [arrayName]: prevData[arrayName].filter((_, i) => i !== index)
    }));
  };

  const addDetail = (arrayName, index) => {
    setResumeData(prevData => {
      const updatedArray = [...prevData[arrayName]];
      updatedArray[index].details.push('');
      return {
        ...prevData,
        [arrayName]: updatedArray
      };
    });
  };

  const removeDetail = (arrayName, itemIndex, detailIndex) => {
    setResumeData(prevData => {
      const updatedArray = [...prevData[arrayName]];
      updatedArray[itemIndex].details = updatedArray[itemIndex].details.filter((_, i) => i !== detailIndex);
      return {
        ...prevData,
        [arrayName]: updatedArray
      };
    });
  };

  const profileCompleteness = calculateCompleteness();
  const jobApplicationProgress = 66; // Mock value for job applications

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <main className="lg:ml-64 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Career Profile</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Update your career information to enhance your profile and resume
            </p>
          </div>

          {/* Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Profile Completeness</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{profileCompleteness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${profileCompleteness}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Job Applications Progress</span>
                <span className="font-medium text-green-600 dark:text-green-400">8/12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${jobApplicationProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
            {/* Personal Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={resumeData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={resumeData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={resumeData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={resumeData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={resumeData.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
                <button
                  onClick={() => addNewItem('education')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Education
                </button>
              </div>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg relative">
                  <button
                    onClick={() => removeItem('education', index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                      <input
                        type="text"
                        name="institution"
                        value={edu.institution}
                        onChange={(e) => handleArrayChange(e, index, null, 'education')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={edu.location}
                        onChange={(e) => handleArrayChange(e, index, null, 'education')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange(e, index, null, 'education')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dates</label>
                      <input
                        type="text"
                        name="dates"
                        value={edu.dates}
                        onChange={(e) => handleArrayChange(e, index, null, 'education')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Experience Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Experience</h2>
                <button
                  onClick={() => addNewItem('experience')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Experience
                </button>
              </div>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg relative">
                  <button
                    onClick={() => removeItem('experience', index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={exp.title}
                        onChange={(e) => handleArrayChange(e, index, null, 'experience')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleArrayChange(e, index, null, 'experience')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={exp.location}
                        onChange={(e) => handleArrayChange(e, index, null, 'experience')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dates</label>
                      <input
                        type="text"
                        name="dates"
                        value={exp.dates}
                        onChange={(e) => handleArrayChange(e, index, null, 'experience')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
                      <button
                        onClick={() => addDetail('experience', index)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        + Add Detail
                      </button>
                    </div>
                    {exp.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex gap-2">
                        <input
                          type="text"
                          name="detail"
                          value={detail}
                          onChange={(e) => handleArrayChange(e, index, detailIndex, 'experience')}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <button
                          onClick={() => removeDetail('experience', index, detailIndex)}
                          className="px-3 py-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Projects Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h2>
                <button
                  onClick={() => addNewItem('projects')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Project
                </button>
              </div>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg relative">
                  <button
                    onClick={() => removeItem('projects', index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                      <input
                        type="text"
                        name="name"
                        value={project.name}
                        onChange={(e) => handleArrayChange(e, index, null, 'projects')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stack</label>
                      <input
                        type="text"
                        name="stack"
                        value={project.stack}
                        onChange={(e) => handleArrayChange(e, index, null, 'projects')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dates</label>
                      <input
                        type="text"
                        name="dates"
                        value={project.dates}
                        onChange={(e) => handleArrayChange(e, index, null, 'projects')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
                      <button
                        onClick={() => addDetail('projects', index)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        + Add Detail
                      </button>
                    </div>
                    {project.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex gap-2">
                        <input
                          type="text"
                          name="detail"
                          value={detail}
                          onChange={(e) => handleArrayChange(e, index, detailIndex, 'projects')}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <button
                          onClick={() => removeDetail('projects', index, detailIndex)}
                          className="px-3 py-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Skills Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Languages</label>
                  <input
                    type="text"
                    value={resumeData.skills.languages}
                    onChange={(e) => handleSkillsChange(e, 'languages')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frameworks</label>
                  <input
                    type="text"
                    value={resumeData.skills.frameworks}
                    onChange={(e) => handleSkillsChange(e, 'frameworks')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tools</label>
                  <input
                    type="text"
                    value={resumeData.skills.tools}
                    onChange={(e) => handleSkillsChange(e, 'tools')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libraries</label>
                  <input
                    type="text"
                    value={resumeData.skills.libraries}
                    onChange={(e) => handleSkillsChange(e, 'libraries')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => console.log('Save Profile:', resumeData)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerProfile;