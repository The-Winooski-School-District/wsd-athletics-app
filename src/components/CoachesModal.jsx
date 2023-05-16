import React, { useState } from "react";
import { Modal, Form, Button, Row } from "react-bootstrap";

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

  const handleAddRow = (type) => {
    const newRow = {
      position,
      coach,
      type,
    };
    setAddedRows((prevRows) => [...prevRows, newRow]);
    setPosition("");
    setCoach("");
  };

  const handleRemoveRow = (index) => {
    setAddedRows((prevRows) => prevRows.filter((_, i) => i !== index));
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
                  <option value="Head Coach">Head Coach</option>
                  <option value="Assistant Coach">Assistant Coach</option>
                  <option value="Volunteer Coach">Volunteer Coach</option>
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
                  <option value="Coach 1">Coach1</option>
                  <option value="Coach 2">Coach2</option>
                  <option value="Coach 3">Coach3</option>
                  <option value="Coach 4">Coach4</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="success add-btn"
                onClick={() =>
                  handleAddRow(
                    showCoachesModal.type === "first" ? "first" : "second"
                  )
                }
              >
                +
              </Button>
            </div>
            <div className="coach-rows">
            {addedRows.some((row) => row.type === showCoachesModal.type) && (
              <hr className="modal-hr2" />
            )}
              {addedRows
                .filter((row) => row.type === showCoachesModal.type)
                .map((row, index) => (
                  <Row key={index} className="added-row">
                    <div className="col">{row.position}</div>
                    <div className="col">{row.coach}</div>
                    <div className="col-auto">
                      <Button
                        variant="danger"
                        className="subt-btn"
                        onClick={() => handleRemoveRow(index)}
                      >
                        -
                      </Button>
                    </div>
                  </Row>
                ))}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseCoachesModal}>
            Done
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
