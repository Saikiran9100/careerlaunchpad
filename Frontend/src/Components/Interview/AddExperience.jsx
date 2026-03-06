import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Adjust path if needed
import './AddExperience.css'; // Ensure CSS file exists
// import Loader from '../Loader/Loader'; // Optional

const AddExperience = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        collegeName: '',
        companyName: '',
        roleAppliedFor: '',
        packageLPA: '',
        interviewDate: '',
        interviewQuestions: '', // This will be a string
        experienceDetails: '',
        tipsOrRemarks: '',
        difficulty: 'Medium',
        offerReceived: null, // null, true, or false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'offerReceived') {
            setFormData(prev => ({ ...prev, offerReceived: value === 'yes' ? true : false }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // --- THIS IS THE FIX ---
        // Added 'interviewQuestions' to the validation check.
        if (!formData.collegeName || !formData.companyName || !formData.roleAppliedFor || !formData.experienceDetails || !formData.interviewQuestions) {
            setError('Please fill in all required fields marked with *');
            return;
        }
        // --- END OF FIX ---

        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to share an experience.');
            setLoading(false);
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Prepare data for backend
        const dataToSubmit = {
            ...formData,
            // Convert questions string to an array by splitting on new lines
            interviewQuestions: formData.interviewQuestions.split('\n').filter(q => q.trim() !== ''),
            packageLPA: Number(formData.packageLPA) || 0
        };

        try {
            await axios.post('http://localhost:5000/api/interviews', dataToSubmit, config);
            
            setSuccess('Experience shared successfully! Thank you.');
            setLoading(false);
            // Clear form and navigate back
            setTimeout(() => {
                navigate(-1); // Go back to the previous page
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit experience.');
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="add-experience-container">
                <button onClick={() => navigate(-1)} className="back-btn-form">
                    &larr; Go Back
                </button>
                <form className="add-experience-form" onSubmit={handleSubmit}>
                    <h1>Share Your Interview Experience</h1>
                    <p>Help your peers by sharing your journey. Fields marked with * are required.</p>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <div className="form-group">
                        <label htmlFor="collegeName">College Name *</label>
                        <input type="text" id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name *</label>
                            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="roleAppliedFor">Role Applied For *</label>
                            <input type="text" id="roleAppliedFor" name="roleAppliedFor" value={formData.roleAppliedFor} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="packageLPA">Package (LPA)</label>
                            <input type="number" id="packageLPA" name="packageLPA" value={formData.packageLPA} onChange={handleChange} step="0.1" min="0" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="interviewDate">Interview Date</label>
                            <input type="date" id="interviewDate" name="interviewDate" value={formData.interviewDate} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="experienceDetails">Your Interview Experience (Details) *</label>
                        <textarea
                            id="experienceDetails"
                            name="experienceDetails"
                            value={formData.experienceDetails}
                            onChange={handleChange}
                            rows="7"
                            placeholder="Describe the rounds, what was asked, and how you felt..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="interviewQuestions">Interview Questions Asked *</label>
                        <textarea
                            id="interviewQuestions"
                            name="interviewQuestions"
                            value={formData.interviewQuestions}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Enter each question on a new line..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipsOrRemarks">Tips or Remarks (Optional)</label>
                        <textarea
                            id="tipsOrRemarks"
                            name="tipsOrRemarks"
                            value={formData.tipsOrRemarks}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Any advice for your peers?"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="difficulty">Interview Difficulty</label>
                            <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="form-group radio-group">
                            <label>Offer Received?</label>
                            <div className="radio-options">
                                <label><input type="radio" name="offerReceived" value="yes" checked={formData.offerReceived === true} onChange={handleChange} /> Yes</label>
                                <label><input type="radio" name="offerReceived" value="no" checked={formData.offerReceived === false} onChange={handleChange} /> No</label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-experience-btn" disabled={loading || success}>
                        {loading ? 'Submitting...' : (success ? 'Submitted!' : 'Submit Experience')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExperience;