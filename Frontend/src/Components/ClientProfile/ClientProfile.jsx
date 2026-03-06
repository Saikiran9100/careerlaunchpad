// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Camera, Loader2 } from "lucide-react"; // Make sure to install lucide-react
// import "./ClientProfile.css"; 
// import Navbar from "../Navbar/Navbar"; 

// const ClientProfile = () => {
//     const [editMode, setEditMode] = useState(false);
//     const [profile, setProfile] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         mobile: '',
//         companyName: '',
//         website: '',
//         location: '',
//         bio: '',
//         profileImage: ''
//     });
    
//     const [loading, setLoading] = useState(true);
//     const [saveLoading, setSaveLoading] = useState(false);
//     const [uploading, setUploading] = useState(false); // State for image upload
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     // --- FETCH PROFILE ---
//     useEffect(() => {
//         const fetchProfile = async () => {
//             setLoading(true);
//             const token = localStorage.getItem('token');
//             if (!token) { navigate('/login'); return; }
            
//             const role = localStorage.getItem('userRole');
//             if(role !== 'client') {
//                  setError("Access Denied.");
//                  setLoading(false);
//                  return;
//             }

//             const config = { headers: { Authorization: `Bearer ${token}` } };
            
//             try {
//                 const { data } = await axios.get('http://localhost:5000/api/client/profile/me', config);
//                 setProfile({
//                     firstName: data.firstName || '',
//                     lastName: data.lastName || '',
//                     email: data.email || '',
//                     mobile: data.mobile || '',
//                     companyName: data.companyName || '',
//                     website: data.website || '',
//                     location: data.location || '',
//                     bio: data.bio || '',
//                     profileImage: data.profileImage || '/uploads/default-profile.png'
//                 });
//             } catch (err) {
//                 setError(err.response?.data?.message || "Failed to load profile.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProfile();
//     }, [navigate]);

//     // --- HANDLE TEXT CHANGE ---
//     const handleChange = (e) => {
//         setProfile({ ...profile, [e.target.name]: e.target.value });
//     };

//     // --- HANDLE FILE UPLOAD (New Feature) ---
//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append('image', file);
        
//         setUploading(true);

//         try {
//             const config = {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     // Note: Upload usually doesn't need auth token if open, 
//                     // but if your backend requires it, add Authorization header here.
//                 },
//             };

//             // Post to your existing upload route
//             const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);

//             // Update profile state with the new path returned by backend
//             setProfile(prev => ({ ...prev, profileImage: data }));
//             setUploading(false);
            
//             // Optional: Auto-save profile after upload so the link is stored in DB immediately
//             // Or just let user click "Save Changes"
            
//         } catch (error) {
//             console.error(error);
//             setUploading(false);
//             alert('Image upload failed');
//         }
//     };

