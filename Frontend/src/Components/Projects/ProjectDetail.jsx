import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Adjust path if needed
import { sampleProjectData } from './sampleProjectData'; // Import sample data
import './ProjectDetail.css'; // Ensure CSS exists

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isSample, setIsSample] = useState(false);
  
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");
  const [hasApplied, setHasApplied] = useState(false); // <-- 1. Add hasApplied state

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    setUserRole(token ? role : null);

    const fetchProjectDetail = async () => {
      setLoading(true);
      setError("");
      setProject(null);
      setIsSample(false);
      setHasApplied(false); // Reset
      setApplySuccess(""); 
      setApplyError("");

      const numericId = parseInt(id);
      let foundInSample = null;

      if (!isNaN(numericId)) {
           foundInSample = sampleProjectData.find((exp) => exp.id === numericId);
      } else {
          foundInSample = sampleProjectData.find((exp) => `sample-${exp.id} `=== id);
      }

      if (foundInSample) {
        setIsSample(true);
        setProject({
            _id: `sample-${foundInSample.id}`,
            id: foundInSample.id, 
            title: foundInSample.title,
            description: foundInSample.details || foundInSample.experience,
            skillsRequired: foundInSample.skills || [],
            budget: foundInSample.budget || foundInSample.package,
            deadline: foundInSample.deadline || foundInSample.date,
            postedBy: { companyName: foundInSample.clientName || foundInSample.company },
        });
        setLoading(false);
      } else {
        setIsSample(false);
        if (!token) {
           setError("You must be logged in to view this project.");
           setLoading(false);
           return;
        }
        
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
          
          // --- 2. THIS IS THE FIX ---
          // The backend sends { project: {...}, hasApplied: ... }
          if (data && data.project) {
              setProject(data.project);      // <-- Set only the project object
              setHasApplied(data.hasApplied); // <-- Set the application status
          } else {
              setError("Project data is invalid.");
          }
          // --- END OF FIX ---

        } catch (err) {
          setError(err.response?.data?.message || "Failed to load project.");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProjectDetail();
    
  }, [id]); // Re-run if ID changes

  const handleApply = async () => {
    if (isSample) return; 
    
    setIsApplying(true);
    setApplyError("");
    setApplySuccess("");
    const token = localStorage.getItem('token');

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(`http://localhost:5000/api/projects/${id}/apply`, {}, config); 
        
        setApplySuccess("Application submitted successfully!");
        setHasApplied(true); // <-- Manually set hasApplied to true
        
    } catch (err) {
        if (err.response && err.response.data.message.includes("already applied")) {
             setApplySuccess("You have already applied for this project.");
             setHasApplied(true); // <-- Also set true if server confirms
        } else {
             setApplyError(err.response?.data?.message || "Failed to submit application.");
        }
    } finally {
        setIsApplying(false);
    }
  };


  if (loading) {
    return (
        <>
            <Navbar />
            <div className="detail-container"><p>Loading project details...</p></div>
        </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <div className="detail-container">
          <h2>{error || "Project Not Found"}</h2>
          <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>
        </div>
      </>
    );
  }

  // --- Render content (now safe) ---
  return (
    <div>
        <Navbar />
        <div className="detail-container project-detail-container">
          <button onClick={() => navigate(-1)} className="back-btn">&larr; Go Back</button>
          
          <div className="detail-header project-detail-header">
            <h1>{project.title}</h1>
            <p className="client-info">
              Posted by <strong>{project.postedBy?.companyName || 'Client'}</strong>
            </p>
            <div className="meta-info project-meta-info">
              {project.budget && <span><strong>Budget:</strong> ${project.budget}</span>}
              {project.deadline && <span><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</span>}
            </div>
          </div>

          <div className="project-detail-section">
            <h2>Full Project Details</h2>
            <p>{project.description}</p>
          </div>

          {project.skillsRequired && project.skillsRequired.length > 0 && (
            <div className="project-detail-section">
              <h2>Required Skills</h2>
              <div className="project-detail-skills">
                {project.skillsRequired.map((skill, index) => (
                  <span key={index} className="skill-tag-detail">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* --- 3. UPDATED Apply Button Logic --- */}
          {userRole === 'freelancer' && (
             <div className="detail-actions">
                 
                 {/* Only show button if NOT sample and user has NOT applied */}
                 {!isSample && !hasApplied && (
                     <button 
                       className="apply-btn" 
                       onClick={handleApply} 
                       disabled={isApplying} 
                     >
                       {isApplying ? 'Submitting...' : 'Apply Now'}
                     </button>
                 )}

                 {/* Show a clear message if they HAVE applied */}
                 {hasApplied && (
                    <p className="success-message">You have already applied for this project.</p>
                 )}

                 {/* Show a message if it's a sample project */}
                 {isSample && (
                    <button className="apply-btn" disabled={true}>
                        Sample Project (Cannot Apply)
                    </button>
                 )}

                 {applyError && <p className="error-message">{applyError}</p>}
                 {/* Only show success message if it's NOT the "already applied" one */}
                 {applySuccess && !applySuccess.includes("already") && <p className="success-message">{applySuccess}</p>}
             </div>
          )}
        </div>
    </div>
  );
};

export default ProjectDetail;