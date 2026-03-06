import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- CORRECTED IMPORTS BASED ON YOUR FOLDER STRUCTURE ---
import Navbar from '../Navbar/Navbar'; // Goes up one level to Components, then into Navbar
import JobCard from './JobCard';       // Stays in the same Jobs folder

const AIJobsPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAIJobs = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Call our new AI matching endpoint
                const { data } = await axios.get('http://localhost:5000/api/jobs/match-profile', config);
                setJobs(data);
            } catch (err) {
                console.error("Error fetching AI jobs:", err);
                setError(err.response?.data?.message || "Failed to load personalized jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchAIJobs();
    }, [navigate]);

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{
                    background: 'none', border: 'none', color: '#6c5ce7', 
                    cursor: 'pointer', fontSize: '1rem', marginBottom: '20px'
                }}>
                    &larr; Go Back
                </button>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>
                        ✨ Smart Job Aggregator
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        We analyzed your profile skills and scoured the web to find your perfect matches.
                    </p>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h2 style={{ color: '#6c5ce7' }}>Scanning Job Boards...</h2>
                        <p>This might take a few seconds.</p>
                    </div>
                )}

                {error && (
                    <div style={{ textAlign: 'center', color: '#e74c3c', marginTop: '50px' }}>
                        <h2>Oops!</h2>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px' 
                    }}>
                        {jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <JobCard key={job._id || index} job={job} />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
                                <h2>No matches found right now.</h2>
                                <p>Try updating your profile with more skills!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIJobsPage;