import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Seasons = () => {
  return (
    <div className="Container">
      <Link to="/" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      <hr />
      <Link to="/opponents" className="yellow">
        <Button variant="outline-warning">Opponents</Button>
      </Link>
      <hr className="separator" />
    </div>
  );
};

export default Seasons;
