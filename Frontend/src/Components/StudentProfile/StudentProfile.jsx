


// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Camera, Loader } from "lucide-react"; 
// import "../FreelancerProfile/FreelancerProfile.css"; // Reusing styles
// import Navbar from "../Navbar/Navbar"; 

// // --- Helper Component ---
// const SectionCard = ({ title, data, fields, editMode, handleChange, addItem, removeItem, section, template }) => (
//     <div className="section-card">
//         <h4>{title}</h4>
//         {Array.isArray(data) && data.map((item, idx) => (
//             <div className="card-item" key={idx}>
//                 {editMode ? (
//                     <div className="edit-mode-item">
//                         <div className="inputs">
//                             {fields.map((f) =>
//                                 f === "description" ? (
//                                     <textarea key={f} value={item[f] || ''} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} onChange={(e) => handleChange(section, idx, f, e.target.value)} />
//                                 ) : (
//                                     <input key={f} value={item[f] || ''} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} onChange={(e) => handleChange(section, idx, f, e.target.value)} />
//                                 )
//                             )}
//                         </div>
//                         <button className="remove-btn" onClick={() => removeItem(section, idx)}>×</button>
//                     </div>
//                 ) : (
//                     <div className="view-mode-item">
//                         <h5>{item.title || item.degree || item.name}</h5>
//                         {(item.company || item.school) && <p className="subtitle">{item.company || item.school} • {item.duration || item.year}</p>}
//                         {item.description && <p>{item.description}</p>}
//                         {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">View Link</a>}
//                         {item.tech && <p className="tech-stack"><strong>Tech:</strong> {item.tech}</p>}
//                     </div>
//                 )}
//             </div>
//         ))}
//         {editMode && (
//             <button className="add-btn" onClick={() => addItem(section, template)}>+ Add {title.slice(0, -1)}</button>
//         )}
//     </div>
// );

// const StudentProfile = () => {
//     const [editMode, setEditMode] = useState(false);
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [uploading, setUploading] = useState(false);
//     const [saveLoading, setSaveLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [refresh, setRefresh] = useState(false); // To trigger re-fetch
    
//     const navigate = useNavigate();

//     // --- FETCH DATA ---
//     useEffect(() => {
//         const fetchProfile = async () => {
//             setLoading(true);
//             const token = localStorage.getItem('token');
//             const role = localStorage.getItem('userRole');

//             if (!token || role !== 'student') {
//                 setError("Access Denied. Students only.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const config = { headers: { Authorization: `Bearer ${token}` } };
//                 const { data } = await axios.get('http://localhost:5000/api/student/profile/me', config);

//                 setProfile({
//                     ...data,
//                     firstName: data.firstName || '',
//                     lastName: data.lastName || '',
//                     bio: data.bio || '',
//                     location: data.location || '',
//                     mobile: data.mobile || '',
//                     githubLink: data.githubLink || '',
//                     linkedinLink: data.linkedinLink || '',
//                     skills: data.skills || [],
//                     education: data.education || [], 
//                     projects: data.projects || [],   
//                     reviews: data.reviews || [], // Ensure reviews are loaded
//                     profileImage: data.profileImage || 'https://i.imgur.com/6VBx3io.png'
//                 });
//             } catch (err) {
//                 setError("Failed to load profile");
//                 console.log(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProfile();
//     }, [navigate, refresh]);

//     // --- HANDLERS ---
//     const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
    
//     const handleArrayChange = (section, index, field, value) => {
//         const updated = [...profile[section]];
//         updated[index] = { ...updated[index], [field]: value };
//         setProfile({ ...profile, [section]: updated });
//     };

//     const addItem = (section, template) => setProfile({ ...profile, [section]: [...profile[section], template] });
//     const removeItem = (section, index) => setProfile({ ...profile, [section]: profile[section].filter((_, i) => i !== index) });

//     const handleImageChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         const formData = new FormData();
//         formData.append('image', file);
//         setUploading(true);
//         try {
//             const token = localStorage.getItem('token');
//             const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
//             });
//             setProfile(prev => ({ ...prev, profileImage: data }));
//             setUploading(false);
//         } catch (err) {
//             setUploading(false);
//             alert("Upload failed");
//             console.log(err);
//         }
//     };

//     const handleSave = async () => {
//         setSaveLoading(true);
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put('http://localhost:5000/api/student/profile/me', profile, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setEditMode(false);
//             localStorage.setItem('userName', `${profile.firstName} ${profile.lastName}`);
//             alert("Profile Updated!");
//             setRefresh(prev => !prev);
//         } catch (err) {
//             alert("Failed to save");
//             console.log(err);
//         } finally {
//             setSaveLoading(false);
//         }
//     };

//     const getImageUrl = (path) => path?.startsWith('http') ? path : `http://localhost:5000${path}`;

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

//     if (loading) return <div className="profile-page loading">Loading...</div>;
//     if (error) return <div className="profile-page error">{error}</div>;

//     return (
//         <>
//             <Navbar />
//             <div className="profile-page">
//                 <div className="profile-header">
//                     <div className="profile-left">
//                         <div className="profile-image-container" style={{position:'relative', width:'150px', height:'150px'}}>
//                             <img src={getImageUrl(profile.profileImage)} alt="Profile" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} onError={(e) => { e.target.onerror = null; e.target.src='https://i.imgur.com/6VBx3io.png' }} />
//                             {editMode && (
//                                 <>
//                                     <label htmlFor="stu-img-upload" className="image-upload-overlay" style={{position:'absolute', bottom:0, right:0, background:'#007bff', borderRadius:'50%', padding:'8px', cursor:'pointer', color:'white'}}>
//                                         {uploading ? <Loader className="animate-spin w-4 h-4"/> : <Camera className="w-4 h-4"/>}
//                                     </label>
//                                     <input id="stu-img-upload" type="file" onChange={handleImageChange} style={{display:'none'}} />
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                     <div className="profile-right">
//                         <div className="basic-info">
//                             {editMode ? (
//                                 <div className="edit-basic-info">
//                                     <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" />
//                                     <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" />
//                                     <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Bio / Career Objective" rows={3} />
//                                 </div>
//                             ) : (
//                                 <>
//                                     <h1>{profile.firstName} {profile.lastName}</h1>
//                                     <p className="bio">{profile.bio || "No bio added yet."}</p>
//                                     <div className="student-badges" style={{marginTop:'10px'}}>
//                                         <span className="skill">🎓 Student</span>
//                                         {profile.rating > 0 && <span className="skill">⭐ {profile.rating.toFixed(1)} Rating</span>}
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="main-content">
//                     <div className="profile-details-column">
//                         <div className="section-card">
//                             <h4>Personal Details</h4>
//                             <div className="info-grid">
//                                 <div className="info-item"><label>Email</label><p>{profile.email}</p></div>
//                                 <div className="info-item">
//                                     <label>Mobile</label>
//                                     {editMode ? <input name="mobile" value={profile.mobile} onChange={handleChange} /> : <p>{profile.mobile || "Not set"}</p>}
//                                 </div>
//                                 <div className="info-item">
//                                     <label>Location</label>
//                                     {editMode ? <input name="location" value={profile.location} onChange={handleChange} /> : <p>{profile.location || "Not set"}</p>}
//                                 </div>
//                                 <div className="info-item">
//                                     <label>GitHub</label>
//                                     {editMode ? <input name="githubLink" value={profile.githubLink} onChange={handleChange} placeholder="https://github.com/..." /> : <p>{profile.githubLink ? <a href={profile.githubLink} target="_blank" rel="noreferrer">View GitHub</a> : "Not set"}</p>}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="section-card">
//                             <h4>Skills</h4>
//                             {editMode ? (
//                                 <textarea value={profile.skills.join(", ")} onChange={(e) => setProfile({...profile, skills: e.target.value.split(",").map(s=>s.trim())})} placeholder="Java, React, Python..." />
//                             ) : (
//                                 <div className="skills-list">{profile.skills.map((s,i) => <span key={i} className="skill">{s}</span>)}</div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="profile-sections">
//                         <SectionCard 
//                             title="Education" 
//                             data={profile.education} 
//                             fields={["degree", "school", "year"]} 
//                             editMode={editMode} 
//                             handleChange={handleArrayChange} 
//                             addItem={addItem} removeItem={removeItem} 
//                             section="education" 
//                             template={{ degree: "", school: "", year: "" }} 
//                         />
//                         <SectionCard 
//                             title="Academic Projects" 
//                             data={profile.projects} 
//                             fields={["name", "link", "tech", "description"]} 
//                             editMode={editMode} 
//                             handleChange={handleArrayChange} 
//                             addItem={addItem} removeItem={removeItem} 
//                             section="projects" 
//                             template={{ name: "", link: "", tech: "", description: "" }} 
//                         />
                        
//                         {/* --- CUSTOMER REVIEWS SECTION --- */}
//                         <div className="section-card">
//                             <h4>Customer Reviews</h4>
//                             {Array.isArray(profile.reviews) && profile.reviews.length > 0 ? (
//                                 profile.reviews.map((r, i) => (
//                                     <div className="review" key={i}>
//                                         <p className="review-header">
//                                             {/* Shows the company/client name saved in DB. Defaults to Anonymous if missing. */}
//                                             <strong>{r.name || 'Anonymous'}</strong> 
//                                             <span className="review-rating">{renderStars(r.rating)}</span>
//                                         </p>
//                                         <p className="review-feedback">"{r.comment}"</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>No reviews yet.</p>
//                             )}
//                         </div>

//                     </div>
//                 </div>

//                 <div className="profile-actions">
//                     {editMode ? (
//                         <>
//                             <button className="action-btn secondary" onClick={() => { setEditMode(false); setRefresh(p => !p); }}>Cancel</button>
//                             <button className="action-btn primary" onClick={handleSave} disabled={saveLoading}>{saveLoading ? "Saving..." : "Save Profile"}</button>
//                         </>
//                     ) : (
//                         <button className="action-btn primary" onClick={() => setEditMode(true)}>Edit Profile</button>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default StudentProfile;





import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Loader } from "lucide-react"; 
import "../FreelancerProfile/FreelancerProfile.css"; 
import Navbar from "../Navbar/Navbar"; 

const SectionCard = ({ title, data, fields, editMode, handleChange, addItem, removeItem, section, template }) => (
    <div className="section-card">
        <h4>{title}</h4>
        {Array.isArray(data) && data.map((item, idx) => (
            <div className="card-item" key={idx}>
                {editMode ? (
                    <div className="edit-mode-item">
                        <div className="inputs">
                            {fields.map((f) =>
                                f === "description" ? (
                                    <textarea key={f} value={item[f] || ''} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} onChange={(e) => handleChange(section, idx, f, e.target.value)} />
                                ) : (
                                    <input key={f} value={item[f] || ''} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} onChange={(e) => handleChange(section, idx, f, e.target.value)} />
                                )
                            )}
                        </div>
                        <button className="remove-btn" onClick={() => removeItem(section, idx)}>×</button>
                    </div>
                ) : (
                    <div className="view-mode-item">
                        <h5>{item.title || item.degree || item.name}</h5>
                        {(item.company || item.school) && <p className="subtitle">{item.company || item.school} • {item.duration || item.year}</p>}
                        {item.description && <p>{item.description}</p>}
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">View Link</a>}
                        {item.tech && <p className="tech-stack"><strong>Tech:</strong> {item.tech}</p>}
                    </div>
                )}
            </div>
        ))}
        {editMode && (
            <button className="add-btn" onClick={() => addItem(section, template)}>+ Add {title.slice(0, -1)}</button>
        )}
    </div>
);

const StudentProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false); 
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');

            if (!token || role !== 'student') {
                setError("Access Denied. Students only.");
                setLoading(false);
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/student/profile/me', config);

                setProfile({
                    ...data,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    bio: data.bio || '',
                    location: data.location || '',
                    mobile: data.mobile || '',
                    githubLink: data.githubLink || '',
                    linkedinLink: data.linkedinLink || '',
                    skills: data.skills || [],
                    education: data.education || [], 
                    projects: data.projects || [],   
                    reviews: data.reviews || [], 
                    profileImage: data.profileImage || 'https://i.imgur.com/6VBx3io.png'
                });
            } catch (err) {
                setError("Failed to load profile");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, refresh]);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
    
    const handleArrayChange = (section, index, field, value) => {
        const updated = [...profile[section]];
        updated[index] = { ...updated[index], [field]: value };
        setProfile({ ...profile, [section]: updated });
    };

    const addItem = (section, template) => setProfile({ ...profile, [section]: [...profile[section], template] });
    const removeItem = (section, index) => setProfile({ ...profile, [section]: profile[section].filter((_, i) => i !== index) });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            setProfile(prev => ({ ...prev, profileImage: data }));
            setUploading(false);
        } catch (err) {
            setUploading(false);
            alert("Upload failed");
            console.log(err);
        }
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // --- NEW: Clean the skills array cleanly right before saving to DB ---
            const cleanedSkills = Array.isArray(profile.skills) 
                ? profile.skills.map(s => s.trim()).filter(Boolean) 
                : [];
            
            const dataToSend = { ...profile, skills: cleanedSkills };

            await axios.put('http://localhost:5000/api/student/profile/me', dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setEditMode(false);
            localStorage.setItem('userName', `${profile.firstName} ${profile.lastName}`);
            alert("Profile Updated!");
            setRefresh(prev => !prev);
        } catch (err) {
            alert("Failed to save");
            console.log(err);
        } finally {
            setSaveLoading(false);
        }
    };

    const getImageUrl = (path) => path?.startsWith('http') ? path : `http://localhost:5000${path}`;

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

    if (loading) return <div className="profile-page loading">Loading...</div>;
    if (error) return <div className="profile-page error">{error}</div>;

    return (
        <>
            <Navbar />
            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-left">
                        <div className="profile-image-container" style={{position:'relative', width:'150px', height:'150px'}}>
                            <img src={getImageUrl(profile.profileImage)} alt="Profile" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} onError={(e) => { e.target.onerror = null; e.target.src='https://i.imgur.com/6VBx3io.png' }} />
                            {editMode && (
                                <>
                                    <label htmlFor="stu-img-upload" className="image-upload-overlay" style={{position:'absolute', bottom:0, right:0, background:'#007bff', borderRadius:'50%', padding:'8px', cursor:'pointer', color:'white'}}>
                                        {uploading ? <Loader className="animate-spin w-4 h-4"/> : <Camera className="w-4 h-4"/>}
                                    </label>
                                    <input id="stu-img-upload" type="file" onChange={handleImageChange} style={{display:'none'}} />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="profile-right">
                        <div className="basic-info">
                            {editMode ? (
                                <div className="edit-basic-info">
                                    <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" />
                                    <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" />
                                    <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Bio / Career Objective" rows={3} />
                                </div>
                            ) : (
                                <>
                                    <h1>{profile.firstName} {profile.lastName}</h1>
                                    <p className="bio">{profile.bio || "No bio added yet."}</p>
                                    <div className="student-badges" style={{marginTop:'10px'}}>
                                        <span className="skill">🎓 Student</span>
                                        {profile.rating > 0 && <span className="skill">⭐ {profile.rating.toFixed(1)} Rating</span>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="main-content">
                    <div className="profile-details-column">
                        <div className="section-card">
                            <h4>Personal Details</h4>
                            <div className="info-grid">
                                <div className="info-item"><label>Email</label><p>{profile.email}</p></div>
                                <div className="info-item">
                                    <label>Mobile</label>
                                    {editMode ? <input name="mobile" value={profile.mobile} onChange={handleChange} /> : <p>{profile.mobile || "Not set"}</p>}
                                </div>
                                <div className="info-item">
                                    <label>Location</label>
                                    {editMode ? <input name="location" value={profile.location} onChange={handleChange} /> : <p>{profile.location || "Not set"}</p>}
                                </div>
                                <div className="info-item">
                                    <label>GitHub</label>
                                    {editMode ? <input name="githubLink" value={profile.githubLink} onChange={handleChange} placeholder="https://github.com/..." /> : <p>{profile.githubLink ? <a href={profile.githubLink} target="_blank" rel="noreferrer">View GitHub</a> : "Not set"}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="section-card">
                            <h4>Skills</h4>
                            {editMode ? (
                                // --- NEW: Fixes the comma disappearing bug by keeping raw string intact ---
                                <textarea 
                                    value={Array.isArray(profile.skills) ? profile.skills.join(",") : ''} 
                                    onChange={(e) => setProfile({...profile, skills: e.target.value.split(",")})} 
                                    placeholder="Java, React, Python... (Separate by commas)" 
                                />
                            ) : (
                                <div className="skills-list">{profile.skills.map((s,i) => <span key={i} className="skill">{s}</span>)}</div>
                            )}
                        </div>
                    </div>

                    <div className="profile-sections">
                        <SectionCard 
                            title="Education" 
                            data={profile.education} 
                            fields={["degree", "school", "year"]} 
                            editMode={editMode} 
                            handleChange={handleArrayChange} 
                            addItem={addItem} removeItem={removeItem} 
                            section="education" 
                            template={{ degree: "", school: "", year: "" }} 
                        />
                        <SectionCard 
                            title="Academic Projects" 
                            data={profile.projects} 
                            fields={["name", "link", "tech", "description"]} 
                            editMode={editMode} 
                            handleChange={handleArrayChange} 
                            addItem={addItem} removeItem={removeItem} 
                            section="projects" 
                            template={{ name: "", link: "", tech: "", description: "" }} 
                        />
                        
                        <div className="section-card">
                            <h4>Customer Reviews</h4>
                            {Array.isArray(profile.reviews) && profile.reviews.length > 0 ? (
                                profile.reviews.map((r, i) => (
                                    <div className="review" key={i}>
                                        <p className="review-header">
                                            <strong>{r.name || 'Anonymous'}</strong> 
                                            <span className="review-rating">{renderStars(r.rating)}</span>
                                        </p>
                                        <p className="review-feedback">"{r.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    {editMode ? (
                        <>
                            <button className="action-btn secondary" onClick={() => { setEditMode(false); setRefresh(p => !p); }}>Cancel</button>
                            <button className="action-btn primary" onClick={handleSave} disabled={saveLoading}>{saveLoading ? "Saving..." : "Save Profile"}</button>
                        </>
                    ) : (
                        <button className="action-btn primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentProfile;