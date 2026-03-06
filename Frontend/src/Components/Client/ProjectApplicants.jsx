// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../Navbar/Navbar';
// import StudentProfileCard from './StudentProfileCard';
// import './ProjectApplicants.css';

// const ProjectApplicants = () => {
//   const { id } = useParams(); // Get project ID
//   const navigate = useNavigate();
//   // --- Store the full APPLICATION objects ---
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [projectName, setProjectName] = useState('');

//   // --- State to force re-fetch after an action ---
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');
//       if (!token) { /* ... auth check ... */ }
      
//       try {
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const { data } = await axios.get(`http://localhost:5000/api/projects/${id}/applicants`, config);
        
//         setApplications(data.applications || []); 
//         setProjectName(data.projectTitle || ''); 
        
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load applicants.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchApplicants();
//   }, [id, navigate, refresh]); // <-- Add 'refresh' as dependency

//   // Callback function to be passed to the card
//   const onApplicantAction = () => {
//       // This will trigger the useEffect to run again,
//       // refreshing the list of applicants
//       setRefresh(prev => !prev); 
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="applicants-container">
//         <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>
//         <h1 className="page-title">Applicants {projectName && `for "${projectName}"`}</h1>

//         {loading && <p>Loading applicants...</p>}
//         {error && <p className="error-message">{error}</p>}
        
//         {!loading && !error && (
//           <div className="applicants-grid">
//             {applications.length > 0 ? (
//               applications.map(app => (
//                 // Filter out applicants who are not in 'applied' status
//                 // Or just show their status visually in the card
//                 app.applicantId ? ( // Ensure applicant profile exists
//                   <StudentProfileCard 
//                       key={app._id} 
//                       application={app} // Pass the full application
//                       profile={app.applicantId} // Pass the populated profile
//                       onAction={onApplicantAction} // Pass the callback
//                   />
//                 ) : null
//               ))
//             ) : (
//               <p>No applicants found for this project yet.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectApplicants;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles } from 'lucide-react'; // <--- Import Icon
import Navbar from '../Navbar/Navbar';
import StudentProfileCard from './StudentProfileCard';
import './ProjectApplicants.css';

const ProjectApplicants = () => {
  const { id } = useParams(); // Get project ID
  const navigate = useNavigate();
  
  // --- Store the full APPLICATION objects ---
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');

  // --- State to force re-fetch after an action ---
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) { /* handle auth if needed */ }
      
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/projects/${id}/applicants`, config);
        
        setApplications(data.applications || []); 
        setProjectName(data.projectTitle || ''); 
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicants();
  }, [id, navigate, refresh]);

  // Callback function to be passed to the card
  const onApplicantAction = () => {
      setRefresh(prev => !prev); 
  };

  // --- NEW: Handle AI Button Click ---
  const handleAICheck = () => {
      // Navigates to the AI Recommendation Page for this specific project
      navigate(`/projects/${id}/ai-recommendations`);
  };

  return (
    <div>
      <Navbar />
      <div className="applicants-container">
        <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>
        
        <div className="applicants-header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h1 className="page-title" style={{marginBottom: 0}}>
                Applicants {projectName && `for "${projectName}"`}
            </h1>

            {/* --- NEW: AI Shortlist Button (Only show if there are applicants) --- */}
            {applications.length > 0 && (
                <button 
                    onClick={handleAICheck}
                    className="ai-magic-btn"
                    style={{
                        background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Sparkles size={18} />
                    Find Top Freelancers by AI
                </button>
            )}
        </div>

        {loading && <p>Loading applicants...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && (
          <div className="applicants-grid">
            {applications.length > 0 ? (
              applications.map(app => (
                app.applicantId ? ( 
                  <StudentProfileCard 
                      key={app._id} 
                      application={app} 
                      profile={app.applicantId} 
                      onAction={onApplicantAction} 
                  />
                ) : null
              ))
            ) : (
              <p>No applicants found for this project yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApplicants;