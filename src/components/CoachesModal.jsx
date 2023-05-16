import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const CoachesModal = ({
  seasonid,
  teamid,
  team,
  showCoachesModal,
  handleCloseCoachesModal,
}) => {
  const [position, setPosition] = useState("");
  const [coach, setCoach] = useState("");

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleCoachChange = (event) => {
    setCoach(event.target.value);
  };

  const handleCoachesModalClose = () => {
    handleCloseCoachesModal();
  };

  return (
    <div>
      <Modal show={showCoachesModal} onHide={handleCoachesModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set Coaches</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              handleCoachesModalClose();
            }}
          >
            <div className="coach-split">
              <Form.Group controlId="Position">
                <Form.Select
                  className="coach-select"
                  type="text"
                  placeholder="Add Position"
                  as="select"
                  value={position}
                  onChange={handlePositionChange}
                >
                  <option value="" disabled>
                    Coaching Positions
                  </option>
                  <option value="Head">Head Coach</option>
                  <option value="Assistant Coach">Assistant Coach</option>
                  <option value="Volunteer">Volunteer Coach</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="Coach">
                <Form.Select
                  className="coach-select"
                  type="text"
                  placeholder="Add Position"
                  as="select"
                  value={coach}
                  onChange={handleCoachChange}
                >
                  <option value="" disabled>
                    Coaches
                  </option>
                  <option value="1">Coach1</option>
                  <option value="2">Coach2</option>
                  <option value="3">Coach3</option>
                  <option value="4">Coach4</option>
                </Form.Select>
              </Form.Group>

              <Button variant="success add-btn">+</Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseCoachesModal}>
            Go
          </Button>
          <Button variant="secondary" onClick={handleCloseCoachesModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoachesModal;
