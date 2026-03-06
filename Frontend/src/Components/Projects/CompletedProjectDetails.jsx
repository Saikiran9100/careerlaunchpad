import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './CompletedProjectDetails.css';

const CompletedProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Fetch basic project details (which includes submission data in your schema)
                const { data } = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
                
                // The API might return { project: ... } or just the object depending on your controller
                // Based on your getProjectById controller: res.json({ project: project, hasApplied: ... })
                setProject(data.project || data); 

            } catch (err) {
                console.error("Error fetching project:", err);
                setError("Could not load project details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, navigate]);

    if (loading) return <div className="completed-page-container">Loading...</div>;
    if (error) return <div className="completed-page-container">{error}</div>;
    if (!project) return <div className="completed-page-container">Project not found</div>;

    const submission = project.submission || {};

    return (
        <>
            <Navbar />
            <div className="completed-page-container">
                <div className="completed-card">
                    
                    {/* Header */}
                    <div className="project-success-header">
                        <span className="success-icon-badge">🎉</span>
                        <h1>Project Completed!</h1>
                        <p>{project.title}</p>
                    </div>

                    <div className="project-content-body">
                        
                        {/* Left Column: Project Info */}
                        <div className="project-info-section">
                            <h3>Project Summary</h3>
                            
                            <div className="info-box">
                                <span className="info-label">Original Description</span>
                                <p className="info-value">{project.description}</p>
                            </div>

                            <div className="info-box">
                                <span className="info-label">Budget</span>
                                <p className="info-value">${project.budget}</p>
                            </div>

                             <div className="info-box">
                                <span className="info-label">Developer Notes</span>
                                <p className="info-value">
                                    {submission.description || "No notes provided by developer."}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Links */}
                        <div className="submission-links-section">
                            <h3>Deliverables & Links</h3>
                            
                            {/* GitHub Link */}
                            {submission.repoLink ? (
                                <a href={submission.repoLink} target="_blank" rel="noopener noreferrer" className="link-card">
                                    <div className="link-icon">📂</div>
                                    <div className="link-details">
                                        <strong>Source Code</strong>
                                        <span>View Repository</span>
                                    </div>
                                </a>
                            ) : (
                                <div className="link-card" style={{opacity: 0.6}}>
                                    <div className="link-icon">📂</div>
                                    <div className="link-details"><strong>No Source Code Link</strong></div>
                                </div>
                            )}

                            {/* Live Demo Link */}
                            {submission.liveLink ? (
                                <a href={submission.liveLink} target="_blank" rel="noopener noreferrer" className="link-card">
                                    <div className="link-icon">🚀</div>
                                    <div className="link-details">
                                        <strong>Live Demo</strong>
                                        <span>View Deployment</span>
                                    </div>
                                </a>
                            ) : (
                                <div className="link-card" style={{opacity: 0.6}}>
                                    <div className="link-icon">🚀</div>
                                    <div className="link-details"><strong>No Live Link</strong></div>
                                </div>
                            )}

                            {/* Video Link */}
                            {submission.videoLink ? (
                                <a href={submission.videoLink} target="_blank" rel="noopener noreferrer" className="link-card">
                                    <div className="link-icon">🎥</div>
                                    <div className="link-details">
                                        <strong>Video Walkthrough</strong>
                                        <span>Watch Demo</span>
                                    </div>
                                </a>
                            ) : (
                                <div className="link-card" style={{opacity: 0.6}}>
                                    <div className="link-icon">🎥</div>
                                    <div className="link-details"><strong>No Video Link</strong></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="back-btn-container">
                        <button className="back-dashboard-btn" onClick={() => navigate(-1)}>
                            &larr; Back to Dashboard
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default CompletedProjectDetails;