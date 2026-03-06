// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './JobCard.css';

// // const JobCard = ({ job }) => {
// //     const navigate = useNavigate();

// //     const handleViewDetails = () => {
// //         navigate(`/jobs/${job.id || job._id}`);
// //     };

// //     // Safely access skills (default to empty array if missing)
// //     const skillsToShow = (job.skills || []).slice(0, 3);

// //     return (
// //         <div className="job-card" onClick={handleViewDetails}>
// //             <div className="job-card-header">
// //                 <img 
// //                     src={job.logoUrl || "https://via.placeholder.com/50"} 
// //                     alt={job.company} 
// //                     className="company-logo"
// //                     onError={(e) => e.target.src = "https://via.placeholder.com/50?text=Job"} // Fallback image
// //                 />
// //                 <div>
// //                     {/* SHOW JOB TITLE */}
// //                     <h3 className="job-role-title">{job.title || "Software Engineer"}</h3>
// //                     <p className="company-name">{job.company}</p>
// //                 </div>
// //             </div>

// //             <div className="job-card-body">
// //                 <p className="job-desc-short">
// //                     {job.description ? job.description.substring(0, 80) + "..." : "No description available."}
// //                 </p>
                
// //                 {/* SHOW SKILLS TAGS */}
// //                 {skillsToShow.length > 0 && (
// //                     <div className="job-card-skills">
// //                         {skillsToShow.map((skill, index) => (
// //                             <span key={index} className="job-skill-tag">
// //                                 {skill}
// //                             </span>
// //                         ))}
// //                         {(job.skills && job.skills.length > 3) && (
// //                             <span className="job-skill-tag">+{job.skills.length - 3}</span>
// //                         )}
// //                     </div>
// //                 )}

// //                 <div className="job-card-meta">
// //                     <span className="rating-badge">⭐ {job.rating}</span>
// //                     <span className="location-text">📍 {job.location || "Remote"}</span>
// //                 </div>
// //             </div>

// //             <button className="view-job-btn">View Details</button>
// //         </div>
// //     );
// // };

// // export default JobCard;




// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './JobCard.css';

// const JobCard = ({ job }) => {
//     const navigate = useNavigate();

//     const handleViewDetails = () => {
//         // If it's an external job (from Adzuna/JSearch), open the link directly
//         if (job.source && (job.source === 'Adzuna' || job.source === 'JSearch')) {
//             window.open(job.applyLink, '_blank');
//         } else {
//             // Otherwise, it's an internal job, go to the details page
//             navigate(`/jobs/${job.id || job._id}`);
//         }
//     };

//     // Safely access skills (default to empty array if missing)
//     const skillsToShow = (job.skills || []).slice(0, 3);

//     return (
//         <div className="job-card" onClick={handleViewDetails} style={{ cursor: 'pointer' }}>
//             <div className="job-card-header">
//                 {/* <img 
//                     src={job.logoUrl || "https://via.placeholder.com/50"} 
//                     alt={job.company} 
//                     className="company-logo"
//                     onError={(e) => e.target.src = "https://via.placeholder.com/50?text=Job"} 
//                 /> */}
//                 <img 
//                     src={job.logoUrl || "https://placehold.co/50x50/eeeeee/31343C?text=Job"} 
//                     alt={job.company} 
//                     className="company-logo"
//                     onError={(e) => {
//                         e.target.onerror = null; // <-- THIS STOPS THE INFINITE LOOP
//                         e.target.src = "https://placehold.co/50x50/eeeeee/31343C?text=Job"; 
//                     }} 
//                 />
//                 <div>
//                     <h3 className="job-role-title">{job.title || "Software Engineer"}</h3>
//                     <p className="company-name">{job.company}</p>
//                 </div>
//             </div>

//             <div className="job-card-body">
//                 <p className="job-desc-short">
//                     {job.description ? job.description.substring(0, 80) + "..." : "No description available."}
//                 </p>
                
