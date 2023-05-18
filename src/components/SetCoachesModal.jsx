import React, { useState, useEffect } from "react";
import { db } from "./Firebase";
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
  const [coaches, setCoaches] = useState([]);
  const [addedRows, setAddedRows] = useState([]);

  useEffect(() => {
    db.ref("coaches").on("value", (snapshot) => {
      const coachesData = snapshot.val();
      if (coachesData) {
        const coachesList = Object.keys(coachesData).map((key) => {
          return { id: key, ...coachesData[key] };
        });
        setCoaches(coachesList);
      } else {
        setCoaches([]);
      }
    });
  }, []);

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

    // Update Firebase database
    const coachesRef = db.ref(`seasons/${seasonid}/teams/${teamid}/coaches${type}`);
    const newCoachKey = coachesRef.push().key;
    const newCoachData = {
      position,
      coach,
    };
    coachesRef.child(newCoachKey).set(newCoachData);

    setAddedRows((prevRows) => [...prevRows, { ...newRow, id: newCoachKey }]);
    setPosition("");
    setCoach("");
  };

  const handleRemoveRow = (index, type) => {
    const removedRow = addedRows.find((_, i) => i === index);
    if (removedRow) {
      // Remove entry from Firebase database
      const coachesRef = db.ref(`seasons/${seasonid}/teams/${teamid}/coaches${type}`);
      const coachToRemove = coachesRef.child(removedRow.id);
      coachToRemove.remove();
    }

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
              : "Coaches"}
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
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.coachName}>
                      {coach.coachName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button
                variant="success add-btn"
                onClick={() =>
                  handleAddRow(
                    showCoachesModal.type === "first" ? "A" : "B"
                  )
                }
              >
                +
              </Button>
            </div>
          </Form>

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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CoachesModal;
