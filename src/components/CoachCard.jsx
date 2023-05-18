import "../styles/Teams.css";
import placeholderImage from "../account-icon-user-icon-vector.png"; /* Default to this if db ref is empty. */
import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { db } from "./Firebase";
import AddCoachModal from "./AddCoachModal";

const CoachCard = ({ coach }) => {
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);

  function handleCoachSave(coachInfo, index) {
    const coachId = coach.id;
    if (!coachId) {
      console.log(`No coach found at index ${index}`);
      return;
    }

    const coachRef = db.ref(`coaches/${coachId}`);
    const updatedCoachInfo = { ...coachInfo };
    delete updatedCoachInfo.delete;

    if (coachInfo.delete) {
      // Remove the coach from the db
      coachRef.remove((error) => {
        if (error) {
          console.log("Error deleting coach information:", error);
        } else {
          console.log("Coach information deleted successfully from Firebase db");
        }
      });
    } else {
      // Update the coach in the database
      coachRef.update(updatedCoachInfo, (error) => {
        if (error) {
          console.log("Error updating coach information:", error);
        } else {
          console.log("Coach information updated successfully from Firebase db");
        }
      });
    }
  }
  
  

  return (
    <div className="coach-card">
      <div className="coach-name-area">
        <h4>{coach.coachName}</h4>
      </div>

      <hr className="yellow"></hr>

      <div className="coach-card-main">
        <Row className="coach-pic-container">
          <img className="coach-pic" src={coach.coachPhoto || placeholderImage} alt="Coach" /> {/* replace 'false' with db ref soon */}
        </Row>

        <Row>{coach.coachSports}</Row>

        <Row>{coach.coachInfo}</Row>
      </div>

      <hr className="yellow"></hr>
      <div className="coach-buttons">

      </div>

      <AddCoachModal
        showAddCoachModal={showAddCoachModal}
        handleCloseAddCoachModal={() => setShowAddCoachModal(false)}
        handleCoachSave={handleCoachSave}
      />
    </div>
  );
};

export default CoachCard;
