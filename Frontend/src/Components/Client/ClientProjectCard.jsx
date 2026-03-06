// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ClientProjectCard.css'; // <-- 1. This correctly imports its OWN CSS

// const ClientProjectCard = ({ project }) => { // <-- 2. Component name is ClientProjectCard
//   const navigate = useNavigate();

//   if (!project || !project._id) {
//     console.warn("ClientProjectCard received invalid project data:", project);
//     return null;
//   }

//   const handleViewDetails = (e) => {
//     e.stopPropagation();
//     navigate(`/client/projects/${project._id}`);
//   };

//   const handleViewApplicants = (e) => {
//     e.stopPropagation();
//     navigate(`/client/projects/${project._id}/applicants`);
//   };

//   const title = project.title || 'Untitled Project';
//   const budget = (project.budget !== undefined && project.budget !== null) ? `$${project.budget} `: '';
//   const skills = (Array.isArray(project.skillsRequired) ? project.skillsRequired : []).slice(0, 2);

//   return (
//     <div className="client-project-card simple" onClick={handleViewDetails}>
//       <div className="card-header simple-header">
//         <h3 className="card-title simple-title">{title}</h3>
//         {budget && <span className="card-budget simple-budget">{budget}</span>}
//       </div>
      
//       {skills.length > 0 && (
//          <div className="card-skills simple-skills">
//             {skills.map((skill, index) => (
//               <span key={index} className="skill-tag simple-skill-tag">{skill || ''}</span>
//             ))}
//             {Array.isArray(project.skillsRequired) && project.skillsRequired.length > 2 && (
//                  <span className="skill-tag simple-skill-tag">...</span>
//             )}
//          </div>
//       )}
      
//       <div className="card-buttons">
//           <button className="view-details-btn simple-btn" onClick={handleViewDetails}>
//             View Details
//           </button>
//           <button className="view-applicants-btn-card simple-btn" onClick={handleViewApplicants}>
//             Show Applicants
//           </button>
//       </div>
//     </div>
//   );
// };

// export default ClientProjectCard;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientProjectCard.css'; 

const ClientProjectCard = ({ project }) => { 
  const navigate = useNavigate();

  if (!project || !project._id) {
    return null;
  }

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/client/projects/${project._id}`);
  };

  const handleViewApplicants = (e) => {
    e.stopPropagation();
    navigate(`/client/projects/${project._id}/applicants`);
  };

  const title = project.title || 'Untitled Project';
  const budget = (project.budget !== undefined && project.budget !== null) ? `$${project.budget} `: '';
  const skills = (Array.isArray(project.skillsRequired) ? project.skillsRequired : []).slice(0, 2);
  
  // --- Check Status ---
  const isCompleted = project.status === 'completed';

  return (
    <div className="client-project-card simple" onClick={handleViewDetails}>
      <div className="card-header simple-header">
        <h3 className="card-title simple-title">{title}</h3>
        {budget && <span className="card-budget simple-budget">{budget}</span>}
      </div>
      
      {skills.length > 0 && (
         <div className="card-skills simple-skills">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag simple-skill-tag">{skill || ''}</span>
            ))}
            {Array.isArray(project.skillsRequired) && project.skillsRequired.length > 2 && (
                 <span className="skill-tag simple-skill-tag">...</span>
            )}
         </div>
      )}
      
      <div className="card-buttons">
          <button className="view-details-btn simple-btn" onClick={handleViewDetails}>
            View Details
          </button>
          <button className="view-applicants-btn-card simple-btn" onClick={handleViewApplicants}>
            Show Applicants
          </button>
      </div>

      {/* --- NEW: Completed Status Indicator --- */}
      {isCompleted && (
          <div style={{marginTop: '10px', textAlign: 'center'}}>
              <button 
                  disabled 
                  style={{
                      width: '100%',
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px', 
                      borderRadius: '4px',
                      cursor: 'default',
                      fontWeight: 'bold'
                  }}
              >
                  Completed ✅
              </button>
          </div>
      )}
    </div>
  );
};

export default ClientProjectCard;