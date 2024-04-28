import React from "react";

import "../assets/styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-bg">
      <div className="featured-card-bg">
        <div className="featured-card-div">
          <h4 className="featured-card-title">IAM Users</h4>
          <p className="featured-card-number">500+</p>
        </div>
        <div className="featured-card-div">
          <h4 className="featured-card-title">Hosted Zones</h4>
          <p className="featured-card-number">15+</p>
        </div>
        <div className="featured-card-div">
          <h4 className="featured-card-title">DNS Records</h4>
          <p className="featured-card-number">250+</p>
        </div>
        <div className="featured-card-div">
          <h4 className="featured-card-title">DNS Types</h4>
          <p className="featured-card-number">50+</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
