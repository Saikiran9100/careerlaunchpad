import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupForm.css'; // Make sure this CSS file exists
import axios from 'axios'; 

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'role',
        mobile: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
            setError('All fields are required.');
            return;
        }
        if (formData.role === 'role') {
            setError('Please select a valid role.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true); 

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const dataToSubmit = {
                fullName: formData.fullName,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
            };
            
            let apiEndpoint = '';

            // --- These URLs are now correct ---
            if (formData.role === 'freelancer') {
                apiEndpoint = '/api/auth/freelancer/register';
            } else if (formData.role === 'client') {
                apiEndpoint = '/api/auth/client/register';
            } else if (formData.role === 'student') {
                // --- THIS LINE IS UPDATED ---
                apiEndpoint = '/api/auth/student/register'; // Enable student registration
            }

            const { data } = await axios.post(
                `http://localhost:5000${apiEndpoint}`,
                dataToSubmit,
                config
            );

            // --- UPDATED SUCCESS HANDLING ---
            setLoading(false);
            
            // 1. Save user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role.toLowerCase());
            localStorage.setItem('userName', data.firstName);
            localStorage.setItem('userEmail', data.email);    
            
            // 2. Immediately navigate to home
            navigate('/'); 

        } catch (err) {
            setLoading(false);
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
        }
    };

    return (
        <div className="signup-page-wrapper">
            <div className="signup-card">
                
                <>
                    <h2>Create your Account</h2>
                    <div className="step-indicators">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        {error && <p className="error-message">{error}</p>}

                        <div className="input-group">
                            <span className="input-icon">👤</span>
                            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <span className="input-icon">✉️</span>
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                        </div>
                        
                        <div className="input-group">
                            <span className="input-icon">🧑‍💼</span>
                            <select
                                id="role-select" 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className='role-select'
                            >
                                <option value="role">Select Your Role</option>
                                <option value="freelancer">Freelancer</option>
                                <option value="client">Client</option>
                                <option value="student">Student</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <span className="input-icon">📱</span>
                            <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <span className="input-icon">🔒</span>
                            <input type="password" name="password" placeholder="Set Password" value={formData.password} onChange={handleChange} required />
                        </div>
                        
                        <button type="submit" className="submit-btn" disabled={loading}> 
                            {loading ? 'Creating Account...' : 'Create Account'} 
                        </button>
                    </form>

                    <p className="login-link"> Already have an account? <Link to="/login">Login here</Link> </p>
                </>
                
            </div>
        </div>
    );
};

export default SignupForm;