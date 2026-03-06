import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Adjust path as needed
import './AllocateProject.css'; // Ensure CSS exists
// import Loader from '../Loader/Loader'; // Optional

const AllocateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: '', // Input as comma-separated string
        budget: '',
        deadline: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const [success, setSuccess] = useState(''); // Removed success state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // setSuccess(''); // Removed
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to allocate a project.');
            setLoading(false);
            return;
        }

        if (!formData.title || !formData.description || !formData.skillsRequired || !formData.budget) {
             setError('Please fill in Title, Description, Skills, and Budget.');
             setLoading(false);
             return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const dataToSubmit = {
                 ...formData,
                 budget: Number(formData.budget)
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/projects',
                dataToSubmit,
                config
            );

            setLoading(false);
            console.log('Project created:', data);

            // --- Updated Success Handling ---
            // 1. Show alert (pauses execution)
            alert('Project allocated successfully!');

            // 2. Navigate back AFTER alert is dismissed
            navigate(-1);
            // --- End Update ---

        } catch (err) {
            setLoading(false);
            setError(
                err.response?.data?.message || 'Failed to allocate project. Please try again.'
            );
            console.error("Project allocation error:", err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="allocate-project-container">
                {/* {loading && <Loader />} */}
                <button onClick={() => navigate(-1)} className="back-btn-form">
                    &larr; Go Back
                </button>
                <form className="allocate-project-form" onSubmit={handleSubmit}>
                    <h1>Allocate a New Project</h1>
                    <p>Provide details for the project you want freelancers to work on.</p>

                    {error && <p className="error-message">{error}</p>}
                    {/* Removed success message display */}
                    {/* {success && <p className="success-message">{success}</p>} */}

                    {/* --- Form fields remain the same --- */}
                    <div className="form-group">
                        <label htmlFor="title">Project Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                         <label htmlFor="description">Project Description</label>
                         <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="6" required />
                     </div>
                     <div className="form-group">
                         <label htmlFor="skillsRequired">Required Skills (comma-separated)</label>
                         <input type="text" id="skillsRequired" name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} placeholder="e.g., React, Node.js, Figma" required />
                     </div>
                     <div className="form-row">
                          <div className="form-group">
                             <label htmlFor="budget">Budget ($)</label>
                             <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} step="1" min="0" required />
                          </div>
                          <div className="form-group">
                             <label htmlFor="deadline">Deadline (Optional)</label>
                             <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} />
                          </div>
                     </div>

                    <button type="submit" className="submit-allocate-btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Allocate Project'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AllocateProject;