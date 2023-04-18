import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar navbar-expand-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/*">
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
        <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/seasons" onClick={toggleNav}>
                Seasons
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/archive" onClick={toggleNav}>
                Archive
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/opponents" onClick={toggleNav}>
                Opponents
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;