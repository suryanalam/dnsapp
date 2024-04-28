import React from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let payload;

  if (token) {
    payload = JSON.parse(atob(token.split(".")[1]));
  }

  const handleLogout = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      alert("login info not found !!");
    }
  };

  return (
    <header className="header-bg">
      <h4 className="logo">DNS Manager</h4>
      <div className="header-action-div">
        <p className="greeting-msg">
          Hello, <span>{payload.name}</span>
        </p>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
