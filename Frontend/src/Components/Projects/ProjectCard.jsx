import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css'; // <-- 1. This now correctly imports its OWN CSS

const ProjectCard = ({ project }) => { // <-- 2. Component name is ProjectCard
  const navigate = useNavigate();

  // Basic check for project data
  if (!project || (!project._id && !project.id)) {
    console.warn("ProjectCard received invalid project data:", project);
    return null; // Don't render if essential data is missing
  }

  // --- Use "OR" logic to handle both sample and DB data ---
  const projectId = project._id || project.id;
  const title = project.title || 'Untitled Project';
  const clientName = project.postedBy
    ? (project.postedBy.companyName || `${project.postedBy.firstName} ${project.postedBy.lastName}`.trim())
    : (project.clientName || 'Client');
  const budget = project.budget || project.packageLPA;
  const budgetDisplay = budget ? `$${budget}` : '';
  const description = project.description || project.details || project.experience || '';
  const skills = Array.isArray(project.skillsRequired) ? project.skillsRequired : (Array.isArray(project.skills) ? project.skills : []);

  const handleViewDetails = () => {
    // Navigate to the general project detail page
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className='project-title-section'>
            <h3 className="project-title">{title}</h3>
            <p className="project-client-name">by {clientName}</p>
        </div>
        {budgetDisplay && <span className="project-budget">{budgetDisplay}</span>}
      </div>
      <p className="project-description">
          {description.substring(0, 100)}{description.length > 100 ? '...' : ''}
      </p>
      {skills.length > 0 && (
         <div className="project-skills">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">{skill || ''}</span>
            ))}
             {skills.length > 3 && (
                 <span className="skill-tag">+{skills.length - 3} more</span>
             )}
         </div>
      )}
      <button className="view-details-button" onClick={handleViewDetails}>View Details</button>
    </div>
  );
};

export default ProjectCard;