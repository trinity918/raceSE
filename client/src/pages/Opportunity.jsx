// src/pages/OpportunitySync.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Fuzzy matching function for skills
const fuzzyMatch = (skill, requiredSkill) => {
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedSkill = normalize(skill);
  const normalizedRequired = normalize(requiredSkill);
  
  // Check exact match or if one contains the other
  if (normalizedSkill === normalizedRequired || 
      normalizedSkill.includes(normalizedRequired) || 
      normalizedRequired.includes(normalizedSkill)) {
    return true;
  }
  
  // Check for common variations (e.g., javascript vs js)
  const variations = {
    'javascript': ['js', 'javascript', 'ecmascript'],
    'typescript': ['ts', 'typescript'],
    'nodejs': ['node', 'nodejs', 'node.js'],
    'reactjs': ['react', 'reactjs', 'react.js'],
    'postgres': ['postgresql', 'postgres', 'pg'],
    'sql': ['sql', 'mysql', 'sqlite', 'mssql'],
    'springboot': ['spring', 'springboot', 'spring boot', 'spring-boot']
  };
  
  for (const [key, values] of Object.entries(variations)) {
    if (values.includes(normalizedSkill) && values.includes(normalizedRequired)) {
      return true;
    }
  }
  
  return false;
};

const OpportunitySync = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Hardcoded user skills (later from resume)
  const userProfile = {
    name: "Jake Ryan",
    title: "Software Developer",
    experience: 3,
    skills: ["React", "Node.js", "JavaScript", "SQL", "Python", "Git"],
    education: "B.Tech in Computer Science",
    summary: "Full-stack developer with 3 years of experience building web applications"
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs from JSON file
        const jobsResponse = await fetch('/dataset/jobs.json');
        const jobsData = await jobsResponse.json();
        
        // Calculate match scores
        const jobsWithScores = jobsData.map(job => {
          const matchedSkills = job.requiredSkills.filter(requiredSkill => 
            userProfile.skills.some(userSkill => fuzzyMatch(userSkill, requiredSkill))
          );
          const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
          
          return {
            ...job,
            id: Math.random().toString(36).substr(2, 9), // Generate unique ID
            matchedSkills,
            missingSkills: job.requiredSkills.filter(skill => !matchedSkills.includes(skill)),
            matchScore
          };
        });
        
        // Sort jobs by match score
        const sortedJobs = jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
        setJobs(sortedJobs);
        
        // Fetch courses from JSON file
        const coursesResponse = await fetch('/dataset/courses.json');
        const coursesData = await coursesResponse.json();
        setAllCourses(coursesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const findRecommendedCourses = (missingSkills) => {
    const recommendations = [];
    
    missingSkills.forEach(skill => {
      // Find courses that match the missing skill
      const matchingCourses = allCourses.filter(course => {
        const courseNameWords = course.courseName.toLowerCase().split(' ');
        const skillWords = skill.toLowerCase().split(' ');
        
        // Check if course name contains the skill
        return skillWords.some(word => 
          courseNameWords.some(courseWord => courseWord.includes(word))
        );
      });
      
      // Add the best matching courses (sorted by rating)
      const topCourses = matchingCourses
        .sort((a, b) => b.courseRating - a.courseRating)
        .slice(0, 2); // Get top 2 courses for each skill
      
      recommendations.push(...topCourses);
    });
    
    // Remove duplicates and return
    return [...new Map(recommendations.map(item => [item.courseName, item])).values()];
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    const recommendedCourses = findRecommendedCourses(job.missingSkills);
    setCourses(recommendedCourses);
  };

  // Components

  const ProfileCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Update Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{userProfile.name}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{userProfile.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.summary}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience: {userProfile.experience} Years</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Education: {userProfile.education}</p>
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job, onClick }) => (
    <div 
      onClick={() => onClick(job)}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
        selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.jobTitle}</h3>
          <p className="text-gray-600 dark:text-gray-400">{job.company} • {job.location}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{job.jobType}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{job.salaryRange}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Score</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{job.matchScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              job.matchScore >= 80 ? 'bg-green-500' : 
              job.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${job.matchScore}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requiredSkills.map((skill, index) => (
          <span 
            key={index} 
            className={`px-3 py-1 rounded-full text-sm ${
              job.matchedSkills.includes(skill) 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Apply Now
      </button>
    </div>
  );

  const SkillGapCard = ({ job }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Skill Gap Analysis: {job.jobTitle}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3">Matched Skills</h4>
          {job.matchedSkills.map((skill, index) => (
            <div key={index} className="flex items-center mb-2">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{skill}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3">Missing Skills</h4>
          {job.missingSkills.map((skill, index) => (
            <div key={index} className="flex items-center mb-2">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.courseName}</h3>
          <p className="text-gray-600 dark:text-gray-400">{course.courseProvider} • {course.courseTeacher}</p>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-300">{course.courseRating}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{course.courseDuration}</span>
        </div>
        <span className="font-bold text-green-600 dark:text-green-400">{course.coursePrice}</span>
      </div>
      
      <a 
        href={course.courseLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Enroll Now
      </a>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <main className="lg:ml-64 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Opportunity Sync & Gap Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get matched with the best roles and bridge skill gaps with personalized course recommendations.
            </p>
          </div>

          {/* Profile Snapshot */}
          <ProfileCard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Matches */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Matched Jobs</h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {jobs.map(job => (
                    <JobCard key={job.id} job={job} onClick={handleJobSelect} />
                  ))}
                </div>
              )}
            </div>

            {/* Skill Gap & Courses */}
            <div>
              {selectedJob ? (
                <>
                  <div className="mb-8">
                    <SkillGapCard job={selectedJob} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Recommended Courses
                  </h2>
                  <div className="space-y-6">
                    {courses.map((course, index) => (
                      <CourseCard key={index} course={course} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Select a Job
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click on a job card to see skill gap analysis and course recommendations
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OpportunitySync;