//     // --- SAVE PROFILE ---
//     const handleSaveProfile = async () => {
//         setSaveLoading(true);
//         const token = localStorage.getItem('token');
//         const config = { 
//             headers: { 
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}` 
//             } 
//         };
        
//         try {
//             await axios.put('http://localhost:5000/api/client/profile/me', profile, config);
//             setEditMode(false);
//             localStorage.setItem('userName', `${profile.firstName} ${profile.lastName}`);
//             alert("Profile updated successfully!");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to save profile.");
//         } finally {
//             setSaveLoading(false);
//         }
//     };

//     if (loading) return <div className="profile-page loading">Loading...</div>;
//     if (error) return <div className="profile-page error">{error}</div>;

//     return (
//         <>
//             <Navbar />
//             <div className="profile-page">
//                 {/* --- HEADER SECTION --- */}
//                 <div className="profile-header">
                    
//                     {/* Image Container with Edit Overlay */}
//                     <div className="profile-image-container">
//                         <div className="profile-image">
//                             <img 
//                                 src={profile.profileImage} 
//                                 alt="Profile" 
//                                 onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150' }}
//                             />
//                         </div>
                        
//                         {/* Only show Camera icon in Edit Mode */}
//                         {editMode && (
//                             <>
//                                 <label htmlFor="image-upload-input" className="image-upload-overlay">
//                                     {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : <Camera className="w-5 h-5" />}
//                                 </label>
//                                 <input 
//                                     id="image-upload-input" 
//                                     type="file" 
//                                     accept="image/*"
//                                     onChange={handleFileChange}
//                                 />
//                             </>
//                         )}
//                     </div>

//                     <div className="basic-info">
//                         {editMode ? (
//                             <div className="edit-basic-info">
//                                 <div className="name-inputs">
//                                     <input
//                                         name="firstName"
//                                         value={profile.firstName}
//                                         onChange={handleChange}
//                                         placeholder="First Name"
//                                     />
//                                     <input
//                                         name="lastName"
//                                         value={profile.lastName}
//                                         onChange={handleChange}
//                                         placeholder="Last Name"
//                                     />
//                                 </div>
//                                 <input
//                                     name="companyName"
//                                     value={profile.companyName}
//                                     onChange={handleChange}
//                                     placeholder="Company Name"
//                                 />
//                                 <textarea
//                                     name="bio"
//                                     rows="3"
//                                     value={profile.bio}
//                                     onChange={handleChange}
//                                     placeholder="Tell us about your company..."
//                                 />
//                             </div>
//                         ) : (
//                             <>
//                                 <h1>{profile.firstName} {profile.lastName}</h1>
//                                 <h3>{profile.companyName || "Add Company Name"}</h3>
//                                 <p className="bio">{profile.bio || "No bio added yet."}</p>
//                             </>
//                         )}
//                     </div>

//                     {/* Action Buttons Centered Below Header */}
//                     <div className="profile-actions">
//                         {editMode ? (
//                             <>
//                                 <button 
//                                     className="action-btn secondary"
//                                     onClick={() => {
//                                         setEditMode(false);
//                                         window.location.reload(); 
//                                     }}
//                                     disabled={saveLoading}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button 
//                                     className="action-btn primary"
//                                     onClick={handleSaveProfile}
//                                     disabled={saveLoading}
//                                 >
//                                     {saveLoading ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </>
//                         ) : (
//                             <button 
//                                 className="action-btn primary"
//                                 onClick={() => setEditMode(true)}
//                             >
//                                 Edit Profile
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* --- DETAILS SECTION --- */}
//                 <div className="main-content">
//                     <div className="section-card">
//                         <h4>Contact & Company Details</h4>
                        
//                         <div className="info-grid">
//                             <div className="info-item">
//                                 <label>Email Address</label>
//                                 <p>{profile.email}</p>
//                             </div>

//                             <div className="info-item">
//                                 <label>Mobile Number</label>
//                                 {editMode ? (
//                                     <input
//                                         name="mobile"
//                                         value={profile.mobile}
//                                         onChange={handleChange}
//                                         placeholder="Mobile Number"
//                                     />
//                                 ) : (
//                                     <p>{profile.mobile || "Not set"}</p>
//                                 )}
//                             </div>

//                             <div className="info-item">
//                                 <label>Location</label>
//                                 {editMode ? (
//                                     <input
//                                         name="location"
//                                         value={profile.location}
//                                         onChange={handleChange}
//                                         placeholder="e.g. Hyderabad, India"
//                                     />
//                                 ) : (
//                                     <p>{profile.location || "Not set"}</p>
//                                 )}
//                             </div>

//                             <div className="info-item">
//                                 <label>Website</label>
//                                 {editMode ? (
//                                     <input
//                                         name="website"
//                                         value={profile.website}
//                                         onChange={handleChange}
//                                         placeholder="https://..."
//                                     />
//                                 ) : (
//                                     <p>
//                                         {profile.website ? (
//                                             <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{color:'#007bff'}}>
//                                                 {profile.website}
//                                             </a>
//                                         ) : "Not set"}
//                                     </p>
//                                 )}
//                             </div>
                            
//                             {/* REMOVED: Image URL Input Field */}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ClientProfile;





import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Loader } from "lucide-react"; // FIX: Switched to 'Loader' to prevent crash
import "./ClientProfile.css"; 
import Navbar from "../Navbar/Navbar"; 

const ClientProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        companyName: '',
        website: '',
        location: '',
        bio: '',
        profileImage: ''
    });
    
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [uploading, setUploading] = useState(false); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- FETCH PROFILE ---
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            
            const role = localStorage.getItem('userRole');
            if(role !== 'client') {
                 setError("Access Denied.");
                 setLoading(false);
                 return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                const { data } = await axios.get('http://localhost:5000/api/client/profile/me', config);
                setProfile({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    mobile: data.mobile || '',
                    companyName: data.companyName || '',
                    website: data.website || '',
                    location: data.location || '',
                    bio: data.bio || '',
                    // Use the image from DB or a default one
                    profileImage: data.profileImage || 'https://i.imgur.com/6VBx3io.png'
                });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // --- HANDLE TEXT CHANGE ---
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // --- HANDLE FILE UPLOAD ---
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        // FIX: 'image' matches the backend upload.single('image')
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

            // Update state with the new path (e.g., "/uploads/image-123.jpg")
            setProfile(prev => ({ ...prev, profileImage: data }));
            setUploading(false);
            
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed');
        }
    };

    // --- SAVE PROFILE ---
    const handleSaveProfile = async () => {
        setSaveLoading(true);
        const token = localStorage.getItem('token');
        const config = { 
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            } 
        };
        
        try {
            await axios.put('http://localhost:5000/api/client/profile/me', profile, config);
            setEditMode(false);
            // Update local storage so Navbar name updates immediately
            localStorage.setItem('userName', `${profile.firstName} ${profile.lastName}`);
            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save profile.");
        } finally {
            setSaveLoading(false);
        }
    };

    // --- HELPER: GET IMAGE URL ---
    // If the image is a local upload, prepend the server URL. If it's an external link (imgur), keep it.
    const getImageUrl = (path) => {
        if (!path) return 'https://i.imgur.com/6VBx3io.png';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    if (loading) return <div className="profile-page loading">Loading...</div>;
    if (error) return <div className="profile-page error">{error}</div>;

    return (
        <>
            <Navbar />
            <div className="profile-page">
                {/* --- HEADER SECTION --- */}
                <div className="profile-header">
                    
                    {/* Image Container */}
                    <div className="profile-image-container">
                        <div className="profile-image">
                            <img 
                                src={getImageUrl(profile.profileImage)} 
                                alt="Profile" 
                                onError={(e) => { e.target.onerror = null; e.target.src='https://i.imgur.com/6VBx3io.png' }}
                            />
                        </div>
                        
                        {/* Only show Camera icon in Edit Mode */}
                        {editMode && (
                            <>
                                <label htmlFor="image-upload-input" className="image-upload-overlay">
                                    {uploading ? <Loader className="animate-spin w-5 h-5" /> : <Camera className="w-5 h-5" />}
                                </label>
                                <input 
                                    id="image-upload-input" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="basic-info">
                        {editMode ? (
                            <div className="edit-basic-info">
                                <div className="name-inputs">
                                    <input
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                    />
                                    <input
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                                <input
                                    name="companyName"
                                    value={profile.companyName}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                />
                                <textarea
                                    name="bio"
                                    rows="3"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about your company..."
                                />
                            </div>
                        ) : (
                            <>
                                <h1>{profile.firstName} {profile.lastName}</h1>
                                <h3>{profile.companyName || "Add Company Name"}</h3>
                                <p className="bio">{profile.bio || "No bio added yet."}</p>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="profile-actions">
                        {editMode ? (
                            <>
                                <button 
                                    className="action-btn secondary"
                                    onClick={() => {
                                        setEditMode(false);
                                        window.location.reload(); 
                                    }}
                                    disabled={saveLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="action-btn primary"
                                    onClick={handleSaveProfile}
                                    disabled={saveLoading}
                                >
                                    {saveLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <button 
                                className="action-btn primary"
                                onClick={() => setEditMode(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* --- DETAILS SECTION --- */}
                <div className="main-content">
                    <div className="section-card">
                        <h4>Contact & Company Details</h4>
                        
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Email Address</label>
                                <p>{profile.email}</p>
                            </div>

                            <div className="info-item">
                                <label>Mobile Number</label>
                                {editMode ? (
                                    <input
                                        name="mobile"
                                        value={profile.mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile Number"
                                    />
                                ) : (
                                    <p>{profile.mobile || "Not set"}</p>
                                )}
                            </div>

                            <div className="info-item">
                                <label>Location</label>
                                {editMode ? (
                                    <input
                                        name="location"
                                        value={profile.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Hyderabad, India"
                                    />
                                ) : (
                                    <p>{profile.location || "Not set"}</p>
                                )}
                            </div>

                            <div className="info-item">
                                <label>Website</label>
                                {editMode ? (
                                    <input
                                        name="website"
                                        value={profile.website}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                ) : (
                                    <p>
                                        {profile.website ? (
                                            <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{color:'#007bff'}}>
                                                {profile.website}
                                            </a>
                                        ) : "Not set"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientProfile;