// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// // --- FIX: Added one more "../" to go up 3 levels to find Components ---
// import Navbar from '../../../Components/Navbar/Navbar'; 
// import { Loader, Sparkles, ArrowLeft, Trophy, Star } from 'lucide-react';
// import './AIRecommendationPage.css'; 

// const AIRecommendationPage = () => {
//     const { projectId } = useParams();
//     const navigate = useNavigate();
//     const [shortlisted, setShortlisted] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchAIResults = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     navigate('/login');
//                     return;
//                 }
//                 const config = { headers: { Authorization: `Bearer ${token}` } };
                
//                 // Call the new AI endpoint
//                 const { data } = await axios.post(
//                     `http://localhost:5000/api/projects/${projectId}/ai-shortlist`, 
//                     {}, 
//                     config
//                 );
                
//                 setShortlisted(data);
//             } catch (err) {
//                 console.error(err);
//                 setError(err.response?.data?.message || "AI failed to analyze candidates. Try again later.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAIResults();
//     }, [projectId, navigate]);

//     return (
//         <div className="ai-page-wrapper">
//             <Navbar />
//             <div className="ai-container">
//                 <button className="back-btn-ai" onClick={() => navigate(-1)}>
//                     <ArrowLeft size={18} /> Back to Applicants
//                 </button>

//                 <div className="ai-header">
//                     <h1><Sparkles className="ai-icon-main" /> Top Candidates by Gemini AI</h1>
//                     <p>We analyzed skills, experience, and project fit to find your best matches.</p>
//                 </div>

//                 {loading ? (
//                     <div className="ai-loading-state">
//                         <Loader className="animate-spin" size={48} color="#6c5ce7" />
//                         <h3>Analyzing Profiles...</h3>
//                         <p>Please wait while our AI reads resumes and project history.</p>
//                     </div>
//                 ) : error ? (
//                     <div className="ai-error-state">
//                         <p>{error}</p>
//                         <button onClick={() => window.location.reload()} className="retry-btn">Try Again</button>
//                     </div>
//                 ) : (
//                     <div className="ai-grid">
//                         {shortlisted.map((app, index) => (
//                             <div className="ai-card" key={app._id}>
//                                 <div className="rank-badge">#{index + 1}</div>
                                
//                                 <div className="ai-card-header">
//                                     <div className="candidate-info">
//                                         <h3>{app.applicantId.firstName} {app.applicantId.lastName}</h3>
//                                         <p className="freelancer-role">{app.applicantId.title || 'Freelancer'}</p>
//                                     </div>
//                                     <div className="match-badge">
//                                         {app.aiMatchScore || 90}% Match
//                                     </div>
//                                 </div>

//                                 <div className="ai-reason-box">
//                                     <strong><Sparkles size={14} /> AI Analysis:</strong>
//                                     <p>{app.aiReason || "Strong match for your project requirements."}</p>
//                                 </div>

//                                 <div className="ai-stats-row">
//                                     <div className="stat">
//                                         <Star size={16} fill="#f1c40f" color="#f1c40f" />
//                                         <span>{app.applicantId.rating ? app.applicantId.rating.toFixed(1) : "New"}</span>
//                                     </div>
//                                     <div className="stat">
//                                         <Trophy size={16} color="#666" />
//                                         <span>{app.applicantId.completedProjects || 0} Projects</span>
//                                     </div>
//                                 </div>
                                
//                                 <button 
//                                     className="view-profile-btn-ai"
//                                     onClick={() => navigate(`/profile/${app.applicantId._id}`)}
//                                 >
//                                     View Full Profile
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AIRecommendationPage;





import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Adjust this import path if needed based on your folder structure
import Navbar from '../../../Components/Navbar/Navbar'; 
import { Loader, Sparkles, ArrowLeft, Trophy, Star, RefreshCw } from 'lucide-react';
import './AIRecommendationPage.css'; 

const AIRecommendationPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [shortlisted, setShortlisted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Unique key for storing this project's results
    const STORAGE_KEY = `ai_results_${projectId}`;

    const fetchAIResults = useCallback(async (forceRefresh = false) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Check Session Storage FIRST (unless forcing a refresh)
            const cachedData = sessionStorage.getItem(STORAGE_KEY);
            if (!forceRefresh && cachedData) {
                console.log("Loading from cache...");
                setShortlisted(JSON.parse(cachedData));
                setLoading(false);
                return; // Stop here, don't call API
            }

            // 2. If no cache, call the API
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const { data } = await axios.post(
                `http://localhost:5000/api/projects/${projectId}/ai-shortlist`, 
                {}, 
                config
            );
            
            // 3. Save successful result to Session Storage
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setShortlisted(data);

        } catch (err) {
            console.error(err);
            // Even if API fails, don't delete old cache immediately to prevent total data loss if possible
            setError(err.response?.data?.message || "AI failed to analyze candidates. Try again later.");
        } finally {
            setLoading(false);
        }
    }, [projectId, navigate, STORAGE_KEY]);

    useEffect(() => {
        fetchAIResults();
    }, [fetchAIResults]);

    // Function to manually refresh data
    const handleRefresh = () => {
        sessionStorage.removeItem(STORAGE_KEY); // Clear cache
        fetchAIResults(true); // Force API call
    };

    return (
        <div className="ai-page-wrapper">
            <Navbar />
            <div className="ai-container">
                <div className="ai-nav-header">
                    <button className="back-btn-ai" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back to Applicants
                    </button>
                    
                    {!loading && !error && (
                        <button className="refresh-btn-ai" onClick={handleRefresh}>
                            <RefreshCw size={16} /> Regenerate Analysis
                        </button>
                    )}
                </div>

                <div className="ai-header">
                    <h1><Sparkles className="ai-icon-main" /> Top Candidates by Gemini AI</h1>
                    <p>We analyzed skills, experience, and project fit to find your best matches.</p>
                </div>

                {loading ? (
                    <div className="ai-loading-state">
                        <Loader className="animate-spin" size={48} color="#6c5ce7" />
                        <h3>Analyzing Profiles...</h3>
                        <p>This checks skills, experience & ratings.</p>
                    </div>
                ) : error ? (
                    <div className="ai-error-state">
                        <p>{error}</p>
                        <button onClick={handleRefresh} className="retry-btn">Try Again</button>
                    </div>
                ) : (
                    <div className="ai-grid">
                        {shortlisted.map((app, index) => (
                            <div className="ai-card" key={app._id}>
                                <div className="rank-badge">#{index + 1}</div>
                                
                                <div className="ai-card-header">
                                    <div className="candidate-info">
                                        <h3>{app.applicantId.firstName} {app.applicantId.lastName}</h3>
                                        <p className="freelancer-role">{app.applicantId.title || 'Freelancer'}</p>
                                    </div>
                                    <div className="match-badge">
                                        {app.aiMatchScore || 90}% Match
                                    </div>
                                </div>

                                <div className="ai-reason-box">
                                    <strong><Sparkles size={14} /> AI Analysis:</strong>
                                    <p>{app.aiReason || "Strong match for your project requirements."}</p>
                                </div>

                                <div className="ai-stats-row">
                                    <div className="stat">
                                        <Star size={16} fill="#f1c40f" color="#f1c40f" />
                                        <span>{app.applicantId.rating ? app.applicantId.rating.toFixed(1) : "New"}</span>
                                    </div>
                                    <div className="stat">
                                        <Trophy size={16} color="#666" />
                                        <span>{app.applicantId.completedProjects || 0} Projects</span>
                                    </div>
                                </div>
                                
                                {/* --- FIX IS HERE: Reverted to /profile/ route --- */}
                                <button 
                                    className="view-profile-btn-ai"
                                    onClick={() => navigate(`/profile/${app.applicantId._id}`)} 
                                >
                                    View Full Profile
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIRecommendationPage;