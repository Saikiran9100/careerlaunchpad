// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import Navbar from '../Navbar/Navbar.jsx';
// // import './ClientDashboard.css';

// // const ClientDashboard = () => {
// //     const navigate = useNavigate();
// //     const [userName, setUserName] = useState('');
    
// //     // Project States
// //     const [openProjects, setOpenProjects] = useState([]);
// //     const [activeProjects, setActiveProjects] = useState([]);
// //     const [submittedProjects, setSubmittedProjects] = useState([]); 
// //     const [completedProjects, setCompletedProjects] = useState([]);
    
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState("");
// //     const [refresh, setRefresh] = useState(false);

// //     // Modal States
// //     const [showModal, setShowModal] = useState(false);
// //     const [selectedProject, setSelectedProject] = useState(null);

// //     useEffect(() => {
// //         const token = localStorage.getItem('token');
// //         const role = localStorage.getItem('userRole');
// //         const name = localStorage.getItem('userName');
        
// //         if (!token || role !== 'client') {
// //           navigate('/login', { replace: true });
// //           return; 
// //         }
// //         setUserName(name || 'Client');

// //         const fetchAllClientProjects = async () => {
// //             setLoading(true);
// //             setError("");
// //             const config = { headers: { Authorization: `Bearer ${token}` } };
            
// //             try {
// //                 const { data } = await axios.get('http://localhost:5000/api/projects/client', config);
                
// //                 setOpenProjects(data.filter(p => p.status === 'open'));
// //                 setActiveProjects(data.filter(p => p.status === 'in-progress'));
// //                 setSubmittedProjects(data.filter(p => p.status === 'submitted')); 
// //                 setCompletedProjects(data.filter(p => p.status === 'completed'));
                
// //             } catch (err) {
// //                 console.error("Error fetching client projects:", err);
// //                 setError(err.response?.data?.message || "Could not load your projects.");
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchAllClientProjects();
// //     }, [navigate, refresh]); 

// //     // --- Navigation Handlers ---
// //     const handleViewDetails = (projectId) => {
// //         navigate(`/client/projects/${projectId}`);
// //     };
// //     const handleViewApplicants = (projectId) => {
// //         navigate(`/client/projects/${projectId}/applicants`);
// //     };
// //     const handleViewCompletedWork = (projectId) => {
// //         navigate(`/project/completed/${projectId}`);
// //     };

// //     // --- Modal Handler ---
// //     const handleViewSubmission = (project) => {
// //         setSelectedProject(project);
// //         setShowModal(true);
// //     };

// //     // --- Finish Action ---
// //     const handleFinishClick = async (projectId) => {
// //         if (!window.confirm("Are you sure you want to accept this work and finish the project?")) {
// //             return;
// //         }
        
// //         const token = localStorage.getItem('token');
// //         const config = { headers: { Authorization: `Bearer ${token}` } };
        
// //         try {
// //             await axios.put(`http://localhost:5000/api/projects/${projectId}/finish`, {}, config);
// //             setShowModal(false); 
// //             setRefresh(prev => !prev); 
// //         } catch (err) {
// //             setError(err.response?.data?.message || "Could not finish project.");
// //         }
// //     };

// //     const renderProjectTable = (title, projects, dotClass) => (
// //         <section className="project-section">
// //             <h2><span className={`status-dot ${dotClass}`}></span>{title}</h2>
            
// //             {loading && <p>Loading projects...</p>}

// //             {!loading && projects.length > 0 ? (
// //                 <div className="table-responsive-wrapper">
// //                     <table className="projects-table">
// //                         <thead>
// //                             <tr>
// //                                 <th>Project Title</th>
// //                                 <th>Budget</th>
// //                                 <th>Status</th>
// //                                 <th>Actions</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {projects.map(project => {
// //                                 const app = project.application;
// //                                 return (
// //                                 <tr key={project._id}>
// //                                     <td data-label="Title">{project.title}</td>
// //                                     <td data-label="Budget">${project.budget}</td>
// //                                     <td data-label="Status">
// //                                         <span className={`status-badge status-${project.status}`}>
// //                                             {project.status === 'submitted' ? 'Review Pending' : project.status}
// //                                         </span>
// //                                     </td>
// //                                     <td data-label="Actions" className="action-buttons">
                                        
