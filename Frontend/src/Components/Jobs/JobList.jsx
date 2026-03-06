



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JobCard from './JobCard.jsx';
// import './JobList.css';

// const JobList = ({ limit = 3 }) => {
//     const navigate = useNavigate();
//     const [jobs, setJobs] = useState([]);
    
//     // Two separate loading states!
//     const [initialLoad, setInitialLoad] = useState(true); // For instant DB jobs
//     const [aiScanning, setAiScanning] = useState(false);  // For background AI jobs
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchDualJobs = async () => {
//             // --- STEP 1: INSTANTLY FETCH DATABASE JOBS ---
//             try {
//                 const { data: dbJobs } = await axios.get('http://localhost:5000/api/jobs');
//                 setJobs(dbJobs.slice(0, limit)); // Show immediately
//             } catch (err) {
//                 console.error("Failed to load initial jobs:", err);
//             } finally {
//                 setInitialLoad(false); // Turn off main loading screen instantly
//             }

//             // --- STEP 2: FETCH AI JOBS IN THE BACKGROUND ---
//             const token = localStorage.getItem('token');
//             if (!token) return; // If not logged in, just stick to DB jobs

//             setAiScanning(true); // Turn on the subtle background scanner
//             try {
//                 const config = { headers: { Authorization: `Bearer ${token}` } };
//                 const { data: aiJobs } = await axios.get('http://localhost:5000/api/jobs/match-profile', config);
                
//                 if (Array.isArray(aiJobs) && aiJobs.length > 0) {
//                     setJobs(aiJobs.slice(0, limit)); // Seamlessly swap the jobs!
//                 }
//             } catch (err) {
//                 console.error("Background AI fetch failed, keeping DB jobs:", err);
//             } finally {
//                 setAiScanning(false); // Turn off subtle scanner
//             }
//         };

//         fetchDualJobs();
//     }, [limit]);

//     return (
//         <div className="job-section-wrapper">
//             <div className="job-header">
//                 <h1 className="job-title">Your Live Job Matches</h1>
//                 <div className="header-buttons"> 
//                     <button 
//                         className="search-openings-btn-header" 
//                         onClick={() => navigate('/jobs')}
//                     >
//                         Search Current Openings
//                     </button>
//                     <button
//                         className="view-all-link"
//                         onClick={() => navigate('/jobs')}
//                     >
//                         View all
//                     </button>
//                 </div>
//             </div>

//             {/* --- SUBTLE BACKGROUND LOADING INDICATOR --- */}
//             {aiScanning && (
//                 <div style={{ marginBottom: '15px', color: '#6c5ce7', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <span className="search-icon-j spinner-animation">⏳</span> 
//                     AI is scanning live job boards for your perfect matches...
//                 </div>
//             )}

//             {initialLoad ? (
//                 <p>Loading jobs...</p>
//             ) : error ? (
//                 <p className="error-message">{error}</p>
//             ) : (
//                 <div className="job-grid">
//                     {jobs.length > 0 ? (
//                         jobs.map((job, index) => (
//                             <JobCard key={job._id || index} job={job} />
//                         ))
//                     ) : (
//                         <p>No job openings match your profile at the moment.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default JobList;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobCard from './JobCard.jsx';
import './JobList.css';

const JobList = ({ limit = 3 }) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDBJobs = async () => {
            try {
                // ONLY fetches from the local database (Super fast, 0 API tokens!)
                const { data } = await axios.get('http://localhost:5000/api/jobs');
                setJobs(data.slice(0, limit));
            } catch (err) {
                console.error("Failed to load jobs:", err);
                setError("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchDBJobs();
    }, [limit]);

    return (
        <div className="job-section-wrapper">
            <div className="job-header">
                <h1 className="job-title">Explore jobs by top companies</h1>
                <div className="header-buttons"> 
                    <button 
                        className="search-openings-btn-header" 
                        onClick={() => navigate('/jobs')}
                    >
                        Search Current Openings
                    </button>
                    <button
                        className="view-all-link"
                        onClick={() => navigate('/jobs')}
                    >
                        View all
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading jobs...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="job-grid">
                    {jobs.length > 0 ? (
                        jobs.map((job, index) => (
                            <JobCard key={job._id || index} job={job} />
                        ))
                    ) : (
                        <p>No job openings available at the moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobList;