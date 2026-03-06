import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Adjust path if needed depending on folder structure
import './SubmitProject.css';

const SubmitProject = () => {
    const { id } = useParams(); // Get Project ID from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        repoLink: '',
        liveLink: '',
        videoLink: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            // Send submission data to backend
            await axios.put(
                `http://localhost:5000/api/projects/${id}/submit`,
                formData,
                config
            );
            
            alert('Project submitted successfully!');
            navigate('/dashboard'); // Return to dashboard
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="submit-page-container">
                <div className="submit-card">
                    <h2>Submit Project Work</h2>
                    <p className="subtitle">Please provide the details of your completed work for the client to review.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>GitHub/GitLab Repository Link <span className="required">*</span></label>
                            <input 
                                type="url" 
                                name="repoLink" 
                                value={formData.repoLink} 
                                onChange={handleChange}
                                placeholder="https://github.com/username/project-repo"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Live Deployment Link (Optional)</label>
                            <input 
                                type="url" 
                                name="liveLink" 
                                value={formData.liveLink} 
                                onChange={handleChange}
                                placeholder="https://my-app.vercel.app"
                            />
                        </div>

                        <div className="form-group">
                            <label>Video Demo Link (Optional)</label>
                            <input 
                                type="url" 
                                name="videoLink" 
                                value={formData.videoLink} 
                                onChange={handleChange}
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Project Description & Usage Guide <span className="required">*</span></label>
                            <textarea 
                                name="description" 
                                rows="6"
                                value={formData.description} 
                                onChange={handleChange}
                                placeholder="Explain what you built, technologies used, and how to run the project..."
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn-submit" 
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SubmitProject;