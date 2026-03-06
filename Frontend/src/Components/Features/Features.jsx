import React, {useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectList from '../Projects/ProjectList';
import InterviewList from '../Interview/InterviewList';
import Navbar from '../Navbar/Navbar';
import JobList from '../Jobs/JobList';
import './Features.css';

const Features = () => {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    setUserRole(token ? role : null);
  }, [location]);

  return (
    <div className="features-page-wrapper">
      <Navbar/>

      {/* --- CORRECTED CONDITIONAL RENDERING --- */}
      {userRole === 'client' ? (
        // --- 1. View for Clients ---
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
             <h2>Features are for Freelancers and Students</h2>
             <p>Your main features are available on your dashboard.</p>
        </div>

      ) : userRole === 'student' ? (
        // --- 2. View for Students (ProjectList is REMOVED) ---
        <>
          <div className="feature-section" style={{ marginBottom: '4rem' }}>
             <JobList userRole={userRole} />
          </div>
          <div className="feature-section">
            <InterviewList userRole={userRole} />
          </div>
        </>

      ) : (
        // --- 3. View for Freelancers and Logged-Out Users ---
        <>
          <div className="feature-section" style={{ marginBottom: '4rem' }}>
             <ProjectList userRole={userRole} /> {/* "Find Your Next Opportunity" */}
          </div>
          <div className="feature-section" style={{ marginBottom: '4rem' }}>
             <JobList userRole={userRole} />
          </div>
          <div className="feature-section">
            <InterviewList userRole={userRole} />
          </div>
        </>
      )}
      {/* --- END OF CORRECTION --- */}

    </div>
  );
};

export default Features;