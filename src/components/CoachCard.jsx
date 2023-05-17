import React from "react";
import { Row } from "react-bootstrap";

const CoachCard = () => {
  return (
    <div className="coach-card">
      <div className="coach-name-area">
        <h4>{/*coach.name*/}Coach Name</h4>
      </div>
      <hr className="yellow"></hr>

      <Row>
        {/* Coach Image */}
      </Row>

      <Row>
        {/* Sports Coached */}
      </Row>

      <Row>
        {/* Coach Info */}
      </Row>

      <hr className="yellow"></hr>
      <div className="coach-buttons">
        
      </div>
    </div>
  );
};

export default CoachCard;
