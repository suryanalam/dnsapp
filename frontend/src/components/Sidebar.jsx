import React from "react";
import { NavLink } from "react-router-dom";

import GridViewIcon from "@mui/icons-material/GridView";
import ArticleIcon from "@mui/icons-material/Article";

import "../assets/styles/Sidebar.css";

const Sidebar = () => {
  return (
    <nav className="sidebar-bg">
      <NavLink to="/" className="navlink">
        <GridViewIcon sx={{ fontSize: 20 }} />
        Dashboard
      </NavLink>
      <NavLink to="/records" className="navlink">
        <ArticleIcon sx={{ fontSize: 20 }} />
        DNS Records
      </NavLink>

    </nav>
  );
};

export default Sidebar;
