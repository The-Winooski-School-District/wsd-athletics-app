import React, { useState, useEffect } from "react";
import { db } from "./Firebase";
import { Modal, Form, Button, Row } from "react-bootstrap";

const SetCoachesModal = ({
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
  const { twoTeams, show } = showCoachesModal;

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

  const handleAddRow = (twoTeams) => {
    const newRow = {
      position,
      coach,
      twoTeams,
    };

    // Update Firebase database
    const coachesRef = db.ref(
      `seasons/${seasonid}/teams/${teamid}/coaches${twoTeams}`
    );
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

const handleRemoveRow = (originalIndex, twoTeams) => {
  const removedRow = addedRows.find((_, i) => i === originalIndex);
  if (removedRow) {
    // Remove entry from Firebase database
    const coachesRef = db.ref(`seasons/${seasonid}/teams/${teamid}/coaches${removedRow.twoTeams}`);
    const coachToRemove = coachesRef.child(removedRow.id);
    coachToRemove.remove()
      .then(() => {
        // Update the addedRows state by filtering out the removed coach
        setAddedRows((prevRows) => {
          return prevRows.filter(
            (row) => row.id !== removedRow.id || row.twoTeams !== twoTeams
          );
        });
      })
      .catch((error) => {
        console.log('Error removing coach:', error);
      });
  }
};


  const handleCoachesModalClose = () => {
    handleCloseCoachesModal();
  };

  return (
    <div>
      <Modal show={show} onHide={handleCoachesModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {team.identicalCoaches === true
              ? `${team.name} Coaches`
              : team.multi === "A&B"
              ? twoTeams === "A"
                ? `${team.name} A Team Coaches`
                : `${team.name} B Team Coaches`
              : team.multi === "V&JV"
              ? twoTeams === "A"
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
                onClick={() => handleAddRow(twoTeams)}
              >
                +
              </Button>
            </div>
          </Form>

          <div className="coach-rows">
            {addedRows.some((row) => row.twoTeams === twoTeams) && (
              <hr className="modal-hr2" />
            )}
            {addedRows
              .filter((row) => row.twoTeams === twoTeams)
              .map((row, index) => (
                <Row key={index} className="added-row">
                  <div className="col">{row.position}</div>
                  <div className="col">{row.coach}</div>
                  <div className="col-auto">
                    <Button
                      variant="danger"
                      className="subt-btn"
                      onClick={() => handleRemoveRow(index, twoTeams)}
                    >
                      -
                    </Button>
                  </div>
                </Row>
              ))}
          </div>
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

export default SetCoachesModal;
