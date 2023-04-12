import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Archive = () => {
  return (
    <div className="Container">
      <Link to="/" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      <hr />
      <Link to="/" className="yellow">
        <Button variant="outline-warning">Home</Button>
      </Link>
      <hr className="separator" />
    </div>
  );
};

export default Archive;
