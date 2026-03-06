// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from 'axios';
// import Navbar from '../Navbar/Navbar'; // Adjust path
// import ProjectCard from './ProjectCard'; // Use the correct card
// import { sampleProjectData } from './sampleProjectData.jsx'; // Import sample data
// import './AllProjects.css'; // Ensure CSS exists

// const AllProjects = () => {
//   const navigate = useNavigate();
//   const [dbProjects, setDbProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     const role = localStorage.getItem("userRole");
//     const token = localStorage.getItem("token");
//     const currentRole = token ? role : null;
//     setUserRole(currentRole);

//     setLoading(true);
//     setError('');

//     // Fetch data if freelancer
//     if (token && currentRole === 'freelancer') {
//       const fetchAllProjects = async () => {
//         try {
//           const config = { headers: { Authorization: `Bearer ${token}` } };
//           const { data } = await axios.get('http://localhost:5000/api/projects', config);
//           setDbProjects(Array.isArray(data) ? data : []);
//         } catch (err) {
//           setError(err.response?.data?.message || 'Failed to load projects.');
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchAllProjects();
//     } else if (token && currentRole !== 'freelancer') {
//       // Logged in but not as freelancer (e.g., client)
//       setError("This page is for freelancers. Please check your dashboard.");
//       setLoading(false);
//     } else {
//       // Logged-out user
//       setLoading(false);
//     }
//   }, []);

//   // --- Combine Data Based on Role ---
//   let allProjects = [];
//   if (userRole === 'freelancer') {
//     const combinedMap = new Map();
//     sampleProjectData.forEach(proj => combinedMap.set(`sample-${proj.id}`, proj));
//     dbProjects.forEach(proj => combinedMap.set(proj._id, proj));
//     allProjects = Array.from(combinedMap.values());
//   } else {
//     // Only show sample data for logged-out users
//     allProjects = sampleProjectData;
//   }
  
//   return (
//     <div>
//       <Navbar />
//       <div className="all-projects-wrapper">
//         <button onClick={() => navigate(-1)} className="back-btn-page">
//            &larr; Go Back
//         </button>
//         <h1 className="page-title">All Available Projects</h1>

//         {loading && <p>Loading projects...</p>}
//         {error && <p className="error-message">{error}</p>}

//         {!loading && !error && (
//           <div className="all-projects-grid">
//             {allProjects.length > 0 ? (
//               allProjects.map((proj) => (
//                 <ProjectCard 
//                   key={proj._id || `sample-${proj.id}`} 
//                   project={proj} 
//                 />
//               ))
//             ) : (
//               <p>No open projects available right now.</p>
//             )}
//           </div>
//         )}
        
//         {/* Special message for logged-out users */}
//         {!loading && !userRole && !error && (
//             <p style={{textAlign: 'center', marginTop: '1rem'}}>
//                 <Link to="/login">Log in as a freelancer</Link> to see live projects from clients.
//             </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllProjects;




import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import ProjectCard from './ProjectCard';
import { sampleProjectData } from './sampleProjectData.jsx';
import './AllProjects.css';

const AllProjects = () => {
  const navigate = useNavigate();
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    const currentRole = token ? role : null;
    setUserRole(currentRole);

    setLoading(true);
    setError('');

    if (token && currentRole === 'freelancer') {
      const fetchAllProjects = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get('http://localhost:5000/api/projects', config);
          setDbProjects(Array.isArray(data) ? data : []);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load projects.');
        } finally {
          setLoading(false);
        }
      };
      fetchAllProjects();
    } else if (token && currentRole !== 'freelancer') {
      setError("This page is for freelancers. Please check your dashboard.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Combine Data
  let allProjects = [];
  if (userRole === 'freelancer') {
    const combinedMap = new Map();
    sampleProjectData.forEach(proj => combinedMap.set(`sample-${proj.id}`, proj));
    dbProjects.forEach(proj => combinedMap.set(proj._id, proj));
    allProjects = Array.from(combinedMap.values());
  } else {
    allProjects = sampleProjectData;
  }

  const filteredProjects = allProjects.filter((proj) => {
    // 1. SAFELY Get Title and Description for Domain Search
    const title = proj.title ? proj.title.toString().toLowerCase() : "";
    const description = proj.description ? proj.description.toString().toLowerCase() : "";
    const searchLower = searchTerm.toLowerCase();

    // 2. Search Check
    const matchesSearch = title.includes(searchLower) || description.includes(searchLower);

    // 3. Skill Check (Using includes for partial matching)
    // If skillFilter is "react", it will match "React", "ReactJS", "React Native"
    const skillSearchLower = skillFilter.toLowerCase();
    
    const matchesSkill = skillFilter === "" || 
        (proj.skillsRequired && proj.skillsRequired.some(skill => 
            skill && skill.toLowerCase().includes(skillSearchLower)
        ));

    return matchesSearch && matchesSkill;
  });
  
  return (
    <div>
      <Navbar />
      <div className="all-projects-wrapper">
        <button onClick={() => navigate(-1)} className="back-btn-page">
           &larr; Go Back
        </button>
        
        <div className="projects-header-section">
            <h1 className="page-title">All Available Projects</h1>
            
            <div className="filter-container">
                {/* Search Box (Domain) */}
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Search Domain (e.g. Web, AI)..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="project-search-input"
                    />
                    <span className="search-icon-p">🔍</span>
                </div>

                {/* Skill Filter Input (Changed from Dropdown) */}
                <div className="skill-box">
                    <input 
                        type="text" 
                        placeholder="Filter by Skill (e.g. React)..." 
                        value={skillFilter} 
                        onChange={(e) => setSkillFilter(e.target.value)}
                        className="project-search-input" // Reusing the same style class
                        style={{ paddingLeft: '20px' }} // Small adjustment since no icon here
                    />
                </div>
            </div>
        </div>

        {loading && <p>Loading projects...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="all-projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((proj) => (
                <ProjectCard 
                  key={proj._id || `sample-${proj.id}`} 
                  project={proj} 
                />
              ))
            ) : (
              <div className="no-results">
                  <p>No projects match your search.</p>
                  <button 
                    className="clear-filter-btn"
                    onClick={() => { setSearchTerm(""); setSkillFilter(""); }}
                  >
                    Clear Filters
                  </button>
              </div>
            )}
          </div>
        )}
        
        {!loading && !userRole && !error && (
            <p style={{textAlign: 'center', marginTop: '2rem'}}>
                <Link to="/login" style={{color: '#007bff', fontWeight: 'bold'}}>Log in as a freelancer</Link> to see live projects from clients.
            </p>
        )}
      </div>
    </div>
  );
};

export default AllProjects;