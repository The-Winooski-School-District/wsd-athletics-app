import "../styles/App.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/athletics">
          WSD Athletics
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarNav"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/athletics/seasons" onClick={toggleNav}>
                  Seasons
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/athletics/archive" onClick={toggleNav}>
                  Archive
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/athletics/opponents" onClick={toggleNav}>
                  Opponents
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/athletics/coaches" onClick={toggleNav}>
                  Coaches
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/athletics/forms" onClick={toggleNav}>
                  Athlete Forms
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/athletics/login" onClick={toggleNav}>
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
