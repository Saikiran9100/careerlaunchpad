




// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../Navbar/Navbar'; 
// import ClientProjectCard from './ClientProjectCard';
// import { sampleClientProjects } from './sampleClientProjects'; 
// import './ClientAllProjects.css'; 

// const ClientAllProjects = () => {
//   const navigate = useNavigate();
//   const [dbProjects, setDbProjects] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   // --- NEW: Search State ---
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchAllClientProjects = async () => {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Not authenticated. Please log in.');
//         setLoading(false);
//         navigate('/login', { replace: true });
//         return;
//       }

//       try {
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const { data } = await axios.get('http://localhost:5000/api/projects/client', config);
//         setDbProjects(Array.isArray(data) ? data : []); 
//       } catch (err) {
//         console.error('Error fetching all client projects:', err);
//         setError(err.response?.data?.message || 'Failed to load your projects.');
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchAllClientProjects();
//   }, [navigate]); 

//   // --- Combine Data ---
//   const allProjectsRaw = loading ? [] : (() => {
//       const combinedMap = new Map();
//       sampleClientProjects.forEach(proj => combinedMap.set(proj._id, proj)); 
//       dbProjects.forEach(proj => combinedMap.set(proj._id, proj)); 
      
//       return Array.from(combinedMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   })();

//   // --- NEW: Filter Logic (Search) ---
//   const filteredProjects = allProjectsRaw.filter(project => {
//       if (!searchTerm) return true;
//       const title = project.title ? project.title.toLowerCase() : '';
//       return title.includes(searchTerm.toLowerCase());
//   });

//   if (loading) return <><Navbar /><div className="client-all-projects-container loading"><p>Loading projects...</p></div></>;
//   if (error) return <><Navbar /><div className="client-all-projects-container error"><p className="error-message">{error}</p></div></>;

//   return (
//     <div>
//       <Navbar />
//       <div className="client-all-projects-container">
//         <button onClick={() => navigate(-1)} className="back-btn-all-projects">&larr; Go Back</button>
        
//         <div className="all-projects-header" style={{marginBottom:'20px'}}>
//             <h1>All Your Posted Projects</h1>
            
//             {/* --- NEW: Search Input --- */}
//             <div className="search-wrapper" style={{maxWidth:'400px', margin:'10px 0'}}>
//                 <input 
//                     type="text" 
//                     placeholder="Search your projects..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{
//                         width: '100%',
//                         padding: '10px',
//                         borderRadius: '5px',
//                         border: '1px solid #ccc'
//                     }}
//                 />
//             </div>
//         </div>

//         {filteredProjects.length === 0 ? (
//           <p className="no-projects-message">
//               {searchTerm ? "No projects match your search." : "You haven't posted any projects yet."}
//           </p>
//         ) : (
//           <div className="all-client-projects-grid">
//             {filteredProjects.map((project) => (
//               <ClientProjectCard key={project._id} project={project} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClientAllProjects;






import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; 
import ClientProjectCard from './ClientProjectCard';
import { sampleClientProjects } from './sampleClientProjects'; 
import './ClientAllProjects.css'; 

const ClientAllProjects = () => {
  const navigate = useNavigate();
  const [dbProjects, setDbProjects] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllClientProjects = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/projects/client', config);
        setDbProjects(Array.isArray(data) ? data : []); 
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your projects.');
      } finally {
        setLoading(false); 
      }
    };

    fetchAllClientProjects();
  }, [navigate]); 

  // --- Merge Logic for "See All" Page ---
  // Here we also merge, but we show ALL of them (not just limit 4)
  const allProjectsRaw = loading ? [] : (() => {
      // Create a unique list to avoid duplicates if ID conflicts exist
      const combined = [...dbProjects, ...sampleClientProjects];
      
      // Sort: Completed projects at the bottom, then by date
      return combined.sort((a, b) => {
          // If status is different, prioritize 'open' over 'completed'
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
          // Otherwise sort by date
          return new Date(b.createdAt) - new Date(a.createdAt);
      });
  })();

  // --- Filter Logic (Search by Title) ---
  const filteredProjects = allProjectsRaw.filter(project => {
      if (!searchTerm) return true;
      const title = project.title ? project.title.toLowerCase() : '';
      return title.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Navbar />
      <div className="client-all-projects-container">
        <button onClick={() => navigate(-1)} className="back-btn-all-projects">&larr; Go Back</button>
        
        <div className="all-projects-header" style={{marginBottom:'20px'}}>
            <h1>All Your Posted Projects</h1>
            
            {/* --- Search Input --- */}
            <div className="search-wrapper" style={{maxWidth:'400px', margin:'15px 0'}}>
                <input 
                    type="text" 
                    placeholder="Search your projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '30px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        paddingLeft: '20px'
                    }}
                />
            </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
            <>
                {filteredProjects.length === 0 ? (
                <p className="no-projects-message">
                    {searchTerm ? "No projects match your search." : "You haven't posted any projects yet."}
                </p>
                ) : (
                <div className="all-client-projects-grid">
                    {filteredProjects.map((project, index) => (
                    <ClientProjectCard key={project._id || `sample-${index}`} project={project} />
                    ))}
                </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default ClientAllProjects;