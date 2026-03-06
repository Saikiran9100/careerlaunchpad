import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExperienceCard.css'; // Ensure this CSS file exists

const ExperienceCard = ({ experience }) => {
  const navigate = useNavigate();

  if (!experience || (!experience._id && !experience.id)) {
    return null;
  }

  // --- 1. SIMPLIFIED LOGIC ---
  // Now we only need to look for the database property names
  
  const experienceId = experience._id || experience.id; // Use DB id or sample id
  
  const title = `${experience.companyName || ''} - ${experience.roleAppliedFor || ''}`;
  const college = experience.collegeName || 'A College';
  const lpa = experience.packageLPA;
  const lpaDisplay = lpa ? `₹${lpa} LPA `: '₹ -- LPA';
  const details = experience.experienceDetails || '';
  
  // --- END OF SIMPLIFIED LOGIC ---

  const handleViewDetails = () => {
    navigate(`/interview/${experienceId}`);
  };

  return (
    <div className="experience-card" onClick={handleViewDetails}>
      <div className="card-header">
        <h3 className="experience-title">{title}</h3>
        <span className="experience-lpa">{lpaDisplay}</span>
      </div>
      <p className="experience-college">from {college}</p>
      
      <p className="experience-snippet">
         {details.substring(0, 70)}...
      </p>

      <button className="read-full-btn">Read Full Experience</button>
    </div>
  );
};

export default ExperienceCard;