


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Camera, Loader } from "lucide-react"; 
// import "./FreelancerProfile.css"; 
// import Navbar from "../Navbar/Navbar"; 

// // --- Helper Components ---

// const SectionCard = ({
//     title, data, fields, editMode, handleChange,
//     addItem, removeItem, section, template,
// }) => (
//     <div className="section-card">
//         <h4>{title}</h4>
//         {Array.isArray(data) && data.map((item, idx) => (
//             <div className="card-item" key={idx}>
//                 {editMode ? (
//                     <div className="edit-mode-item">
//                         <div className="inputs">
//                             {fields.map((f) =>
//                                 f === "description" ? (
//                                     <textarea
//                                         key={f}
//                                         value={item[f] || ''}
//                                         placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
//                                         onChange={(e) =>
//                                             handleChange(section, idx, f, e.target.value)
//                                         }
//                                     />
//                                 ) : (
//                                     <input
//                                         key={f}
//                                         value={item[f] || ''}
//                                         placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
//                                         onChange={(e) =>
//                                             handleChange(section, idx, f, e.target.value)
//                                         }
//                                     />
//                                 )
//                             )}
//                         </div>
//                         <button
//                             className="remove-btn"
//                             onClick={() => removeItem(section, idx)}
//                         >
//                             ×
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="view-mode-item">
//                         <h5>{item.title || item.degree || item.name}</h5>
//                         {(item.company || item.school) && (
//                             <p className="subtitle">
//                                 {item.company || item.school} • {item.duration || item.year}
//                             </p>
//                         )}
//                         {item.description && <p>{item.description}</p>}
//                         {item.link && (
//                             <a href={item.link} target="_blank" rel="noopener noreferrer">
//                                 View Project
//                             </a>
//                         )}
//                          {item.tech && <p className="tech-stack"><strong>Tech:</strong> {item.tech}</p>}
//                     </div>
//                 )}
//             </div>
//         ))}
//         {editMode && (
//             <button className="add-btn" onClick={() => addItem(section, template)}>
//                 + Add {title.slice(0, -1)}
//             </button>
//         )}
//     </div>
// );

// const WorkHistoryCard = ({ data }) => (
//     <div className="section-card">
//         <h4>Platform Work History (Verified)</h4>
//         {Array.isArray(data) && data.length > 0 ? (
//             data.map((item, idx) => (
//                 <div className="card-item" key={idx}>
//                     <div className="view-mode-item">
//                         <h5>{item.projectTitle}</h5>
//                         <p className="subtitle">
//                             Client: {item.companyName} • Finished: {new Date(item.completedAt).toLocaleDateString()}
//                         </p>
//                         {item.description && <p className="project-overview">Overview: {item.description}</p>}
                        
//                         <div className="project-links" style={{marginTop: '10px', display:'flex', gap:'15px'}}>
//                             {item.repoLink && (
//                                 <a href={item.repoLink} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', fontWeight:'bold'}}>
//                                     Git Repo
//                                 </a>
//                             )}
//                             {item.liveLink && (
//                                 <a href={item.liveLink} target="_blank" rel="noopener noreferrer" style={{color: '#28a745', fontWeight:'bold'}}>
//                                     Live Deployment
//                                 </a>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             ))
//         ) : (
//             <p style={{ color: '#666', fontStyle: 'italic' }}>No completed projects on the platform yet.</p>
//         )}
//     </div>
// );

// const CustomerSupportButton = () => (
//     <a href="tel:+1234567890" className="customer-support-btn" aria-label="Call Customer Support">
//         <span className="phone-icon">&#9742;</span>
//     </a>
// );


// // --- Main Component ---
// const FreelancerProfile = () => {
//     const [editMode, setEditMode] = useState(false);
    
//     const [profile, setProfile] = useState(null); 
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isMyProfile, setIsMyProfile] = useState(false);
    
//     const [saveLoading, setSaveLoading] = useState(false);
//     const [uploading, setUploading] = useState(false); 
//     const [refresh, setRefresh] = useState(0); 

//     const { id: urlId } = useParams();
//     const navigate = useNavigate();

//     // --- DATA FETCHING ---
//     useEffect(() => {
//         const fetchProfile = async () => {
//             setLoading(true);
//             setError(null);
            
//             const myId = localStorage.getItem('userId'); 
//             const isMe = !urlId || (urlId === myId);
//             setIsMyProfile(isMe);

//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError("You must be logged in to view this page.");
//                 setLoading(false);
//                 navigate('/login');
//                 return;
//             }

//             const config = { headers: { Authorization: `Bearer ${token} `} };
//             const url = isMe 
//                 ? 'http://localhost:5000/api/profile/me'
//                 : `http://localhost:5000/api/profile/${urlId}`;

//             try {
//                 const { data } = await axios.get(url, config);
                
//                 const adaptedData = {
//                     ...data,
//                     name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User',
//                     education: data.education || [],
//                     experience: data.experience || [],
//                     projects: data.projects || [], 
//                     workHistory: data.workHistory || [], 
//                     reviews: data.reviews || [],
//                     skills: data.skills || [],
//                     profileImage: data.profileImage || 'https://i.imgur.com/6VBx3io.png'
//                 };
                
//                 setProfile(adaptedData);

//             } catch (err) {
//                 console.error("Error fetching profile:", err);
//                 setError(err.response?.data?.message || "Failed to load profile.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProfile();
//     }, [urlId, navigate, refresh]); 

//     // --- State Update Handlers ---
//     const handleChange = (section, index, field, value) => {
//         setProfile(prevProfile => {
//             const updated = { ...prevProfile };
//             if (index !== null && Array.isArray(updated[section])) {
//                 updated[section] = [...updated[section]];
//                 updated[section][index] = { ...updated[section][index], [field]: value };
//             } else {
//                 updated[section] = value;
//             }
//             return updated;
//         });
//     };

//     const addItem = (section, template) => {
//         setProfile(prevProfile => ({
//             ...prevProfile,
//             [section]: [...(prevProfile[section] || []), { ...template }]
//         }));
//     };

//     const removeItem = (section, index) => {
//         setProfile(prevProfile => ({
//             ...prevProfile,
//             [section]: prevProfile[section].filter((_, i) => i !== index)
//         }));
//     };

//     // --- Image Upload Handler ---
//     const handleImageChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append('image', file);
        
//         setUploading(true);

//         try {
//             const token = localStorage.getItem('token');
//             const config = {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${token}`
//                 },
//             };

//             const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
//             setProfile(prev => ({ ...prev, profileImage: data }));
//             setUploading(false);
            
//         } catch (error) {
//             console.error(error);
//             setUploading(false);
//             alert('Image upload failed');
//         }
//     };

//     // --- Save Profile Handler ---
//     const handleSaveProfile = async () => {
//         setSaveLoading(true);
//         setError(null);
        
//         const token = localStorage.getItem('token');
//         const config = { headers: { Authorization: `Bearer ${token}` } };
        
//         try {
//             const [firstName, ...lastNameParts] = profile.name.split(' ');
//             const lastName = lastNameParts.join(' ');

//             const dataToSend = { ...profile, firstName, lastName };
            
//             await axios.put('http://localhost:5000/api/profile/me', dataToSend, config);

//             setEditMode(false); 
//             alert("Profile updated successfully!"); 
            
//             setRefresh(prev => prev + 1); 

//         } catch (err) {
//              console.error("Error saving profile:", err);
//              setError(err.response?.data?.message || "Failed to save profile.");
//         } finally {
//             setSaveLoading(false);
//         }
//     };

//     // --- Helper for Image URL ---
//     const getImageUrl = (path) => {
//         if (!path) return 'https://i.imgur.com/6VBx3io.png';
//         if (path.startsWith('http')) return path;
//         return `http://localhost:5000${path}`;
//     };

//     const renderStars = (rating) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 >= 0.5;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <>
//                 {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star full">&#9733;</span>)}
//                 {halfStar && <span className="star half">&#9733;</span>}
//                 {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star empty">&#9733;</span>)}
//             </>
//         );
//     };

//     // --- Clean Title Logic ---
//     const getProjectDisplayName = (name) => {
//         // If name exists and is not just whitespace, use it.
//         // If it's "Anonymous" or empty, fallback to "Untitled Project".
//         if (name && name.trim() !== '' && name !== 'Anonymous') {
//             return name;
//         }
//         return "Untitled Project";
//     };

//     if (loading) return (
//         <>
//             <Navbar />
//             <div className="profile-page loading"><p>Loading profile...</p></div>
//         </>
//     );

//     if (error) return (
//         <>
//             <Navbar />
//             <div className="profile-page error">
//                 <p className="error-message">{error}</p>
//                 <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>
//             </div>
//         </>
//     );
    