//                 {skillsToShow.length > 0 && (
//                     <div className="job-card-skills">
//                         {skillsToShow.map((skill, index) => (
//                             <span key={index} className="job-skill-tag">
//                                 {skill}
//                             </span>
//                         ))}
//                         {(job.skills && job.skills.length > 3) && (
//                             <span className="job-skill-tag">+{job.skills.length - 3}</span>
//                         )}
//                     </div>
//                 )}

//                 <div className="job-card-meta">
//                     {/* Hide rating if it's an external job without one */}
//                     {job.rating && <span className="rating-badge">⭐ {job.rating}</span>}
//                     <span className="location-text">📍 {job.location || "Remote"}</span>
//                 </div>

//                 {/* --- NEW: AI Aggregator Specific UI --- */}
//                 {job.matchScore && (
//                     <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <span style={{ fontSize: '0.8rem', color: '#888' }}>Source: {job.source}</span>
//                             <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#00b894' }}>
//                                 🔥 {job.matchScore}% Match
//                             </span>
//                         </div>
//                         {job.aiReason && (
//                             <p style={{ fontSize: '0.8rem', color: '#6c5ce7', marginTop: '5px', fontStyle: 'italic' }}>
//                                 ✨ {job.aiReason}
//                             </p>
//                         )}
//                     </div>
//                 )}
//             </div>

//             <button className="view-job-btn">
//                 {job.source ? "Apply Now" : "View Details"}
//             </button>
//         </div>
//     );
// };

// export default JobCard;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    // 1. Handle clicking the "Apply Now" button specifically
    const handleApplyClick = (e) => {
        e.stopPropagation(); // Stops the card itself from being clicked
        if (job.applyLink) {
            window.open(job.applyLink, '_blank'); // Opens the company website in a new tab
        } else if (job.id || job._id) {
            navigate(`/jobs/${job.id || job._id}`); // Fallback to details page
        }
    };

    // 2. Handle clicking anywhere else on the card
    const handleCardClick = () => {
        if (job.id || job._id) {
            navigate(`/jobs/${job.id || job._id}`);
        } else if (job.applyLink) {
            window.open(job.applyLink, '_blank');
        }
    };

    // Safely limit the skills to show a maximum of 4 so it stays neat
    const skillsToShow = (job.skills || []).slice(0, 4);

    return (
        <div className="job-card" onClick={handleCardClick} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            
            {/* --- ROLE, COMPANY & LOCATION --- */}
            <div className="job-card-header" style={{ display: 'block' }}>
                <h3 className="job-role-title" style={{ fontSize: '1.2rem', marginBottom: '5px' }}>
                    {job.title || "Software Role"}
                </h3>
                <p className="company-name" style={{ fontWeight: 'bold', color: '#444' }}>
                    🏢 {job.company || "Company Unlisted"}
                </p>
                <p className="location-text" style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>
                    📍 {job.location || "Remote"}
                </p>
            </div>

            <div className="job-card-body" style={{ flexGrow: 1 }}>
                
                {/* --- REQUIRED SKILLS --- */}
                {skillsToShow.length > 0 && (
                    <div className="job-card-skills" style={{ marginTop: '10px' }}>
                        {skillsToShow.map((skill, index) => (
                            <span key={index} className="job-skill-tag">
                                {skill}
                            </span>
                        ))}
                        {(job.skills && job.skills.length > 4) && (
                            <span className="job-skill-tag">+{job.skills.length - 4}</span>
                        )}
                    </div>
                )}

                {/* --- AI MATCH DETAILS (Necessary for this feature) --- */}
                {job.matchScore && (
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00b894' }}>
                            🔥 {job.matchScore}% AI Match
                        </span>
                        {job.aiReason && (
                            <p style={{ fontSize: '0.8rem', color: '#6c5ce7', marginTop: '5px', fontStyle: 'italic', lineHeight: '1.4' }}>
                                ✨ {job.aiReason}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* --- APPLY LINK BUTTON --- */}
            <button 
                className="view-job-btn" 
                onClick={handleApplyClick} 
                style={{ width: '100%', marginTop: '15px' }}
            >
                Apply Now
            </button>
            
        </div>
    );
};

export default JobCard;