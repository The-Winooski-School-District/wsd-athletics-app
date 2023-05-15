import React /* useRef, useState, useEffect */ from "react";
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
  const handleMultiModalClose = () => {
    console.log(team);
    handleCloseMultiModal();
  };

  return (
    <div>
      <Modal show={showMultiModal} onHide={handleMultiModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Team Split</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="splitter">
            <Form.Label className="multimodal-title">
              Which Team's {rosterButtonClicked ? "Roster" : "Schedule"} is
              being modified?
            </Form.Label>

            {/* THESE BOTH NEED REF= REFRENCES I THINK IDK */}
            <div className="radio2">
              <Form.Check
                inline
                label={team.multi === "V&JV" ? "Varsity" : "A Team"}
                name="splitter"
                type="radio"
                id="team1"
                value={true}
                onChange={console.log(team.multi)}
              />
              <Form.Check
                inline
                label={team.multi === "V&JV" ? "Junior Varsity" : "B Team"}
                name="splitter"
                type="radio"
                id="team2"
                value={false}
                onChange={console.log(team.multi)}
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Link
            to={
              rosterButtonClicked
                ? `/roster/${seasonid}/${teamid}`
                : `/schedule/${seasonid}/${teamid}`
            }
          >
            <Button
              variant="success"
              onClick={() => {
                handleMultiModalClose();
              }}
            >
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
