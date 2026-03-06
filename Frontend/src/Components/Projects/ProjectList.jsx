import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // No useLocation needed
import axios from 'axios';
import ProjectCard from './ProjectCard.jsx';
import { sampleProjectData } from './sampleProjectData.jsx';
import './ProjectList.css';

const ProjectList = ({ limit = 4, userRole }) => { // <-- Receives userRole as prop
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem("token");

    // Use the userRole prop to decide
    if (token && userRole === 'freelancer') {
      const fetchOpenProjects = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get('http://localhost:5000/api/projects', config);
          setDbProjects(Array.isArray(data) ? data : []);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load projects.');
        } finally {
          setLoading(false); // <-- Ensures loading stops
        }
      };
      fetchOpenProjects();
    } else {
      // If logged out (userRole=null) or student, just stop loading
      setLoading(false);
    }
  }, [limit, userRole]); // <-- CORRECTED: Depend on userRole prop

  // --- Combine Data Based on Role ---
  let allProjects = [];
  if (userRole === 'freelancer') {
    const combinedMap = new Map();
    sampleProjectData.forEach(proj => combinedMap.set(`sample-${proj.id}`, proj));
    dbProjects.forEach(proj => combinedMap.set(proj._id, proj));
    allProjects = Array.from(combinedMap.values());
  } else {
    // Only show sample data for logged-out users (userRole=null)
    allProjects = sampleProjectData;
  }
  
  const displayProjects = allProjects.slice(0, limit);

  return (
    <div className="project-section-wrapper page-section">
      <div className="container">
         <div className="project-header">
           <h1 className="project-title">Find Your Latest Job</h1>
           <div className="header-buttons">
             <Link to="/project" className="see-more-link">
               See more &rarr;
             </Link>
           </div>
         </div>

         {loading && <p>Loading opportunities...</p>}
         {error && <p className="error-message">{error}</p>}

         {!loading && !error && (
            <>
              {displayProjects.length === 0 ? (
                 <p>No open projects available right now.</p>
              ) : (
                 <div className="project-grid">
                   {displayProjects.map((proj) => (
                     <ProjectCard key={proj._id || `sample-${proj.id}`} project={proj} />
                   ))}
                 </div>
              )}
            </>
         )}
      </div>
    </div>
  );
};

export default ProjectList;