//     if (!profile) return (
//         <>
//             <Navbar />
//             <div className="profile-page error"><p>Profile not found.</p></div>
//         </>
//     );

//     return (
//         <>
//             <Navbar />
//             <div className="profile-page">
//                 {/* Profile Header */}
//                 <div className="profile-header">
//                     <div className="profile-left">
//                         <div className="profile-image-container" style={{ position: 'relative', width: '150px', height: '150px' }}>
//                             <div className="profile-image" style={{ width: '100%', height: '100%' }}>
//                                 <img 
//                                     src={getImageUrl(profile.profileImage)}
//                                     alt="Profile" 
//                                     style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
//                                     onError={(e) => { e.target.onerror = null; e.target.src='https://i.imgur.com/6VBx3io.png' }}
//                                 />
//                             </div>

//                             {isMyProfile && editMode && (
//                                 <>
//                                     <label 
//                                         htmlFor="freelancer-image-upload" 
//                                         className="image-upload-overlay"
//                                         style={{
//                                             position: 'absolute', bottom: '5px', right: '5px',
//                                             backgroundColor: '#007bff', color: 'white',
//                                             width: '40px', height: '40px', borderRadius: '50%',
//                                             display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                             cursor: 'pointer', border: '3px solid white'
//                                         }}
//                                     >
//                                         {uploading ? <Loader className="animate-spin w-5 h-5" /> : <Camera className="w-5 h-5" />}
//                                     </label>
//                                     <input 
//                                         id="freelancer-image-upload" 
//                                         type="file" 
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         style={{ display: 'none' }}
//                                     />
//                                 </>
//                             )}
//                         </div>

//                     </div>
//                     <div className="profile-right">
//                         <div className="basic-info">
//                             {editMode ? (
//                                 <div className="edit-basic-info">
//                                     <input
//                                         className="input-lg"
//                                         value={profile.name}
//                                         onChange={(e) => handleChange("name", null, null, e.target.value)}
//                                         placeholder="Full Name"
//                                     />
//                                     <input
//                                         value={profile.title}
//                                         onChange={(e) => handleChange("title", null, null, e.target.value)}
//                                         placeholder="Title"
//                                     />
//                                     <textarea
//                                         value={profile.bio}
//                                         onChange={(e) => handleChange("bio", null, null, e.target.value)}
//                                         placeholder="Bio"
//                                     />
//                                 </div>
//                             ) : (
//                                 <>
//                                     <h1>{profile.name}</h1>
//                                     <h3>{profile.title}</h3>
//                                     <p className="bio">{profile.bio}</p>
//                                 </>
//                             )}
//                         </div>
//                         <div className="profile-highlights">
//                             <div><strong>{profile.completedProjects}</strong><span>Projects Completed</span></div>
//                             <div><strong>{profile.rating.toFixed(1)}</strong><span>Rating {renderStars(profile.rating)}</span></div>
//                             <div><strong>{Array.isArray(profile.reviews) ? profile.reviews.length : 0}</strong><span>Reviews</span></div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="main-content">
//                     <div className="profile-details-column">
                        
//                         {/* 1. Details Section */}
//                         <div className="section-card">
//                             <h4>Details</h4>
//                             <div className="info-grid">
//                                 {editMode ? (
//                                     <>
//                                         <input value={profile.rate} onChange={(e) => handleChange("rate", null, null, e.target.value)} placeholder="Rate" />
//                                         <input value={profile.location} onChange={(e) => handleChange("location", null, null, e.target.value)} placeholder="Location" />
//                                         <input value={profile.availability} onChange={(e) => handleChange("availability", null, null, e.target.value)} placeholder="Availability" />
//                                         <input value={profile.age || ''} type="number" onChange={(e) => handleChange("age", null, null, e.target.value)} placeholder="Age" />
//                                         <select value={profile.gender || 'Prefer not to say'} onChange={(e) => handleChange("gender", null, null, e.target.value)}>
//                                             <option>Female</option>
//                                             <option>Male</option>
//                                             <option>Other</option>
//                                             <option>Prefer not to say</option>
//                                         </select>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <p><strong>Rate:</strong> {profile.rate}</p>
//                                         <p><strong>Location:</strong> {profile.location}</p>
//                                         <p><strong>Availability:</strong> {profile.availability}</p>
//                                         {profile.age && <p><strong>Age:</strong> {profile.age}</p>}
//                                         {profile.gender && <p><strong>Gender:</strong> {profile.gender}</p>}
//                                     </>
//                                 )}
//                             </div>
//                         </div>

