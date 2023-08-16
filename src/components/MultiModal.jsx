import "../styles/App.css";
import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MultiModal = ({
  team,
  rosterButtonClicked,
  showMultiModal,
  seasonid,
  teamid,
  handleCloseMultiModal,
}) => {
  const [teamB, setTeamB] = useState(false); // Initialize teamB state as false
  const [radioSelected, setRadioSelected] = useState(false); // Initialize radioSelected state as false

  const handleRadioChange = (e) => {
    const selectedTeam = e.target.id;
    setTeamB(selectedTeam === "team2"); // Update teamB state based on the selected radio button
    setRadioSelected(true); // Set radioSelected to true when a radio button is selected
  };

  const handleMultiModalClose = () => {
    handleCloseMultiModal();
  };

  const goButtonClickHandler = () => {
    if (radioSelected) {
      handleMultiModalClose();
    }
  };

  const linkTo = radioSelected
    ? rosterButtonClicked
      ? `/athletics/roster/${seasonid}/${teamid}?teamB=${teamB}`
      : `/athletics/schedule/${seasonid}/${teamid}?teamB=${teamB}`
    : "#";

  return (
    <div>
      <Modal show={showMultiModal} onHide={handleMultiModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Team Split</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="splitter">
            <Form.Label className="multimodal-title">
              Which Team's {rosterButtonClicked ? "Roster" : "Schedule"} is being modified?
            </Form.Label>
            <div className="radio2">
              <Form.Check
                inline
                label={team.multi === "V&JV" ? "Varsity" : "A Team"}
                name="splitter"
                type="radio"
                id="team1"
                onChange={handleRadioChange}
              />
              <Form.Check
                inline
                label={team.multi === "V&JV" ? "Junior Varsity" : "B Team"}
                name="splitter"
                type="radio"
                id="team2"
                onChange={handleRadioChange}
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Link to={linkTo}>
            <Button variant="success" onClick={goButtonClickHandler} disabled={!radioSelected}>
              Go
            </Button>
          </Link>
          <Button variant="secondary" onClick={handleCloseMultiModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MultiModal;
