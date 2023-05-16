import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const CoachesModal = ({
  seasonid,
  teamid,
  team,
  showCoachesModal,
  handleCloseCoachesModal,
}) => {
  const [position, setPosition] = useState("");
  const [coach, setCoach] = useState("");
  const [addedRows, setAddedRows] = useState([]);

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleCoachChange = (event) => {
    setCoach(event.target.value);
  };

  const handleAddRow = () => {
    const newRow = {
      position,
      coach,
    };
    setAddedRows((prevRows) => [...prevRows, newRow]);
    setPosition("");
    setCoach("");
  };

  const handleCoachesModalClose = () => {
    handleCloseCoachesModal();
  };

  return (
    <div>
      <Modal show={showCoachesModal} onHide={handleCoachesModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {team.identicalCoaches === true
              ? `${team.name} Coaches`
              : team.multi === "A&B"
              ? showCoachesModal.type === "first"
                ? `${team.name} A Team Coaches`
                : `${team.name} B Team Coaches`
              : team.multi === "V&JV"
              ? showCoachesModal.type === "first"
                ? `${team.name} Varsity Team Coaches`
                : `${team.name} Junior Varsity Coaches`
              : ""}

            {/*team.identicalCoaches === true
              ? `${team.name} Coaches`
              : team.multi === "A&B"
              ? showCoachesModal.type === "first"
                ? <><p>{team.name}</p><p>A Team Coaches</p></>
                : <><p>{team.name}</p><p>B Team Coaches</p></>
              : team.multi === "V&JV"
              ? showCoachesModal.type === "first"
                ? <><p>{team.name}</p><p>Varsity Team Coaches</p></>
                : <><p>{team.name}</p><p>Junior Varsity Coaches</p></>
            : ""*/}
          </Modal.Title>
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
                    Coaching Position
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
                    Coach
                  </option>
                  <option value="1">Coach1</option>
                  <option value="2">Coach2</option>
                  <option value="3">Coach3</option>
                  <option value="4">Coach4</option>
                </Form.Select>
              </Form.Group>

              <Button variant="success add-btn" onClick={handleAddRow}>
                +
              </Button>
            </div>

            {addedRows.map((row, index) => (
              <Row key={index} className="added-row">
                <Col>{row.position}</Col>
                <Col>{row.coach}</Col>
                <Col>
                  <Button variant="danger"> - </Button>
                </Col>
              </Row>
            ))}
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
