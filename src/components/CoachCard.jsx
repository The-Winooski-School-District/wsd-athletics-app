import "../styles/Teams.css";
import placeholderImage from "../account-icon-user-icon-vector.png";
import React, { useState } from "react";
import { Row, Modal, Button } from "react-bootstrap";
import { db } from "./Firebase";
import AddCoachModal from "./AddCoachModal";

const CoachCard = ({ coach }) => {
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

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
          console.log(
            "Coach information deleted successfully from Firebase db"
          );
        }
      });
    } else {
      // Update the coach in the database
      coachRef.update(updatedCoachInfo, (error) => {
        if (error) {
          console.log("Error updating coach information:", error);
        } else {
          console.log(
            "Coach information updated successfully from Firebase db"
          );
        }
      });
    }
  }

  const handlePicError = (event) => {
    event.target.src = placeholderImage;
  };

  const handleCardInfoClick = () => {
    setShowFullText(true);
  };

  const handleCloseModal = () => {
    setShowFullText(false);
  };

  const truncatedText = coach.coachInfo.length > 100 ? coach.coachInfo.slice(0, 100) + "..." : coach.coachInfo;

  return (
    <div className="coach-card">
      <div className="coach-name-area">
        <h4>{coach.coachName}</h4>
      </div>

      <hr className="yellow"></hr>

      <div className="coach-card-main">
        <Row className="coach-pic-container">
          <img
            className="coach-pic"
            src={coach.coachPhoto}
            onError={handlePicError}
            alt="Coach"
          />
        </Row>

        <Row>
          <div
            className="coach-card-sports"
            onClick={handleCardInfoClick}
            style={{ cursor: "pointer" }}
          >
            {coach.coachSports.map((sport, index) => (
              <p key={index}>{sport}</p>
            ))}
          </div>
        </Row>

        <Row>
          <div
            className="coach-card-info"
            onClick={handleCardInfoClick}
            style={{ cursor: "pointer" }}
          >
            {truncatedText}
          </div>
        </Row>
      </div>

      <hr className="yellow"></hr>
      <div className="coach-buttons"></div>

      <AddCoachModal
        showAddCoachModal={showAddCoachModal}
        handleCloseAddCoachModal={() => setShowAddCoachModal(false)}
        handleCoachSave={handleCoachSave}
      />

      <Modal show={showFullText} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{coach.coachName} Full Info</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="coach-card-info">{coach.coachInfo}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoachCard;