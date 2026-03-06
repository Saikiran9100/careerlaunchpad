

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JobCard from './JobCard.jsx';
// import Navbar from '../Navbar/Navbar.jsx';
// import './AllJobs.css';

// const AllJobs = () => {
//     const navigate = useNavigate();
    
//     const [jobs, setJobs] = useState([]);
//     const [initialLoad, setInitialLoad] = useState(true);
//     const [aiScanning, setAiScanning] = useState(false);
//     const [error, setError] = useState('');
    
//     const [companySearch, setCompanySearch] = useState('');
//     const [skillSearch, setSkillSearch] = useState('');

//     useEffect(() => {
//         const fetchDualJobs = async () => {
//             // --- STEP 1: INSTANTLY FETCH DATABASE JOBS ---
//             try {
//                 const { data: dbJobs } = await axios.get('http://localhost:5000/api/jobs');
//                 setJobs(dbJobs);
//             } catch (err) {
//                 console.error("Failed to load DB jobs:", err);
//                 setError("Failed to load initial jobs.");
//             } finally {
//                 setInitialLoad(false); // Instantly show UI
//             }

//             // --- STEP 2: FETCH AI JOBS IN THE BACKGROUND ---
//             const token = localStorage.getItem('token');
//             if (!token) return;

//             setAiScanning(true);
//             try {
//                 const config = { headers: { Authorization: `Bearer ${token}` } };
//                 const { data: aiJobs } = await axios.get('http://localhost:5000/api/jobs/match-profile', config);
                
//                 if (Array.isArray(aiJobs) && aiJobs.length > 0) {
//                     setJobs(aiJobs); // Seamlessly update the list
//                 }
//             } catch (err) {
//                 console.error("Background AI fetch failed:", err);
//             } finally {
//                 setAiScanning(false);
//             }
//         };

//         fetchDualJobs();
//     }, []);

//     const filteredJobs = jobs.filter(job => {
//         const matchCompany = job.company?.toLowerCase().includes(companySearch.toLowerCase());
//         const matchSkill = skillSearch === '' || (
//             job.skills && job.skills.some(skill => 
//                 skill.toLowerCase().includes(skillSearch.toLowerCase())
//             )
//         ) || (
//             job.description && job.description.toLowerCase().includes(skillSearch.toLowerCase())
//         );
//         return matchCompany && matchSkill;
//     });

//     return (
//         <>
//         <Navbar/>
//         <div className="all-jobs-wrapper">
//             <button onClick={() => navigate(-1)} className="back-btn-page">
//                 &larr; Go Back
//             </button>

//             <div className="jobs-header-section">
//                 <h1 className="page-title">All Job Openings</h1>
                
//                 <div className="filter-container">
//                     <div className="search-box">
//                         <input 
//                             type="text" 
//                             placeholder="Search by Company..." 
//                             value={companySearch}
//                             onChange={(e) => setCompanySearch(e.target.value)}
//                             className="job-search-input"
//                         />
//                         <span className="search-icon-j">🔍</span>
//                     </div>

//                     <div className="skill-box">
//                         <input 
//                             type="text" 
//                             placeholder="Filter by Skill/Keyword..." 
//                             value={skillSearch} 
//                             onChange={(e) => setSkillSearch(e.target.value)}
//                             className="job-search-input"
//                             style={{ paddingLeft: '20px' }} 
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Subtle background scanner text */}
//             {aiScanning && (
//                  <div style={{ textAlign: 'center', color: '#6c5ce7', fontStyle: 'italic', marginBottom: '20px' }}>
//                      ✨ Updating list with live AI matches from the web...
//                  </div>
//             )}

//             {initialLoad ? (
//                 <div style={{textAlign:'center', marginTop: '50px'}}><h2>Loading jobs...</h2></div>
//             ) : error ? (
//                 <p style={{textAlign:'center', color:'red', marginTop: '50px'}}>{error}</p>
//             ) : (
//                 <div className="all-jobs-grid">
//                     {filteredJobs.length > 0 ? (
//                         filteredJobs.map((job, index) => (
//                             <JobCard key={job._id || index} job={job} />
//                         ))
//                     ) : (
//                         <div className="no-results">
//                             <p>No live jobs match your search.</p>
//                             <button 
//                                 className="clear-filter-btn"
//                                 onClick={() => { setCompanySearch(""); setSkillSearch(""); }}
//                             >
//                                 Clear Filters
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//         </>
//     );
// };

// export default AllJobs;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobCard from './JobCard.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import './AllJobs.css';

const AllJobs = () => {
    const navigate = useNavigate();
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiScanning, setAiScanning] = useState(false);
    
    const [companySearch, setCompanySearch] = useState('');
    const [skillSearch, setSkillSearch] = useState('');

    // --- Check if the user is logged in ---
    const isLoggedIn = !!localStorage.getItem('token'); 

    // 1. Instantly load Database Jobs on page open
    const fetchDBJobs = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/jobs');
            setJobs(data);
        } catch (err) {
            console.error("Failed to load DB jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDBJobs();
    }, []);

    // 2. Trigger Live API & Gemini Only When Clicked!
    const handleLiveFetch = async () => {
        if (!isLoggedIn) {
            alert("Please log in to fetch personalized live jobs!");
            return;
        }

        setAiScanning(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // This hits the APIs, ranks with Gemini, and saves them to the DB
            await axios.get('http://localhost:5000/api/jobs/match-profile', config);
            
            // Once saved, refresh the list from the DB so they appear!
            await fetchDBJobs();
        } catch (err) {
            console.error("Live fetch failed:", err);
            alert(err.response?.data?.message || "Failed to fetch live jobs. Try again later.");
        } finally {
            setAiScanning(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchCompany = job.company?.toLowerCase().includes(companySearch.toLowerCase());
        const matchSkill = skillSearch === '' || (
            job.skills && job.skills.some(skill => 
                skill.toLowerCase().includes(skillSearch.toLowerCase())
            )
        ) || (
            job.description && job.description.toLowerCase().includes(skillSearch.toLowerCase())
        );
        return matchCompany && matchSkill;
    });

    return (
        <>
        <Navbar/>
        <div className="all-jobs-wrapper">
            <button onClick={() => navigate(-1)} className="back-btn-page">
                &larr; Go Back
            </button>

            <div className="jobs-header-section">
                <h1 className="page-title">All Job Openings</h1>
                
                <div className="filter-container">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search by Company..." 
                            value={companySearch}
                            onChange={(e) => setCompanySearch(e.target.value)}
                            className="job-search-input"
                        />
                        <span className="search-icon-j">🔍</span>
                    </div>

                    <div className="skill-box">
                        <input 
                            type="text" 
                            placeholder="Filter by Skill/Keyword..." 
                            value={skillSearch} 
                            onChange={(e) => setSkillSearch(e.target.value)}
                            className="job-search-input"
                            style={{ paddingLeft: '20px' }} 
                        />
                    </div>
                </div>

                {/* --- NEW EXPLICIT TRIGGER BUTTON WITH LOGIN CHECK --- */}
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <button 
                        onClick={handleLiveFetch} 
                        disabled={aiScanning || !isLoggedIn}
                        style={{
                            padding: '10px 20px', 
                            backgroundColor: isLoggedIn ? '#6c5ce7' : '#b2bec3', // Gray out if not logged in
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: (aiScanning || !isLoggedIn) ? 'not-allowed' : 'pointer',
                            fontSize: '1rem', 
                            fontWeight: 'bold', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        {!isLoggedIn ? '🔒 Login Required for AI Matches' : 
                          aiScanning ? '⏳ Scanning the web... Please wait' : 
                          '✨ Fetch Latest AI Job Matches'}
                    </button>
                    <p style={{fontSize: '0.8rem', color: '#888', marginTop: '5px'}}>
                        {isLoggedIn 
                            ? 'Click to scrape external job boards based on your profile skills.' 
                            : 'You must be logged in to use the AI Job Aggregator.'}
                    </p>
                </div>
            </div>

            {loading ? (
                <div style={{textAlign:'center', marginTop: '50px'}}><h2>Loading jobs...</h2></div>
            ) : (
                <div className="all-jobs-grid">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (
                            <JobCard key={job._id || index} job={job} />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No jobs match your search.</p>
                            <button 
                                className="clear-filter-btn"
                                onClick={() => { setCompanySearch(""); setSkillSearch(""); }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
        </>
    );
};

export default AllJobs;