import React from "react";
import { useNavigate } from "react-router-dom";
import ExperienceCard from "./ExperienceCard";
import { sampleData } from "./sampleData.jsx";
import "./InterviewList.css"; // Note the CSS file rename

const InterviewList = () => {
  const navigate = useNavigate();
  const gridData = sampleData.slice(0, 4);

  return (
    // Renamed wrapper class
    <div className="interview-section-wrapper">
      <div className="interview-header">
        <h1 className="interview-title">Top Interview Experiences</h1>
        <div className="header-buttons">
          <button
            className="share-exp-btn"
            onClick={() => navigate("/interview/new")}
          >
            Share Your Experience +
          </button>
          <button
            className="see-more-link"
            onClick={() => navigate("/all-experiences")}
          >
            See more
          </button>
        </div>
      </div>

      <div className="interview-grid">
        {gridData.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
};

export default InterviewList;