// //                                         <button className="details-btn" onClick={() => handleViewDetails(project._id)}>
// //                                             View Details
// //                                         </button>
                                        
// //                                         {/* --- ACTION LOGIC --- */}

// //                                         {/* 1. Open Projects -> View Applicants */}
// //                                         {project.status === 'open' && (
// //                                             <button className="applicants-btn" onClick={() => handleViewApplicants(project._id)}>
// //                                                 View Applicants
// //                                             </button>
// //                                         )}

// //                                         {/* 2. Submitted Projects -> View Submission */}
// //                                         {project.status === 'submitted' && (
// //                                             <button 
// //                                                 className="finish-btn" 
// //                                                 style={{backgroundColor: '#ffc107', color: '#000'}}
// //                                                 onClick={() => handleViewSubmission(project)}
// //                                             >
// //                                                 Review Submission
// //                                             </button>
// //                                         )}
                                        
// //                                         {/* 3. In Progress -> Finish */}
// //                                         {project.status === 'in-progress' && (
// //                                             <button 
// //                                                 className="finish-btn"
// //                                                 onClick={() => handleFinishClick(project._id)}
// //                                                 disabled={app?.clientMarkedComplete} 
// //                                             >
// //                                                 {app?.clientMarkedComplete ? 'Waiting for Freelancer' : 'Finish Project'}
// //                                             </button>
// //                                         )}

// //                                         {/* 4. Completed -> View Work */}
// //                                         {project.status === 'completed' && (
// //                                             <button 
// //                                                 className="applicants-btn" 
// //                                                 style={{backgroundColor: '#28a745', color: 'white', marginLeft: '5px'}}
// //                                                 onClick={() => handleViewCompletedWork(project._id)}
// //                                             >
// //                                                 View Work
// //                                             </button>
// //                                         )}
// //                                     </td>
// //                                 </tr>
// //                                 );
// //                             })}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             ) : (
// //                  !loading && <p className="no-projects-message">No projects in this category.</p>
// //             )}
// //         </section>
// //     );

// //     return (
// //         <div>
// //             <Navbar />
// //             <div className="dashboard-container">
// //                 <h1>Welcome, {userName}!</h1>
// //                 <p>Manage your projects and connect with talented freelancers.</p>
// //                 <button
// //                     className="allocate-project-btn"
// //                     onClick={() => navigate('/allocate-project')}
// //                 >
// //                     Allocate New Project
// //                 </button>
                
// //                 {error && <p className="error-message">{error}</p>}

// //                 {/* --- RENDER TABLES --- */}
// //                 {renderProjectTable("Projects for Review", submittedProjects, "status-submitted-dot")}
// //                 {renderProjectTable("Posted Projects", openProjects, "status-pending-dot")}
// //                 {renderProjectTable("Active Projects", activeProjects, "status-active-dot")}
// //                 {renderProjectTable("Completed Projects", completedProjects, "status-completed-dot")}
// //             </div>

// //             {/* --- SUBMISSION REVIEW MODAL --- */}
// //             {showModal && selectedProject && (
// //                 <div className="modal-overlay">
// //                     <div className="modal-content review-modal">
// //                         <div className="modal-header">
// //                             <h3>Review Submission: {selectedProject.title}</h3>
// //                             <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
// //                         </div>
                        
// //                         <div className="submission-details">
// //                             {selectedProject.submission ? (
// //                                 <>
// //                                     <div className="detail-group">
// //                                         <label>Repository Link:</label>
// //                                         <a href={selectedProject.submission.repoLink} target="_blank" rel="noopener noreferrer">
// //                                             {selectedProject.submission.repoLink}
// //                                         </a>
// //                                     </div>
                                    
// //                                     {selectedProject.submission.liveLink && (
// //                                         <div className="detail-group">
// //                                             <label>Live Link:</label>
// //                                             <a href={selectedProject.submission.liveLink} target="_blank" rel="noopener noreferrer">
// //                                                 {selectedProject.submission.liveLink}
// //                                             </a>
// //                                         </div>
// //                                     )}

// //                                     {selectedProject.submission.videoLink && (
// //                                         <div className="detail-group">
// //                                             <label>Video Demo:</label>
// //                                             <a href={selectedProject.submission.videoLink} target="_blank" rel="noopener noreferrer">
// //                                                 {selectedProject.submission.videoLink}
// //                                             </a>
// //                                         </div>
// //                                     )}

// //                                     <div className="detail-group">
// //                                         <label>Description:</label>
// //                                         <p className="description-box">{selectedProject.submission.description}</p>
// //                                     </div>
// //                                 </>
// //                             ) : (
// //                                 <p>No submission details found.</p>
// //                             )}
// //                         </div>

// //                         <div className="modal-actions">
// //                             <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
// //                             <button 
// //                                 className="btn-submit" 
// //                                 onClick={() => handleFinishClick(selectedProject._id)}
// //                             >
// //                                 Accept & Finish Project
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default ClientDashboard;





// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Star } from 'lucide-react'; // Needed for star rating UI
// import Navbar from '../Navbar/Navbar.jsx';
// import './ClientDashboard.css';

// const ClientDashboard = () => {
//     const navigate = useNavigate();
//     const [userName, setUserName] = useState('');
    
//     // Project States
//     const [openProjects, setOpenProjects] = useState([]);
//     const [activeProjects, setActiveProjects] = useState([]);
//     const [submittedProjects, setSubmittedProjects] = useState([]); 
//     const [completedProjects, setCompletedProjects] = useState([]);
    
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [refresh, setRefresh] = useState(false);

//     // Submission Review Modal State (Viewing Freelancer Work)
//     const [showModal, setShowModal] = useState(false);
//     const [selectedProject, setSelectedProject] = useState(null);

//     // Freelancer Rating Modal State (Writing Review)
//     const [showReviewModal, setShowReviewModal] = useState(false);
//     const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
//     const [reviewProjectId, setReviewProjectId] = useState(null);
//     const [submittingReview, setSubmittingReview] = useState(false); // <-- FIX: Prevent double clicks

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const role = localStorage.getItem('userRole');
//         const name = localStorage.getItem('userName');
        
//         if (!token || role !== 'client') {
//           navigate('/login', { replace: true });
//           return; 
//         }
//         setUserName(name || 'Client');

//         const fetchAllClientProjects = async () => {
//             setLoading(true);
//             setError("");
//             const config = { headers: { Authorization: `Bearer ${token}` } };
            
//             try {
//                 const { data } = await axios.get('http://localhost:5000/api/projects/client', config);
                
//                 setOpenProjects(data.filter(p => p.status === 'open'));
//                 setActiveProjects(data.filter(p => p.status === 'in-progress'));
//                 setSubmittedProjects(data.filter(p => p.status === 'submitted')); 
//                 setCompletedProjects(data.filter(p => p.status === 'completed'));
                
//             } catch (err) {
//                 console.error("Error fetching client projects:", err);
//                 setError(err.response?.data?.message || "Could not load your projects.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllClientProjects();
//     }, [navigate, refresh]); 

//     // --- Navigation Handlers ---
//     const handleViewDetails = (projectId) => {
//         navigate(`/client/projects/${projectId}`);
//     };
//     const handleViewApplicants = (projectId) => {
//         navigate(`/client/projects/${projectId}/applicants`);
//     };
//     const handleViewCompletedWork = (projectId) => {
//         navigate(`/project/completed/${projectId}`);
//     };

//     // --- Submission Review Handler ---
//     const handleViewSubmission = (project) => {
//         setSelectedProject(project);
//         setShowModal(true);
//     };

//     // --- Finish Project Handler ---
//     const handleFinishClick = async (projectId) => {
//         if (!window.confirm("Are you sure you want to accept this work and finish the project?")) {
//             return;
//         }
        
//         const token = localStorage.getItem('token');
//         const config = { headers: { Authorization: `Bearer ${token}` } };
        
//         try {
//             await axios.put(`http://localhost:5000/api/projects/${projectId}/finish`, {}, config);
//             setShowModal(false); 
//             setRefresh(prev => !prev); 
//         } catch (err) {
//             setError(err.response?.data?.message || "Could not finish project.");
//         }
//     };

//     // --- Review Handlers ---
//     const openReviewModal = (projectId) => {
//         setReviewProjectId(projectId);
//         setReviewData({ rating: 5, comment: '' });
//         setShowReviewModal(true);
//     };

