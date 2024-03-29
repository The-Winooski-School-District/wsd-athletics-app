import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Row, Modal, Button } from "react-bootstrap";
import { db, auth } from "./Firebase";
import AddCoachModal from "./AddCoachModal";

const CoachCard = ({ coach }) => {
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in the user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  function handleCoachSave(coachInfo, index) {
    const coachId = coach.id;
    if (!coachId) {
      console.log(`No coach found at index ${index}`);
      return;
    }

    const coachRef = db.ref(`coaches/${coachId}`);
    const updatedCoachInfo = { ...coachInfo };

    if (coachInfo.delete) {
      // Show browser warning dialogue box
      const confirmation = window.confirm(
        "Are you sure you want to delete this coach?"
      );
      if (confirmation) {
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
      }
    } else {
      // Update the coach in the database
      delete updatedCoachInfo.delete;
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
    event.target.src = "http://www.wsdvt.org/wp-content/uploads/2023/07/placeholder-headshot.png";
  };

  const handleCardInfoClick = () => {
    setShowFullText(true);
  };

  const handleCloseModal = () => {
    setShowFullText(false);
  };

  const handleEditButtonClick = () => {
    setShowAddCoachModal(true);
  };

  const truncatedText =
    coach.coachBio.length > 100
      ? coach.coachBio.slice(0, 100) + "..."
      : coach.coachBio;

  const handleDeleteButtonClick = () => {
    handleCoachSave({ delete: true });
  };

  return (
    <div className="coach-card">
      <div className="coach-name-area">
        <h4>{coach.coachName}</h4>
      </div>

      <hr className="yellow"></hr>

      <div className="coach-card-main">
        <Row>
          <div className="coach-pic-container">
            <img
              className="coach-pic"
              src={coach.coachPic}
              onError={handlePicError}
              alt="Coach"
            />
          </div>
        </Row>
        <div className="separator"></div>
        <h5>Bio</h5>
        <Row>
          <div
            className="coach-card-info"
            onClick={handleCardInfoClick}
            style={{ cursor: "pointer" }}
          >
            {truncatedText}
          </div>
        </Row>

        <div className="separator"></div>
        <h5>Sports</h5>

        <Row className="sports-row">
          <div className="coach-card-sports">
            {coach.coachSports.map((sport, index) => (
              <p key={index}>
                <Button variant="outline-warning wsd nohover">{sport}</Button>
              </p>
            ))}
          </div>
        </Row>
      </div>
      {user ? (
        <>
          <hr className="yellow"></hr>

          <div className="coach-buttons">
            <Button className="btn-info wsd" onClick={handleEditButtonClick}>
              Edit
            </Button>
            <Button
              className="btn-danger wsd"
              onClick={handleDeleteButtonClick}
            >
              Delete
            </Button>
          </div>
        </>
      ) : null}
      <AddCoachModal
        coach={coach}
        showAddCoachModal={showAddCoachModal}
        editing={true}
        handleCloseAddCoachModal={() => setShowAddCoachModal(false)}
        handleCoachSave={handleCoachSave}
      />

      <Modal show={showFullText} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{coach.coachName} Full Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="coach-card-info">{coach.coachBio}</div>
        </Modal.Body>
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