//                         {/* 2. Skills Section */}
//                         <div className="section-card">
//                             <h4>Skills</h4>
//                             {editMode ? (
//                                 <textarea
//                                     value={Array.isArray(profile.skills) ? profile.skills.join(", ") : ''}
//                                     onChange={(e) =>
//                                         setProfile(prev => ({
//                                             ...prev,
//                                             skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
//                                         }))
//                                     }
//                                     placeholder="Skills comma-separated"
//                                     rows={4}
//                                 />
//                             ) : (
//                                 <div className="skills-list">
//                                     {Array.isArray(profile.skills) && profile.skills.map((s, i) => <span key={i} className="skill">{s}</span>)}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="profile-sections">
                        
//                         {/* 3. Automatic Work History */}
//                         <WorkHistoryCard data={profile.workHistory} />

//                         {/* 4. Manual/Academic Projects */}
//                         <SectionCard
//                             title="Academic / Personal Projects"
//                             data={profile.projects}
//                             fields={["name", "link", "tech", "description"]}
//                             editMode={editMode} handleChange={handleChange}
//                             addItem={addItem} removeItem={removeItem}
//                             section="projects"
//                             template={{ name: "", link: "", tech: "", description: "" }}
//                         />

//                         {/* 5. Experience */}
//                         <SectionCard
//                             title="Experience"
//                             data={profile.experience}
//                             fields={["title", "company", "duration", "description"]}
//                             editMode={editMode} handleChange={handleChange}
//                             addItem={addItem} removeItem={removeItem}
//                             section="experience"
//                             template={{ title: "", company: "", duration: "", description: "" }}
//                         />

//                         {/* 6. Education */}
//                         <SectionCard
//                             title="Education"
//                             data={profile.education}
//                             fields={["degree", "school", "year"]}
//                             editMode={editMode} handleChange={handleChange}
//                             addItem={addItem} removeItem={removeItem}
//                             section="education"
//                             template={{ degree: "", school: "", year: "" }}
//                         />

//                         {/* 7. Reviews Section (Strict Project Title) */}
//                         <div className="section-card">
//                             <h4>Customer Reviews</h4>
//                             {Array.isArray(profile.reviews) && profile.reviews.length > 0 ? (
//                                 profile.reviews.map((r, i) => (
//                                     <div className="review" key={i}>
//                                         <p className="review-header">
//                                             {/* Calls the clean display function */}
//                                             <strong style={{color: '#333'}}>
//                                                 Project: {getProjectDisplayName(r.name)}
//                                             </strong> 
//                                             <span className="review-rating">{renderStars(r.rating)}</span>
//                                         </p>
//                                         <p className="review-feedback" style={{fontStyle:'italic', color:'#555'}}>"{r.comment || r.feedback}"</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>No reviews yet.</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Edit/Save/Contact Buttons */}
//                 <div className="profile-actions">
//                     {isMyProfile && (
//                         <button
//                             className="action-btn primary"
//                             onClick={() => {
//                                 if (editMode) {
//                                     handleSaveProfile();
//                                 } else {
//                                     setEditMode(true);
//                                 }
//                             }}
//                             disabled={saveLoading}
//                         >
//                             {saveLoading ? "Saving..." : (editMode ? "Save Profile" : "Edit Profile")}
//                         </button>
//                     )}
                    
//                     {isMyProfile && editMode && (
//                         <button 
//                            className="action-btn secondary" 
//                            onClick={() => {
//                                setEditMode(false);
//                                setRefresh(prev => prev + 1); 
//                            }}
//                            disabled={saveLoading}
//                         >
//                            Cancel
//                         </button>
//                     )}

//                     {!isMyProfile && !editMode && (
//                         <button className="action-btn secondary">
//                             Contact {profile.name}
//                         </button>
//                     )}
//                 </div>

//                 <CustomerSupportButton />
//             </div>
//         </>
//     );
// };

// export default FreelancerProfile;




import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Loader } from "lucide-react"; 
import "./FreelancerProfile.css"; 
import Navbar from "../Navbar/Navbar"; 

const SectionCard = ({
    title, data, fields, editMode, handleChange,
    addItem, removeItem, section, template,
}) => (
    <div className="section-card">
        <h4>{title}</h4>
        {Array.isArray(data) && data.map((item, idx) => (
            <div className="card-item" key={idx}>
                {editMode ? (
                    <div className="edit-mode-item">
                        <div className="inputs">
                            {fields.map((f) =>
                                f === "description" ? (
                                    <textarea
                                        key={f}
                                        value={item[f] || ''}
                                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                                        onChange={(e) =>
                                            handleChange(section, idx, f, e.target.value)
                                        }
                                    />
                                ) : (
                                    <input
                                        key={f}
                                        value={item[f] || ''}
                                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                                        onChange={(e) =>
                                            handleChange(section, idx, f, e.target.value)
                                        }
                                    />
                                )
                            )}
                        </div>
                        <button
                            className="remove-btn"
                            onClick={() => removeItem(section, idx)}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="view-mode-item">
                        <h5>{item.title || item.degree || item.name}</h5>
                        {(item.company || item.school) && (
                            <p className="subtitle">
                                {item.company || item.school} • {item.duration || item.year}
                            </p>
                        )}
                        {item.description && <p>{item.description}</p>}
                        {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                View Project
                            </a>
                        )}
                         {item.tech && <p className="tech-stack"><strong>Tech:</strong> {item.tech}</p>}
                    </div>
                )}
            </div>
        ))}
        {editMode && (
            <button className="add-btn" onClick={() => addItem(section, template)}>
                + Add {title.slice(0, -1)}
            </button>
        )}
    </div>
);

const WorkHistoryCard = ({ data }) => (
    <div className="section-card">
        <h4>Platform Work History (Verified)</h4>
        {Array.isArray(data) && data.length > 0 ? (
            data.map((item, idx) => (
                <div className="card-item" key={idx}>
                    <div className="view-mode-item">
                        <h5>{item.projectTitle}</h5>
                        <p className="subtitle">
                            Client: {item.companyName} • Finished: {new Date(item.completedAt).toLocaleDateString()}
                        </p>
                        {item.description && <p className="project-overview">Overview: {item.description}</p>}
                        
                        <div className="project-links" style={{marginTop: '10px', display:'flex', gap:'15px'}}>
                            {item.repoLink && (
                                <a href={item.repoLink} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', fontWeight:'bold'}}>
                                    Git Repo
                                </a>
                            )}
                            {item.liveLink && (
                                <a href={item.liveLink} target="_blank" rel="noopener noreferrer" style={{color: '#28a745', fontWeight:'bold'}}>
                                    Live Deployment
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No completed projects on the platform yet.</p>
        )}
    </div>
);

const CustomerSupportButton = () => (
    <a href="tel:+1234567890" className="customer-support-btn" aria-label="Call Customer Support">
        <span className="phone-icon">&#9742;</span>
    </a>
);

const FreelancerProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMyProfile, setIsMyProfile] = useState(false);
    
    const [saveLoading, setSaveLoading] = useState(false);
    const [uploading, setUploading] = useState(false); 
    const [refresh, setRefresh] = useState(0); 

    const { id: urlId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            
            const myId = localStorage.getItem('userId'); 
            const isMe = !urlId || (urlId === myId);
            setIsMyProfile(isMe);

            const token = localStorage.getItem('token');
            if (!token) {
                setError("You must be logged in to view this page.");
                setLoading(false);
                navigate('/login');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token} `} };
            const url = isMe 
                ? 'http://localhost:5000/api/profile/me'
                : `http://localhost:5000/api/profile/${urlId}`;

            try {
                const { data } = await axios.get(url, config);
                
                const adaptedData = {
                    ...data,
                    name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User',
                    education: data.education || [],
                    experience: data.experience || [],
                    projects: data.projects || [], 
                    workHistory: data.workHistory || [], 
                    reviews: data.reviews || [],
                    skills: data.skills || [],
                    profileImage: data.profileImage || 'https://i.imgur.com/6VBx3io.png'
                };
                
                setProfile(adaptedData);

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [urlId, navigate, refresh]); 

    const handleChange = (section, index, field, value) => {
        setProfile(prevProfile => {
            const updated = { ...prevProfile };
            if (index !== null && Array.isArray(updated[section])) {
                updated[section] = [...updated[section]];
                updated[section][index] = { ...updated[section][index], [field]: value };
            } else {
                updated[section] = value;
            }
            return updated;
        });
    };

    const addItem = (section, template) => {
        setProfile(prevProfile => ({
            ...prevProfile,
            [section]: [...(prevProfile[section] || []), { ...template }]
        }));
    };

    const removeItem = (section, index) => {
        setProfile(prevProfile => ({
            ...prevProfile,
            [section]: prevProfile[section].filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        
        setUploading(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
            setProfile(prev => ({ ...prev, profileImage: data }));
            setUploading(false);
            
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed');
        }
    };

    const handleSaveProfile = async () => {
        setSaveLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
            const [firstName, ...lastNameParts] = profile.name.split(' ');
            const lastName = lastNameParts.join(' ');

            // --- NEW: Clean the skills array cleanly right before saving to DB ---
            const cleanedSkills = Array.isArray(profile.skills) 
                ? profile.skills.map(s => typeof s === 'string' ? s.trim() : s).filter(Boolean) 
                : [];

            const dataToSend = { ...profile, firstName, lastName, skills: cleanedSkills };
            
            await axios.put('http://localhost:5000/api/profile/me', dataToSend, config);

            setEditMode(false); 
            alert("Profile updated successfully!"); 
            
            setRefresh(prev => prev + 1); 

        } catch (err) {
             console.error("Error saving profile:", err);
             setError(err.response?.data?.message || "Failed to save profile.");
        } finally {
            setSaveLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://i.imgur.com/6VBx3io.png';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star full">&#9733;</span>)}
                {halfStar && <span className="star half">&#9733;</span>}
                {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star empty">&#9733;</span>)}
            </>
        );
    };

    const getProjectDisplayName = (name) => {
        if (name && name.trim() !== '' && name !== 'Anonymous') {
            return name;
        }
        return "Untitled Project";
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="profile-page loading"><p>Loading profile...</p></div>
        </>
    );

    if (error) return (
        <>
            <Navbar />
            <div className="profile-page error">
                <p className="error-message">{error}</p>
                <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>
            </div>
        </>
    );
    
    if (!profile) return (
        <>
            <Navbar />
            <div className="profile-page error"><p>Profile not found.</p></div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-left">
                        <div className="profile-image-container" style={{ position: 'relative', width: '150px', height: '150px' }}>
                            <div className="profile-image" style={{ width: '100%', height: '100%' }}>
                                <img 
                                    src={getImageUrl(profile.profileImage)}
                                    alt="Profile" 
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src='https://i.imgur.com/6VBx3io.png' }}
                                />
                            </div>

                            {isMyProfile && editMode && (
                                <>
                                    <label 
                                        htmlFor="freelancer-image-upload" 
                                        className="image-upload-overlay"
                                        style={{
                                            position: 'absolute', bottom: '5px', right: '5px',
                                            backgroundColor: '#007bff', color: 'white',
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', border: '3px solid white'
                                        }}
                                    >
                                        {uploading ? <Loader className="animate-spin w-5 h-5" /> : <Camera className="w-5 h-5" />}
                                    </label>
                                    <input 
                                        id="freelancer-image-upload" 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </>
                            )}
                        </div>

                    </div>
                    <div className="profile-right">
                        <div className="basic-info">
                            {editMode ? (
                                <div className="edit-basic-info">
                                    <input
                                        className="input-lg"
                                        value={profile.name}
                                        onChange={(e) => handleChange("name", null, null, e.target.value)}
                                        placeholder="Full Name"
                                    />
                                    <input
                                        value={profile.title}
                                        onChange={(e) => handleChange("title", null, null, e.target.value)}
                                        placeholder="Title"
                                    />
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => handleChange("bio", null, null, e.target.value)}
                                        placeholder="Bio"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1>{profile.name}</h1>
                                    <h3>{profile.title}</h3>
                                    <p className="bio">{profile.bio}</p>
                                </>
                            )}
                        </div>
                        <div className="profile-highlights">
                            <div><strong>{profile.completedProjects}</strong><span>Projects Completed</span></div>
                            <div><strong>{profile.rating.toFixed(1)}</strong><span>Rating {renderStars(profile.rating)}</span></div>
                            <div><strong>{Array.isArray(profile.reviews) ? profile.reviews.length : 0}</strong><span>Reviews</span></div>
                        </div>
                    </div>
                </div>

                <div className="main-content">
                    <div className="profile-details-column">
                        
                        <div className="section-card">
                            <h4>Details</h4>
                            <div className="info-grid">
                                {editMode ? (
                                    <>
                                        <input value={profile.rate} onChange={(e) => handleChange("rate", null, null, e.target.value)} placeholder="Rate" />
                                        <input value={profile.location} onChange={(e) => handleChange("location", null, null, e.target.value)} placeholder="Location" />
                                        <input value={profile.availability} onChange={(e) => handleChange("availability", null, null, e.target.value)} placeholder="Availability" />
                                        <input value={profile.age || ''} type="number" onChange={(e) => handleChange("age", null, null, e.target.value)} placeholder="Age" />
                                        <select value={profile.gender || 'Prefer not to say'} onChange={(e) => handleChange("gender", null, null, e.target.value)}>
                                            <option>Female</option>
                                            <option>Male</option>
                                            <option>Other</option>
                                            <option>Prefer not to say</option>
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Rate:</strong> {profile.rate}</p>
                                        <p><strong>Location:</strong> {profile.location}</p>
                                        <p><strong>Availability:</strong> {profile.availability}</p>
                                        {profile.age && <p><strong>Age:</strong> {profile.age}</p>}
                                        {profile.gender && <p><strong>Gender:</strong> {profile.gender}</p>}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="section-card">
                            <h4>Skills</h4>
                            {editMode ? (
                                // --- NEW: Fixes the comma disappearing bug by keeping raw string intact ---
                                <textarea
                                    value={Array.isArray(profile.skills) ? profile.skills.join(",") : ''}
                                    onChange={(e) =>
                                        setProfile(prev => ({
                                            ...prev,
                                            skills: e.target.value.split(",")
                                        }))
                                    }
                                    placeholder="Java, React, Python... (Separate by commas)"
                                    rows={4}
                                />
                            ) : (
                                <div className="skills-list">
                                    {Array.isArray(profile.skills) && profile.skills.map((s, i) => <span key={i} className="skill">{s}</span>)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-sections">
                        <WorkHistoryCard data={profile.workHistory} />

                        <SectionCard
                            title="Academic / Personal Projects"
                            data={profile.projects}
                            fields={["name", "link", "tech", "description"]}
                            editMode={editMode} handleChange={handleChange}
                            addItem={addItem} removeItem={removeItem}
                            section="projects"
                            template={{ name: "", link: "", tech: "", description: "" }}
                        />

                        <SectionCard
                            title="Experience"
                            data={profile.experience}
                            fields={["title", "company", "duration", "description"]}
                            editMode={editMode} handleChange={handleChange}
                            addItem={addItem} removeItem={removeItem}
                            section="experience"
                            template={{ title: "", company: "", duration: "", description: "" }}
                        />

                        <SectionCard
                            title="Education"
                            data={profile.education}
                            fields={["degree", "school", "year"]}
                            editMode={editMode} handleChange={handleChange}
                            addItem={addItem} removeItem={removeItem}
                            section="education"
                            template={{ degree: "", school: "", year: "" }}
                        />

                        <div className="section-card">
                            <h4>Customer Reviews</h4>
                            {Array.isArray(profile.reviews) && profile.reviews.length > 0 ? (
                                profile.reviews.map((r, i) => (
                                    <div className="review" key={i}>
                                        <p className="review-header">
                                            <strong style={{color: '#333'}}>
                                                Project: {getProjectDisplayName(r.name)}
                                            </strong> 
                                            <span className="review-rating">{renderStars(r.rating)}</span>
                                        </p>
                                        <p className="review-feedback" style={{fontStyle:'italic', color:'#555'}}>"{r.comment || r.feedback}"</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    {isMyProfile && (
                        <button
                            className="action-btn primary"
                            onClick={() => {
                                if (editMode) {
                                    handleSaveProfile();
                                } else {
                                    setEditMode(true);
                                }
                            }}
                            disabled={saveLoading}
                        >
                            {saveLoading ? "Saving..." : (editMode ? "Save Profile" : "Edit Profile")}
                        </button>
                    )}
                    
                    {isMyProfile && editMode && (
                        <button 
                           className="action-btn secondary" 
                           onClick={() => {
                               setEditMode(false);
                               setRefresh(prev => prev + 1); 
                           }}
                           disabled={saveLoading}
                        >
                            Cancel
                        </button>
                    )}

                    {!isMyProfile && !editMode && (
                        <button className="action-btn secondary">
                            Contact {profile.name}
                        </button>
                    )}
                </div>

                <CustomerSupportButton />
            </div>
        </>
    );
};

export default FreelancerProfile;