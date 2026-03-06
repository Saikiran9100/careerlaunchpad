



// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import ClientProjectCard from './ClientProjectCard';
// import { sampleClientProjects } from './sampleClientProjects';
// import './ClientProjectList.css';

// const ClientProjectList = ({ limit = 4, userRole }) => {
//   const [dbProjects, setDbProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const location = useLocation();

//   useEffect(() => {
//     setLoading(true);
//     setError('');
//     const token = localStorage.getItem('token');
       
//     if (token && userRole === 'client') {
//        const fetchClientProjects = async () => {
//          try {
//              const config = { headers: { Authorization: `Bearer ${token}` } };
//              const { data } = await axios.get('http://localhost:5000/api/projects/client', config);
//              setDbProjects(Array.isArray(data) ? data : []);
//          } catch (err) {
//              console.error("Error loading projects", err);
//              // Don't set error text here, so we can fallback to sample data gracefully
//          } finally {
//              setLoading(false);
//          }
//        };
//        fetchClientProjects();
//     } else {
//       setLoading(false); 
//     }
//   }, [limit, userRole, location.pathname]);

//   // --- LOGIC FIX: Fallback to Sample Data ---
//   const projectsSource = (dbProjects.length > 0) ? dbProjects : sampleClientProjects;

//   // Filter only 'open' projects
//   const openProjects = projectsSource.filter(p => p.status === 'open');

//   // Sort by newest first
//   const sortedProjects = openProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   // Limit number of items
//   const displayProjects = sortedProjects.slice(0, limit);

//   return (
//     <div className="client-project-list-container page-section">
//       <div className="container">
//          <div className="list-header">
//            <h2>Your Latest Posted Projects (Open)</h2>
//            <Link to="/client/all-projects" className="see-more-link">See all &rarr;</Link>
//          </div>

//          {loading && <p>Loading your projects...</p>}
//          {error && <p className="error-message">{error}</p>}

//          {!loading && !error && (
//            <>
//              {displayProjects.length > 0 ? (
//                <div className="client-project-cards-grid">
//                  {displayProjects.map((project) => (
//                    <ClientProjectCard key={project._id || project.id} project={project} />
//                  ))}
//                </div>
//              ) : (
//                 <p>You have no open projects. <Link to="/allocate-project" className="link-text">Allocate one now!</Link></p>
//              )}
//            </>
//          )}
//       </div>
//     </div>
//   );
// };

// export default ClientProjectList;




import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ClientProjectCard from './ClientProjectCard';
import { sampleClientProjects } from './sampleClientProjects';
import './ClientProjectList.css';

const ClientProjectList = ({ limit = 3, userRole }) => { // <-- Default limit set to 3
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
       
    if (token && userRole === 'client') {
       const fetchClientProjects = async () => {
         try {
             const config = { headers: { Authorization: `Bearer ${token}` } };
             const { data } = await axios.get('http://localhost:5000/api/projects/client', config);
             // Filter for OPEN projects only
             const openOnly = Array.isArray(data) ? data.filter(p => p.status === 'open') : [];
             setDbProjects(openOnly);
         } catch (err) {
             console.error("Error loading projects", err);
         } finally {
             setLoading(false);
         }
       };
       fetchClientProjects();
    } else {
      setLoading(false); 
    }
  }, [limit, userRole, location.pathname]);

  // --- LOGIC: Merge DB + Sample Data ---
  
  // 1. Sort DB projects by date (newest first)
  const sortedDbProjects = dbProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 2. Combine: DB Projects FIRST, then fill remaining slots with Sample Projects
  // We explicitly filter sample projects for 'open' status just to be safe
  const openSampleProjects = sampleClientProjects.filter(p => p.status === 'open');
  const allMixedProjects = [...sortedDbProjects, ...openSampleProjects];

  // 3. Slice to get exactly the 'limit' (e.g., 3 cards)
  // Logic: If DB has 1 project, it takes 1 DB + 2 Sample = 3 Total
  const displayProjects = allMixedProjects.slice(0, limit);

  return (
    <div className="client-project-list-container page-section">
      <div className="container">
         <div className="list-header">
           <h2>Your Latest Posted Projects (Open)</h2>
           <Link to="/client/all-projects" className="see-more-link">See all &rarr;</Link>
         </div>

         {loading && <p>Loading your projects...</p>}
         
         {!loading && (
           <>
             {displayProjects.length > 0 ? (
               <div className="client-project-cards-grid">
                 {displayProjects.map((project, index) => (
                   // Use index in key fallback to prevent duplicate key errors
                   <ClientProjectCard key={project._id || `sample-${index}`} project={project} />
                 ))}
               </div>
             ) : (
                <p>You have no open projects. <Link to="/allocate-project" className="link-text">Allocate one now!</Link></p>
             )}
           </>
         )}
      </div>
    </div>
  );
};

export default ClientProjectList;