

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../Navbar/Navbar.jsx';
// import './StudentDashboard.css';

// const StudentDashboard = () => {
//     const navigate = useNavigate();
    
//     // Data States
//     const [activeProjects, setActiveProjects] = useState([]);
//     const [pendingProjects, setPendingProjects] = useState([]);
//     const [completedProjects, setCompletedProjects] = useState([]);
//     const [rejectedProjects, setRejectedProjects] = useState([]);
    
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [refresh, setRefresh] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const role = localStorage.getItem('userRole');
        
//         if (!token || (role !== 'freelancer' && role !== 'student')) {
//           navigate('/login', { replace: true });
//           return;
//         }
        
//         const fetchFreelancerProjects = async () => {
//             setLoading(true);
//             setError("");
//             const config = { headers: { Authorization: `Bearer ${token}` } };
            
//             try {
//                 const [activeRes, pendingRes, completedRes, rejectedRes] = await Promise.all([
//                     axios.get('http://localhost:5000/api/freelancer/projects/active', config),
//                     axios.get('http://localhost:5000/api/freelancer/projects/applied', config),
//                     axios.get('http://localhost:5000/api/freelancer/projects/completed', config),
//                     axios.get('http://localhost:5000/api/freelancer/projects/rejected', config)
//                 ]);

//                 setActiveProjects(activeRes.data || []);
//                 setPendingProjects(pendingRes.data || []);
//                 setCompletedProjects(completedRes.data || []);
//                 setRejectedProjects(rejectedRes.data || []);

//             } catch (err) {
//                 console.error("Error fetching dashboard data:", err);
//                 setError(err.response?.data?.message || "Could not load dashboard data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFreelancerProjects();
//     }, [navigate, refresh]);

//     // --- Navigation Handlers ---
//     const handleViewDetails = (projectId) => {
//         navigate(`/project/${projectId}`);
//     };

//     const handleSubmitWork = (projectId) => {
//         navigate(`/submit-project/${projectId}`);
//     };
    
//     const handleViewCompletedWork = (projectId) => {
//         navigate(`/project/completed/${projectId}`);
//     };

//     // --- Action Handlers ---
//     const handleFinishClick = async (projectId) => {
//         if (!window.confirm("Are you sure you want to mark this project as finished?")) {
//             return;
//         }
//         const token = localStorage.getItem('token');
//         const config = { headers: { Authorization: `Bearer ${token} `} };
//         try {
//             await axios.put(`http://localhost:5000/api/projects/${projectId}/finish`, {}, config);
//             setRefresh(prev => !prev);
//         } catch (err) {
//             setError(err.response?.data?.message || "Could not finish project.");
//         }
//     };

//     const renderProjectTable = (title, applications, dotClass) => {
//         const validApplications = applications.filter(app => 
//             app && app._id && app.projectId && app.clientId && app.projectId.title && app.projectId.budget
//         );

//         return (
//             <section className="project-section">
//                 <h2><span className={`status-dot ${dotClass}`}></span>{title}</h2>
                
//                 {loading ? (
//                     <p>Loading projects...</p>
//                 ) : validApplications.length > 0 ? (
//                     <div className="table-responsive-wrapper">
//                         <table className="projects-table">
//                             <thead>
//                                 <tr>
//                                     <th>Project Title</th>
//                                     <th>Client</th>
//                                     <th>Budget</th>
//                                     <th>Status</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {validApplications.map(app => (
//                                     <tr key={app._id}>
//                                         <td data-label="Title">{app.projectId.title}</td>
//                                         <td data-label="Client">{app.clientId.companyName || `${app.clientId.firstName} ${app.clientId.lastName}`}</td>
//                                         <td data-label="Budget">${app.projectId.budget}</td>
//                                         <td data-label="Status">
//                                             <span className={`status-badge status-${app.projectId.status || app.status}`}>
//                                                 {app.projectId.status === 'submitted' ? 'Submitted' : app.status}
//                                             </span>
//                                         </td>
//                                         <td data-label="Actions" className="action-buttons">
//                                             <button
//                                                 className="details-btn"
//                                                 onClick={() => handleViewDetails(app.projectId._id)}
//                                             >
//                                                 Details
//                                             </button>
                                            
//                                             {/* --- COMPLETED PROJECTS LOGIC --- */}
//                                             {/* FIX: Check app.status instead of project status to ensure only the hired freelancer sees this */}
//                                             {app.status === 'completed' && (
//                                                 <button 
//                                                     className="details-btn"
//                                                     style={{backgroundColor: '#28a745', color: 'white', marginLeft: '5px', border:'none'}}
//                                                     onClick={() => handleViewCompletedWork(app.projectId._id)}
//                                                 >
//                                                     View Work
//                                                 </button>
//                                             )}

//                                             {/* --- ACTIVE / HIRED PROJECTS --- */}
//                                             {app.status === 'hired' && app.projectId.status !== 'completed' && (
//                                                 <>
//                                                     {/* Submit Work Button */}
//                                                     {app.projectId.status === 'submitted' ? (
//                                                         <button className="submitted-btn" disabled>
//                                                             Wait for Review
//                                                         </button>
//                                                     ) : (
//                                                         <button 
//                                                             className="submit-work-btn"
//                                                             onClick={() => handleSubmitWork(app.projectId._id)}
//                                                         >
//                                                             Submit Work
//                                                         </button>
//                                                     )}

//                                                     {/* Finish Button */}
//                                                     <button 
//                                                         className="finish-btn"
//                                                         onClick={() => handleFinishClick(app.projectId._id)}
//                                                         disabled={app.freelancerMarkedComplete} 
//                                                     >
//                                                         {app.freelancerMarkedComplete ? 'Done' : 'Finish'}
//                                                     </button>
//                                                 </>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     !loading && <p className="no-projects-message">No projects in this category.</p>
//                 )}
//             </section>
//         );
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="dashboard-container">
//                 <h1>My Projects Dashboard</h1>
//                 {error && <p className="error-message">{error}</p>}
                
//                 {renderProjectTable("Active Projects", activeProjects, "status-active-dot")}
//                 {renderProjectTable("Pending Applications", pendingProjects, "status-pending-dot")}
//                 {renderProjectTable("Completed Projects", completedProjects, "status-completed-dot")}
//                 {renderProjectTable("Rejected Applications", rejectedProjects, "status-rejected-dot")}
//             </div>
//         </div>
//     );
// };

// export default StudentDashboard;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react'; // Import Star icon
import Navbar from '../Navbar/Navbar.jsx';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    
    // Data States
    const [activeProjects, setActiveProjects] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [rejectedProjects, setRejectedProjects] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(false);

    // --- NEW: Rating Modal States ---
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [ratingLoading, setRatingLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        
        if (!token || (role !== 'freelancer' && role !== 'student')) {
          navigate('/login', { replace: true });
          return;
        }
        
        const fetchFreelancerProjects = async () => {
            setLoading(true);
            setError("");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                const [activeRes, pendingRes, completedRes, rejectedRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/freelancer/projects/active', config),
                    axios.get('http://localhost:5000/api/freelancer/projects/applied', config),
                    axios.get('http://localhost:5000/api/freelancer/projects/completed', config),
                    axios.get('http://localhost:5000/api/freelancer/projects/rejected', config)
                ]);

                setActiveProjects(activeRes.data || []);
                setPendingProjects(pendingRes.data || []);
                setCompletedProjects(completedRes.data || []);
                setRejectedProjects(rejectedRes.data || []);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(err.response?.data?.message || "Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancerProjects();
    }, [navigate, refresh]);

    // --- Handlers ---
    const handleViewDetails = (projectId) => navigate(`/project/${projectId}`);
    const handleSubmitWork = (projectId) => navigate(`/submit-project/${projectId}`);
    const handleViewCompletedWork = (projectId) => navigate(`/project/completed/${projectId}`);

    const handleFinishClick = async (projectId) => {
        if (!window.confirm("Are you sure you want to mark this project as finished?")) return;
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token} `} };
        try {
            await axios.put(`http://localhost:5000/api/projects/${projectId}/finish`, {}, config);
            setRefresh(prev => !prev);
        } catch (err) {
            setError(err.response?.data?.message || "Could not finish project.");
        }
    };

    // --- NEW: View Rating Handler ---
    const handleSeeRating = async (projectId) => {
        setRatingLoading(true);
        setShowRatingModal(true);
        setSelectedReview(null); // Reset previous

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const { data } = await axios.get(`http://localhost:5000/api/reviews/project/${projectId}`, config);
            setSelectedReview(data);
        } catch (err) {
            console.error("Error fetching review:", err);
            setSelectedReview({ error: "No review found yet." });
        } finally {
            setRatingLoading(false);
        }
    };

    const renderProjectTable = (title, applications, dotClass) => {
        const validApplications = applications.filter(app => 
            app && app._id && app.projectId && app.clientId
        );

        return (
            <section className="project-section">
                <h2><span className={`status-dot ${dotClass}`}></span>{title}</h2>
                
                {loading ? <p>Loading projects...</p> : validApplications.length > 0 ? (
                    <div className="table-responsive-wrapper">
                        <table className="projects-table">
                            <thead>
                                <tr>
                                    <th>Project Title</th>
                                    <th>Client</th>
                                    <th>Budget</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validApplications.map(app => (
                                    <tr key={app._id}>
                                        <td data-label="Title">{app.projectId.title}</td>
                                        <td data-label="Client">{app.clientId.companyName || `${app.clientId.firstName} ${app.clientId.lastName}`}</td>
                                        <td data-label="Budget">${app.projectId.budget}</td>
                                        <td data-label="Status">
                                            <span className={`status-badge status-${app.projectId.status || app.status}`}>
                                                {app.projectId.status === 'submitted' ? 'Submitted' : app.status}
                                            </span>
                                        </td>
                                        <td data-label="Actions" className="action-buttons">
                                            <button className="details-btn" onClick={() => handleViewDetails(app.projectId._id)}>Details</button>
                                            
                                            {/* Completed Projects Logic */}
                                            {app.status === 'completed' && (
                                                <>
                                                    <button 
                                                        className="details-btn"
                                                        style={{backgroundColor: '#28a745', color: 'white', marginLeft: '5px', border:'none'}}
                                                        onClick={() => handleViewCompletedWork(app.projectId._id)}
                                                    >
                                                        View Work
                                                    </button>
                                                    
                                                    {/* NEW: See Rating Button */}
                                                    {app.isReviewed && (
                                                        <button 
                                                            className="finish-btn"
                                                            style={{backgroundColor: '#ffc107', color: 'black', marginLeft: '5px'}}
                                                            onClick={() => handleSeeRating(app.projectId._id)}
                                                        >
                                                            See Rating
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {/* Active Logic */}
                                            {app.status === 'hired' && app.projectId.status !== 'completed' && (
                                                <>
                                                    {app.projectId.status === 'submitted' ? (
                                                        <button className="submitted-btn" disabled>Wait for Review</button>
                                                    ) : (
                                                        <button className="submit-work-btn" onClick={() => handleSubmitWork(app.projectId._id)}>Submit Work</button>
                                                    )}

                                                    <button className="finish-btn" onClick={() => handleFinishClick(app.projectId._id)} disabled={app.freelancerMarkedComplete}>
                                                        {app.freelancerMarkedComplete ? 'Done' : 'Finish'}
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (!loading && <p className="no-projects-message">No projects in this category.</p>)}
            </section>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <h1>My Projects Dashboard</h1>
                {error && <p className="error-message">{error}</p>}
                
                {renderProjectTable("Active Projects", activeProjects, "status-active-dot")}
                {renderProjectTable("Pending Applications", pendingProjects, "status-pending-dot")}
                {renderProjectTable("Completed Projects", completedProjects, "status-completed-dot")}
                {renderProjectTable("Rejected Applications", rejectedProjects, "status-rejected-dot")}
            </div>

            {/* --- RATING MODAL --- */}
            {showRatingModal && (
                <div className="modal-overlay">
                    <div className="modal-content review-modal" style={{textAlign:'center'}}>
                        <div className="modal-header" style={{justifyContent:'center', position:'relative'}}>
                            <h3>Client Feedback</h3>
                            <button className="close-btn" style={{position:'absolute', right:0}} onClick={() => setShowRatingModal(false)}>×</button>
                        </div>
                        
                        {ratingLoading ? (
                            <p>Loading review...</p>
                        ) : selectedReview && !selectedReview.error ? (
                            <div className="review-display">
                                <div className="stars-display" style={{marginBottom:'15px'}}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                            key={star} 
                                            size={32}
                                            fill={star <= selectedReview.rating ? "#ffc107" : "none"} 
                                            color={star <= selectedReview.rating ? "#ffc107" : "#ccc"}
                                        />
                                    ))}
                                </div>
                                <h4 style={{marginBottom:'10px'}}>"{selectedReview.comment}"</h4>
                                <p style={{color:'#666', fontSize:'0.9rem'}}>Rated by Client</p>
                            </div>
                        ) : (
                            <p>No rating provided by the client yet.</p>
                        )}

                        <div className="modal-actions" style={{justifyContent:'center', marginTop:'20px'}}>
                            <button className="btn-submit" onClick={() => setShowRatingModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;