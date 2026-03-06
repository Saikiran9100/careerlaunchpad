// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { sampleJobData } from './sampleJobData.js';
// import './JobDetail.css';

// const JobDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const job = sampleJobData.find(j => j.id === parseInt(id));

//     if (!job) {
//         return <div className="job-detail-container"><h2>Job not found</h2></div>;
//     }

//     return (
//         <div className="job-detail-container">
//             <button onClick={() => navigate(-1)} className="back-btn-job">
//                 &larr; Go Back
//             </button>
//             <div className="job-detail-header">
//                 <img src={job.logoUrl} alt={`${job.company} logo`} />
//                 <h1>{job.company}</h1>
//             </div>
//             <div className="job-detail-section">
//                 <h2>Job Description</h2>
//                 <p>{job.description}</p>
//                 <p><strong>Rating:</strong> {job.rating} ({job.reviews} reviews)</p>
//                 <p><strong>Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}</p>
//             </div>
//             <button className="apply-btn-job">Apply on Company Site</button>
//         </div>
//     );
// };

// export default JobDetail;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Assuming you want the Navbar here
import './JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJob(data);
            } catch (err) {
                console.error("Error fetching job detail:", err);
                setError("Job not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetail();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="job-detail-container"><h2>Loading job details...</h2></div>
            </>
        );
    }

    if (error || !job) {
        return (
            <>
                <Navbar />
                <div className="job-detail-container">
                    <h2>{error || "Job not found"}</h2>
                    <button onClick={() => navigate(-1)} className="back-btn-job">
                        &larr; Go Back
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="job-detail-container">
                <button onClick={() => navigate(-1)} className="back-btn-job">
                    &larr; Go Back
                </button>
                
                <div className="job-detail-header">
                    {job.logoUrl && <img src={job.logoUrl} alt={`${job.company} logo`} />}
                    <div>
                        <h1>{job.title}</h1>
                        <h3 style={{marginTop: '5px', color: '#555'}}>{job.company}</h3>
                    </div>
                </div>

                <div className="job-detail-section">
                    <h2>Job Description</h2>
                    <p>{job.description}</p>
                    
                    <div className="job-meta-info" style={{marginTop: '20px'}}>
                        <p><strong>Location:</strong> {job.location || 'Remote'}</p>
                        <p><strong>Rating:</strong> {job.rating} ({job.reviews} reviews)</p>
                        <p><strong>Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}</p>
                    </div>

                    {/* Display Skills if available */}
                    {job.skills && job.skills.length > 0 && (
                        <div style={{marginTop: '20px'}}>
                            <h3>Required Skills:</h3>
                            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px'}}>
                                {job.skills.map((skill, index) => (
                                    <span key={index} style={{
                                        backgroundColor: '#e3f2fd', 
                                        color: '#007bff', 
                                        padding: '5px 10px', 
                                        borderRadius: '15px',
                                        fontSize: '0.9rem'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <button 
                    className="apply-btn-job" 
                    onClick={() => window.open(job.applyLink || '#', '_blank')}
                >
                    Apply on Company Site
                </button>
            </div>
        </>
    );
};

export default JobDetail;