//     const submitReview = async () => {
//         if (submittingReview) return; // FIX: Prevent multiple clicks
//         setSubmittingReview(true);

//         const token = localStorage.getItem('token');
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         try {
//             await axios.post('http://localhost:5000/api/reviews', {
//                 projectId: reviewProjectId,
//                 rating: reviewData.rating,
//                 comment: reviewData.comment
//             }, config);
            
//             alert('Review submitted successfully!');
//             setShowReviewModal(false);
//             setRefresh(prev => !prev); // Reload to hide button
//         } catch (err) {
//             // FIX: If already reviewed, treat it as success-ish to clear the state
//             if (err.response?.data?.message?.includes('already been reviewed')) {
//                 alert("This project is already reviewed. Refreshing...");
//                 setShowReviewModal(false);
//                 setRefresh(prev => !prev);
//             } else {
//                 alert(err.response?.data?.message || 'Failed to submit review');
//             }
//         } finally {
//             setSubmittingReview(false);
//         }
//     };

//     const renderProjectTable = (title, projects, dotClass) => (
//         <section className="project-section">
//             <h2><span className={`status-dot ${dotClass}`}></span>{title}</h2>
            
//             {loading && <p>Loading projects...</p>}

//             {!loading && projects.length > 0 ? (
//                 <div className="table-responsive-wrapper">
//                     <table className="projects-table">
//                         <thead>
//                             <tr>
//                                 <th>Project Title</th>
//                                 <th>Budget</th>
//                                 <th>Status</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {projects.map(project => {
//                                 const app = project.application; // Hired/Completed application info
//                                 return (
//                                 <tr key={project._id}>
//                                     <td data-label="Title">{project.title}</td>
//                                     <td data-label="Budget">${project.budget}</td>
//                                     <td data-label="Status">
//                                         <span className={`status-badge status-${project.status}`}>
//                                             {project.status === 'submitted' ? 'Review Pending' : project.status}
//                                         </span>
//                                     </td>
//                                     <td data-label="Actions" className="action-buttons">
                                        
//                                         <button className="details-btn" onClick={() => handleViewDetails(project._id)}>
//                                             Details
//                                         </button>
                                        
//                                         {/* 1. Open -> Applicants */}
//                                         {project.status === 'open' && (
//                                             <button className="applicants-btn" onClick={() => handleViewApplicants(project._id)}>
//                                                 Applicants
//                                             </button>
//                                         )}

//                                         {/* 2. Submitted -> Review Work */}
//                                         {project.status === 'submitted' && (
//                                             <button 
//                                                 className="finish-btn" 
//                                                 style={{backgroundColor: '#ffc107', color: '#000'}}
//                                                 onClick={() => handleViewSubmission(project)}
//                                             >
//                                                 Review Work
//                                             </button>
//                                         )}
                                        
//                                         {/* 3. In Progress -> Finish */}
//                                         {project.status === 'in-progress' && (
//                                             <button 
//                                                 className="finish-btn"
//                                                 onClick={() => handleFinishClick(project._id)}
//                                                 disabled={app?.clientMarkedComplete} 
//                                             >
//                                                 {app?.clientMarkedComplete ? 'Waiting...' : 'Finish'}
//                                             </button>
//                                         )}

//                                         {/* 4. Completed -> Actions */}
//                                         {project.status === 'completed' && (
//                                             <>
//                                                 <button 
//                                                     className="applicants-btn" 
//                                                     style={{backgroundColor: '#28a745', color: 'white', marginLeft: '5px'}}
//                                                     onClick={() => handleViewCompletedWork(project._id)}
//                                                 >
//                                                     View Work
//                                                 </button>

//                                                 {/* Show Review Button ONLY if not yet reviewed */}
//                                                 {!app?.isReviewed && (
//                                                     <button 
//                                                         className="finish-btn" 
//                                                         style={{backgroundColor: '#6f42c1', color: 'white', marginLeft: '5px'}}
//                                                         onClick={() => openReviewModal(project._id)}
//                                                     >
//                                                         Rate
//                                                     </button>
//                                                 )}
//                                             </>
//                                         )}
//                                     </td>
//                                 </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                  !loading && <p className="no-projects-message">No projects in this category.</p>
//             )}
//         </section>
//     );

//     return (
//         <div>
//             <Navbar />
//             <div className="dashboard-container">
//                 <h1>Welcome, {userName}!</h1>
//                 <p>Manage your projects and connect with talented freelancers.</p>
//                 <button
//                     className="allocate-project-btn"
//                     onClick={() => navigate('/allocate-project')}
//                 >
//                     Allocate New Project
//                 </button>
                
//                 {error && <p className="error-message">{error}</p>}

//                 {/* --- RENDER TABLES --- */}
//                 {renderProjectTable("Projects for Review", submittedProjects, "status-submitted-dot")}
//                 {renderProjectTable("Posted Projects", openProjects, "status-pending-dot")}
//                 {renderProjectTable("Active Projects", activeProjects, "status-active-dot")}
//                 {renderProjectTable("Completed Projects", completedProjects, "status-completed-dot")}
//             </div>

//             {/* --- SUBMISSION REVIEW MODAL --- */}
//             {showModal && selectedProject && (
//                 <div className="modal-overlay">
//                     <div className="modal-content review-modal">
//                         <div className="modal-header">
//                             <h3>Review Submission: {selectedProject.title}</h3>
//                             <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
//                         </div>
                        
//                         <div className="submission-details">
//                             {selectedProject.submission ? (
//                                 <>
//                                     <div className="detail-group">
//                                         <label>Repository Link:</label>
//                                         <a href={selectedProject.submission.repoLink} target="_blank" rel="noopener noreferrer">
//                                             {selectedProject.submission.repoLink}
//                                         </a>
//                                     </div>
                                    
//                                     {selectedProject.submission.liveLink && (
//                                         <div className="detail-group">
//                                             <label>Live Link:</label>
//                                             <a href={selectedProject.submission.liveLink} target="_blank" rel="noopener noreferrer">
//                                                 {selectedProject.submission.liveLink}
//                                             </a>
//                                         </div>
//                                     )}

//                                     {selectedProject.submission.videoLink && (
//                                         <div className="detail-group">
//                                             <label>Video Demo:</label>
//                                             <a href={selectedProject.submission.videoLink} target="_blank" rel="noopener noreferrer">
//                                                 {selectedProject.submission.videoLink}
//                                             </a>
//                                         </div>
//                                     )}

//                                     <div className="detail-group">
//                                         <label>Description:</label>
//                                         <p className="description-box">{selectedProject.submission.description}</p>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <p>No submission details found.</p>
//                             )}
//                         </div>

//                         <div className="modal-actions">
//                             <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
//                             <button 
//                                 className="btn-submit" 
//                                 onClick={() => handleFinishClick(selectedProject._id)}
//                             >
//                                 Accept & Finish Project
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* --- FREELANCER RATING MODAL --- */}
//             {showReviewModal && (
//                 <div className="modal-overlay">
//                     <div className="modal-content review-modal">
//                         <div className="modal-header">
//                             <h3>Rate Freelancer</h3>
//                             <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
//                         </div>
                        
//                         <div className="review-form">
//                             <div className="detail-group">
//                                 <label>Rating:</label>
//                                 <div style={{display:'flex', gap:'5px', marginBottom:'10px'}}>
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                         <Star 
//                                             key={star} 
//                                             size={28}
//                                             fill={star <= reviewData.rating ? "#ffc107" : "none"} 
//                                             color={star <= reviewData.rating ? "#ffc107" : "#ccc"}
//                                             onClick={() => setReviewData({...reviewData, rating: star})}
//                                             style={{cursor:'pointer'}}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
                            
//                             <div className="detail-group">
//                                 <label>Feedback:</label>
//                                 <textarea 
//                                     rows="4" 
//                                     placeholder="Describe your experience working with this freelancer..."
//                                     value={reviewData.comment}
//                                     onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
//                                     className="description-box"
//                                     style={{width: '100%', minHeight:'100px'}}
//                                 />
//                             </div>
//                         </div>

//                         <div className="modal-actions">
//                             <button className="btn-cancel" onClick={() => setShowReviewModal(false)}>Cancel</button>
//                             <button 
//                                 className="btn-submit" 
//                                 onClick={submitReview}
//                                 disabled={submittingReview}
//                                 style={{opacity: submittingReview ? 0.7 : 1}}
//                             >
//                                 {submittingReview ? "Submitting..." : "Submit Review"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ClientDashboard;





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react'; 
import Navbar from '../Navbar/Navbar.jsx';
import './ClientDashboard.css';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    
    // Project States
    const [openProjects, setOpenProjects] = useState([]);
    const [activeProjects, setActiveProjects] = useState([]);
    const [submittedProjects, setSubmittedProjects] = useState([]); 
    const [completedProjects, setCompletedProjects] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(false);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Review States
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [reviewProjectId, setReviewProjectId] = useState(null);
    const [submittingReview, setSubmittingReview] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');
        
        if (!token || role !== 'client') {
          navigate('/login', { replace: true });
          return; 
        }
        setUserName(name || 'Client');

        const fetchAllClientProjects = async () => {
            setLoading(true);
            setError("");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                const { data } = await axios.get('http://localhost:5000/api/projects/client', config);
                
                setOpenProjects(data.filter(p => p.status === 'open'));
                setActiveProjects(data.filter(p => p.status === 'in-progress'));
                setSubmittedProjects(data.filter(p => p.status === 'submitted')); 
                setCompletedProjects(data.filter(p => p.status === 'completed'));
                
            } catch (err) {
                console.error("Error fetching client projects:", err);
                setError(err.response?.data?.message || "Could not load your projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllClientProjects();
    }, [navigate, refresh]); 

    // --- Handlers ---
    const handleViewDetails = (projectId) => navigate(`/client/projects/${projectId}`);
    const handleViewApplicants = (projectId) => navigate(`/client/projects/${projectId}/applicants`);
    const handleViewCompletedWork = (projectId) => navigate(`/project/completed/${projectId}`);
    
    const handleViewSubmission = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const handleFinishClick = async (projectId) => {
        if (!window.confirm("Are you sure you want to accept this work and finish the project?")) return;
        
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
            await axios.put(`http://localhost:5000/api/projects/${projectId}/finish`, {}, config);
            setShowModal(false); 
            setRefresh(prev => !prev); 
        } catch (err) {
            setError(err.response?.data?.message || "Could not finish project.");
        }
    };

    const openReviewModal = (projectId) => {
        setReviewProjectId(projectId);
        setReviewData({ rating: 5, comment: '' });
        setShowReviewModal(true);
    };

    const submitReview = async () => {
        if (submittingReview) return; 
        setSubmittingReview(true);

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.post('http://localhost:5000/api/reviews', {
                projectId: reviewProjectId,
                rating: reviewData.rating,
                comment: reviewData.comment
            }, config);
            
            alert('Review submitted successfully!');
            setShowReviewModal(false);
            setRefresh(prev => !prev); 
        } catch (err) {
            if (err.response?.data?.message?.includes('already been reviewed')) {
                alert("This project is already reviewed. Refreshing...");
                setShowReviewModal(false);
                setRefresh(prev => !prev);
            } else {
                alert(err.response?.data?.message || 'Failed to submit review');
            }
        } finally {
            setSubmittingReview(false);
        }
    };

    const renderProjectTable = (title, projects, dotClass) => (
        <section className="project-section">
            <h2><span className={`status-dot ${dotClass}`}></span>{title}</h2>
            {loading && <p>Loading projects...</p>}
            {!loading && projects.length > 0 ? (
                <div className="table-responsive-wrapper">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>Project Title</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => {
                                const app = project.application; 
                                return (
                                <tr key={project._id}>
                                    <td data-label="Title">{project.title}</td>
                                    <td data-label="Budget">${project.budget}</td>
                                    <td data-label="Status">
                                        <span className={`status-badge status-${project.status}`}>
                                            {project.status === 'submitted' ? 'Review Pending' : project.status}
                                        </span>
                                    </td>
                                    <td data-label="Actions" className="action-buttons">
                                        <button className="details-btn" onClick={() => handleViewDetails(project._id)}>Details</button>
                                        
                                        {project.status === 'open' && (
                                            <button className="applicants-btn" onClick={() => handleViewApplicants(project._id)}>Applicants</button>
                                        )}

                                        {project.status === 'submitted' && (
                                            <button className="finish-btn" style={{backgroundColor: '#ffc107', color: '#000'}} onClick={() => handleViewSubmission(project)}>
                                                Review Work
                                            </button>
                                        )}
                                        
                                        {project.status === 'in-progress' && (
                                            <button className="finish-btn" onClick={() => handleFinishClick(project._id)} disabled={app?.clientMarkedComplete}>
                                                {app?.clientMarkedComplete ? 'Waiting...' : 'Finish'}
                                            </button>
                                        )}

                                        {project.status === 'completed' && (
                                            <>
                                                <button 
                                                    className="applicants-btn" 
                                                    style={{backgroundColor: '#28a745', color: 'white', marginLeft: '5px'}}
                                                    onClick={() => handleViewCompletedWork(project._id)}
                                                >
                                                    View Work
                                                </button>

                                                {/* --- CHANGED LOGIC HERE --- */}
                                                {!app?.isReviewed ? (
                                                    <button 
                                                        className="finish-btn" 
                                                        style={{backgroundColor: '#6f42c1', color: 'white', marginLeft: '5px'}}
                                                        onClick={() => openReviewModal(project._id)}
                                                    >
                                                        Rate
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="finish-btn" 
                                                        disabled
                                                        style={{backgroundColor: '#ccc', color: '#666', marginLeft: '5px', cursor: 'not-allowed'}}
                                                    >
                                                        Rated ✅
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (!loading && <p className="no-projects-message">No projects in this category.</p>)}
        </section>
    );

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <h1>Welcome, {userName}!</h1>
                <p>Manage your projects and connect with talented freelancers.</p>
                <button className="allocate-project-btn" onClick={() => navigate('/allocate-project')}>Allocate New Project</button>
                {error && <p className="error-message">{error}</p>}

                {renderProjectTable("Projects for Review", submittedProjects, "status-submitted-dot")}
                {renderProjectTable("Posted Projects", openProjects, "status-pending-dot")}
                {renderProjectTable("Active Projects", activeProjects, "status-active-dot")}
                {renderProjectTable("Completed Projects", completedProjects, "status-completed-dot")}
            </div>

            {/* Submission Modal */}
            {showModal && selectedProject && (
                <div className="modal-overlay">
                    <div className="modal-content review-modal">
                        <div className="modal-header">
                            <h3>Review Submission: {selectedProject.title}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="submission-details">
                            {selectedProject.submission ? (
                                <>
                                    <div className="detail-group"><label>Repo:</label><a href={selectedProject.submission.repoLink} target="_blank" rel="noreferrer">{selectedProject.submission.repoLink}</a></div>
                                    {selectedProject.submission.liveLink && <div className="detail-group"><label>Live:</label><a href={selectedProject.submission.liveLink} target="_blank" rel="noreferrer">{selectedProject.submission.liveLink}</a></div>}
                                    <div className="detail-group"><label>Notes:</label><p className="description-box">{selectedProject.submission.description}</p></div>
                                </>
                            ) : <p>No details found.</p>}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
                            <button className="btn-submit" onClick={() => handleFinishClick(selectedProject._id)}>Accept & Finish</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="modal-overlay">
                    <div className="modal-content review-modal">
                        <div className="modal-header">
                            <h3>Rate Freelancer</h3>
                            <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
                        </div>
                        <div className="review-form">
                            <div className="detail-group">
                                <label>Rating:</label>
                                <div style={{display:'flex', gap:'5px', marginBottom:'10px'}}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={28} fill={star <= reviewData.rating ? "#ffc107" : "none"} color={star <= reviewData.rating ? "#ffc107" : "#ccc"} onClick={() => setReviewData({...reviewData, rating: star})} style={{cursor:'pointer'}} />
                                    ))}
                                </div>
                            </div>
                            <div className="detail-group">
                                <label>Feedback:</label>
                                <textarea rows="4" placeholder="Feedback..." value={reviewData.comment} onChange={(e) => setReviewData({...reviewData, comment: e.target.value})} className="description-box" style={{width: '100%'}} />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowReviewModal(false)}>Cancel</button>
                            <button className="btn-submit" onClick={submitReview} disabled={submittingReview} style={{opacity: submittingReview ? 0.7 : 1}}>{submittingReview ? "Submitting..." : "Submit Review"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;