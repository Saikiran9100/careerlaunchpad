import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { sampleClientProjects } from './sampleClientProjects';
import './ClientProjectDetail.css';

const ClientProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      setProject(null); 

      const foundInSample = sampleClientProjects.find(p => p._id === id);

      if (foundInSample) {
        setProject(foundInSample);
        setLoading(false);
      } else {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated. Please log in.');
          setLoading(false);
          return;
        }
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get(`http://localhost:5000/api/projects/client/${id}`, config);
          if (data) {
            setProject(data);
          } else {
            setError('Project not found.');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load project details.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProject();
  }, [id]);

  // --- Fixes the 'title' of null bug ---
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="project-detail-container loading"><p>Loading project details...</p></div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <div className="project-detail-container error">
            <p className="error-message">{error || "Project not found."}</p>
            <button onClick={() => navigate(-1)} className="back-to-projects-btn">&larr; Go Back</button>
        </div>
      </>
    );
  }
  // --- End Bug Fix ---

  return (
    <div>
      <Navbar />
      <div className="project-detail-container">
        <button onClick={() => navigate(-1)} className="back-to-projects-btn">&larr; Back to Projects</button>
        
        <h1 className="project-detail-title">{project.title}</h1> 
        
        <div className="project-meta">
            <span className="meta-item">Budget: <span className="budget-value">${project.budget}</span></span>
            {project.deadline && (<span className="meta-item">Deadline: <span className="date-value">{new Date(project.deadline).toLocaleDateString()}</span></span>)}
            {project.createdAt && (<span className="meta-item">Posted On: <span className="date-value">{new Date(project.createdAt).toLocaleDateString()}</span></span>)}
        </div>
        
        <div className="project-detail-section">
          <h2>Description</h2>
          <p>{project.description}</p>
        </div>

        {project.skillsRequired && project.skillsRequired.length > 0 && (
            <div className="project-detail-section">
              <h2>Required Skills</h2>
              <div className="skills-tags-container">
                {project.skillsRequired.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
        )}
        
        {/* --- BUTTON REMOVED FROM HERE --- */}
        
      </div>
    </div>
  );
};

export default ClientProjectDetail;