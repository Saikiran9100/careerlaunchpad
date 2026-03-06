import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './StudentProfileCard.css';

// --- Accept 'application' and 'onAction' props ---
const StudentProfileCard = ({ profile, application, onAction }) => {
  const navigate = useNavigate();

  // --- State for managing accept/reject actions ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Use the application's current status for display
  const [currentStatus, setCurrentStatus] = useState(application.status);

  if (!profile) {
      return (
          <div className="student-profile-card disabled">
              <p>This applicant's profile is no longer available.</p>
          </div>
      );
  }

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Applicant';
  const mainSkill = profile.skills?.length > 0 ? profile.skills[0] : 'No skills listed';

  const handleViewFullProfile = () => {
    navigate(`/profile/${profile._id}`); 
  };

  // --- NEW: Handle Accept/Reject Clicks ---
  const handleApplicationUpdate = async (newStatus) => {
    if (!application || !application._id) {
        setError("Cannot update status: Application ID is missing.");
        return;
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const body = { status: newStatus }; // 'hired' or 'rejected'
        
        // Call the new backend endpoint
        const { data } = await axios.put(
            `http://localhost:5000/api/applications/${application._id}/status`, 
            body, 
            config
        );
        
        setCurrentStatus(data.status); // Update the status from the response
        setLoading(false);
        onAction(); // Trigger the refresh callback in the parent
        
    } catch (err) {
        setError(err.response?.data?.message || 'Action failed.');
        setLoading(false);
    }
  };


  return (
    // Add a class based on status for visual feedback
    <div className={`student-profile-card status-${currentStatus}`}>
      <div className="profile-card-header">
        <div className="profile-pic-placeholder">
          <span>{fullName.charAt(0)}</span>
        </div>
        <div className="profile-name-section">
          <h3 className="profile-name">{fullName}</h3>
          <p className="profile-college">{mainSkill}</p>
        </div>
      </div>
      
      <div className="profile-card-footer">
          <button 
            className="view-full-profile-btn" 
            onClick={handleViewFullProfile}
            disabled={loading} // Disable if an action is in progress
          >
            Show Full Details
          </button>
          
          {/* --- NEW BUTTONS (Conditional) --- */}
          {/* Show buttons only if status is still 'applied' */}
          {currentStatus === 'applied' && (
            <div className="action-buttons-row">
              <button 
                className="reject-btn" 
                onClick={() => handleApplicationUpdate('rejected')}
                disabled={loading}
              >
                Reject
              </button>
              <button 
                className="accept-btn" 
                onClick={() => handleApplicationUpdate('hired')}
                disabled={loading}
              >
                {loading ? '...' : 'Accept'}
              </button>
            </div>
          )}
          {/* --- END NEW BUTTONS --- */}
          
          {/* Show feedback messages */}
          {error && <p className="error-message-small">{error}</p>}
          
          {/* Show current status if not 'applied' */}
          {currentStatus === 'hired' && (
             <p className="success-message-small">Applicant Hired!</p>
          )}
          {currentStatus === 'rejected' && (
             <p className="status-display-message">Applicant Rejected</p>
          )}
      </div>
    </div>
  );
};

export default StudentProfileCard;