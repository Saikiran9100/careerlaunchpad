import React from 'react';

// The styles for this component will be in DashboardPage.css
// to keep them co-located with the grid layout.

const SummaryCard = ({ title, value }) => {
  return (
    <div className="summary-card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
      <div className="card-footer">....</div>
    </div>
  );
};

export default SummaryCard;