import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- 1. Make sure axios is imported
import Navbar from '../Navbar/Navbar'; // Adjust path if needed
import { sampleData } from './sampleData'; // Import sample data
import './ExperienceDetail.css'; // Ensure CSS exists

const ExperienceDetail = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      setError("");
      
      // --- 2. LOGIC TO CHECK FOR SAMPLE DATA ---
      // Try to find in sampleData first
      const numericId = parseInt(id);
      let foundInSample = null;
      if (!isNaN(numericId)) {
           foundInSample = sampleData.find((exp) => exp.id === numericId);
      } else {
          // Check for sample string IDs (if any, like 'sample-1')
          foundInSample = sampleData.find((exp) => `sample-${exp.id}` === id);
      }
      
      if (foundInSample) {
        // --- Found in sampleData ---
        // We use the sample data directly
        setExperience(foundInSample);
        setLoading(false);
      } else {
        // --- Not in sampleData, MUST be real data ---
        // We must fetch from the backend API with a token
        
        // 3. Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
           setError("You must be logged in to view this experience.");
           setLoading(false);
           return; // Stop if not logged in
        }

        // 4. Create the auth header
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
          // 5. Send the request with the config object
          const { data } = await axios.get(`http://localhost:5000/api/interviews/${id}`, config);
          setExperience(data);
        } catch (err) {
          console.error("Error fetching experience detail:", err);
          setError(err.response?.data?.message || "Failed to load experience.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExperience();
  }, [id]); // Re-fetch if the ID in the URL changes

  // --- Render Logic ---

  if (loading) {
    return (
        <>
            <Navbar />
            <div className="detail-container"><p>Loading experience...</p></div>
        </>
    );
  }

  if (error || !experience) {
    return (
      <>
        <Navbar />
        <div className="detail-container">
          <h2>{error || "Experience Not Found"}</h2>
          <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>
        </div>
      </>
    );
  }
  
  // --- 6. ADAPTED RENDER LOGIC ---
  // Use "or" logic to display fields from either sample or DB
  const title = experience.title || `${experience.companyName} - ${experience.roleAppliedFor}`;
  const college = experience.collegeName || experience.college || 'A College';
  const lpa = experience.packageLPA || experience.lpa || '--';
  const details = experience.experienceDetails || experience.description || 'No details provided.';
  const questions = experience.interviewQuestions || [];
  const tips = experience.tipsOrRemarks || '';
  const difficulty = experience.difficulty || 'N/A';
  
  return (
    <div>
      <Navbar />
      <div className="detail-container experience-detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>

        <div className="detail-header">
          <h1>{title}</h1>
          <p className="college-info">
            Shared by a student from <strong>{college}</strong>
          </p>
          <div className="meta-info">
            <span><strong>Package:</strong> {lpa.toString().includes('LPA') ? lpa : `${lpa} LPA`}</span>
            <span><strong>Difficulty:</strong> <span className={`difficulty-${difficulty.toLowerCase()}`}>{difficulty}</span></span>
            {experience.interviewDate && <span><strong>Date:</strong> {new Date(experience.interviewDate).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="detail-section">
          <h2>Interview Experience</h2>
          {/* Use <pre> to respect newlines from the database */}
          <pre className="experience-text">{details}</pre>
        </div>

        {questions.length > 0 && (
            <div className="detail-section">
              <h2>Interview Questions Asked</h2>
              <ul className="questions-list">
                {questions.map((q, index) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </div>
        )}

        {tips && (
            <div className="detail-section">
              <h2>Tips & Remarks</h2>
              <p className="experience-text">{tips}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceDetail;