// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../Navbar/Navbar';
// import ExperienceCard from './ExperienceCard';
// import { sampleData } from './sampleData';
// import './AllExperiences.css';

// const AllExperiences = () => {
//     const navigate = useNavigate();
//     const [dbExperiences, setDbExperiences] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchExperiences = async () => {
//             setLoading(true);
//             setError('');
            
//             // --- THIS IS THE FIX ---
            
//             // 1. Get the token from localStorage
//             const token = localStorage.getItem('token');
            
//             // 2. Check if the user is logged in
//             if (!token) {
//                 // If not logged in, we can't fetch real interviews.
//                 // We'll just show sample data and stop.
//                 console.warn("No token found, showing sample data only.");
//                 setLoading(false);
//                 return; // Stop here, don't try to fetch
//             }

//             // 3. If token EXISTS, create the auth header
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };
//             // --- END OF FIX ---

//             try {
//                 // 4. Send the request with the config object
//                 const { data } = await axios.get('http://localhost:5000/api/interviews', config);
                
//                 setDbExperiences(Array.isArray(data) ? data : []);
                
//             } catch (err) {
//                 console.error("Error fetching experiences:", err);
//                 // The error "Not authorized, no token provided" would be caught here
//                 // if the token was invalid or missing.
//                 setError(err.response?.data?.message || 'Failed to load experiences.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchExperiences();
//     }, []); // Run once on mount

//     // Combine sample and DB data
//     const allExperiences = loading ? [] : (() => {
//         const combinedMap = new Map();
//         sampleData.forEach(exp => combinedMap.set(`sample-${exp.id}`, exp));
//         dbExperiences.forEach(exp => combinedMap.set(exp._id, exp));
//         return Array.from(combinedMap.values());
//     })();

//     return (
//         <div>
//             <Navbar />
//             <div className="all-experiences-container">
//                 <button onClick={() => navigate(-1)} className="back-btn-page">
//                     &larr; Go Back
//                 </button>
//                 <div className="all-experiences-header">
//                     <h1>Interview Experiences</h1>
//                     <p>Learn from the interview journeys of your peers and seniors.</p>
//                     <button 
//                         className="add-experience-btn" 
//                         onClick={() => navigate('/interview/new')}
//                     >
//                         + Share Your Experience
//                     </button>
//                 </div>

//                 {loading && <p>Loading experiences...</p>}
//                 {error && <p className="error-message">{error}</p>}
                
//                 {!loading && !error && (
//                     <div className="experiences-grid">
//                         {allExperiences.length > 0 ? (
//                             allExperiences.map(exp => (
//                                 <ExperienceCard 
//                                     key={exp._id || `sample-${exp.id}`} 
//                                     experience={exp} 
//                                 />
//                             ))
//                         ) : (
//                             <p>No experiences shared yet. Be the first!</p>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AllExperiences;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import ExperienceCard from './ExperienceCard';
import { sampleData } from './sampleData';
import './AllExperiences.css';

const AllExperiences = () => {
    const navigate = useNavigate();
    const [dbExperiences, setDbExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchExperiences = async () => {
            setLoading(true);
            setError('');
            
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.warn("No token found, showing sample data only.");
                setLoading(false);
                return; 
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            try {
                const { data } = await axios.get('http://localhost:5000/api/interviews', config);
                setDbExperiences(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching experiences:", err);
                setError(err.response?.data?.message || 'Failed to load experiences.');
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    // Combine sample and DB data
    const allExperiences = loading ? [] : (() => {
        const combinedMap = new Map();
        sampleData.forEach(exp => combinedMap.set(`sample-${exp.id}`, exp));
        dbExperiences.forEach(exp => combinedMap.set(exp._id, exp));
        return Array.from(combinedMap.values());
    })();

    // Filter Logic
    const filteredExperiences = allExperiences.filter((exp) => {
        const company = exp.companyName || ''; 
        return company.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div>
            <Navbar />
            <div className="all-experiences-container">
                <button onClick={() => navigate(-1)} className="back-btn-page">
                    &larr; Go Back
                </button>
                
                <div className="all-experiences-header">
                    <h1>Interview Experiences</h1>
                    
                    {/* --- CHANGED LAYOUT HERE --- */}
                    <div className="experience-actions-row">
                        <div className="search-bar-container">
                            <input 
                                type="text" 
                                placeholder="Search by Company (e.g. Google)..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="experience-search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        <button 
                            className="add-experience-btn" 
                            onClick={() => navigate('/interview/new')}
                        >
                            + Share Your Experience
                        </button>
                    </div>
                    {/* --- END CHANGES --- */}
                </div>

                {loading && <p>Loading experiences...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {!loading && !error && (
                    <div className="experiences-grid">
                        {filteredExperiences.length > 0 ? (
                            filteredExperiences.map(exp => (
                                <ExperienceCard 
                                    key={exp._id || `sample-${exp.id}`} 
                                    experience={exp} 
                                />
                            ))
                        ) : (
                            <p className="no-results-msg">
                                {searchQuery 
                                    ? `No experiences found for "${searchQuery}"` 
                                    : "No experiences shared yet. Be the first!"}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllExperiences;