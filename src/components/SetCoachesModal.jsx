import React, { useState, useEffect } from "react";
import { db } from "./Firebase";
import { Modal, Form, Button, Row } from "react-bootstrap";

const SetCoachesModal = ({
  seasonid,
  teamid,
  team,
  showSetCoachesModal,
  handleCloseCoachesModal,
}) => {
  const [position, setPosition] = useState("");
  const [coach, setCoach] = useState("");
  const [coaches, setCoaches] = useState([]);

  const [addedRowsA, setAddedRowsA] = useState([]);
  const [addedRowsB, setAddedRowsB] = useState([]);
  const { twoTeams, show } = showSetCoachesModal;

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
  
    // Fetch the team-specific coaches
    const teamCoachesRefA = db.ref(
      `seasons/${seasonid}/teams/${teamid}/coachesA`
    );
    const teamCoachesRefB = db.ref(
      `seasons/${seasonid}/teams/${teamid}/coachesB`
    );
  
    teamCoachesRefA.once("value", (snapshot) => {
      const teamACoachesData = snapshot.val();
      if (teamACoachesData) {
        const teamACoaches = Object.keys(teamACoachesData).map((key) => {
          return { id: key, ...teamACoachesData[key] };
        });
        setAddedRowsA(teamACoaches);
      } else {
        setAddedRowsA([]);
      }
    });
  
    teamCoachesRefB.once("value", (snapshot) => {
      const teamBCoachesData = snapshot.val();
      if (teamBCoachesData) {
        const teamBCoaches = Object.keys(teamBCoachesData).map((key) => {
          return { id: key, ...teamBCoachesData[key] };
        });
        setAddedRowsB(teamBCoaches);
      } else {
        setAddedRowsB([]);
      }
    });
  
    // Clean up the listeners when the component is unmounted
    return () => {
      db.ref("coaches").off();
      teamCoachesRefA.off();
      teamCoachesRefB.off();
    };
  }, [seasonid, teamid]);

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleCoachChange = (event) => {
    setCoach(event.target.value);
  };

  const handleAddRow = (team) => {
    const newRow = {
      position,
      coach,
    };

    // Update Firebase database
    const coachesRef = db.ref(
      `seasons/${seasonid}/teams/${teamid}/coaches${team}`
    );
    const newCoachRef = coachesRef.push();
    const newCoachKey = newCoachRef.key;
    const newCoachData = {
      position,
      coach,
    };

    newCoachRef
      .set(newCoachData)
      .then(() => {
        if (team === "A") {
          setAddedRowsA((prevRows) => [
            ...prevRows,
            { ...newRow, id: newCoachKey },
          ]);
        } else if (team === "B") {
          setAddedRowsB((prevRows) => [
            ...prevRows,
            { ...newRow, id: newCoachKey },
          ]);
        }
        setPosition("");
        setCoach("");
      })
      .catch((error) => {
        console.log("Error adding coach:", error);
      });
  };

  const handleRemoveRow = (team, originalIndex) => {
    let removedRow;

    if (team === "A") {
      removedRow = addedRowsA.find((_, i) => i === originalIndex);
    } else if (team === "B") {
      removedRow = addedRowsB.find((_, i) => i === originalIndex);
    }

    if (removedRow) {
      // Remove entry from Firebase database
      const coachesRef = db.ref(
        `seasons/${seasonid}/teams/${teamid}/coaches${team}`
      );
      const coachToRemove = coachesRef.child(removedRow.id);

      coachToRemove
        .remove()
        .then(() => {
          if (team === "A") {
            setAddedRowsA((prevRows) => {
              return prevRows.filter((row) => row.id !== removedRow.id);
            });
          } else if (team === "B") {
            setAddedRowsB((prevRows) => {
              return prevRows.filter((row) => row.id !== removedRow.id);
            });
          }
        })
        .catch((error) => {
          console.log("Error removing coach:", error);
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
            {twoTeams === "A" && addedRowsA.length > 0 && (
              <hr className="modal-hr2" />
            )}
            {twoTeams === "A" &&
              addedRowsA.map((row, index) => (
                <Row key={index} className="added-row">
                  <div className="col">{row.position}</div>
                  <div className="col">{row.coach}</div>
                  <div className="col-auto">
                    <Button
                      variant="danger"
                      className="subt-btn"
                      onClick={() => handleRemoveRow("A", index)}
                    >
                      -
                    </Button>
                  </div>
                </Row>
              ))}

            {twoTeams === "B" && addedRowsB.length > 0 && (
              <hr className="modal-hr2" />
            )}
            {twoTeams === "B" &&
              addedRowsB.map((row, index) => (
                <Row key={index} className="added-row">
                  <div className="col">{row.position}</div>
                  <div className="col">{row.coach}</div>
                  <div className="col-auto">
                    <Button
                      variant="danger"
                      className="subt-btn"
                      onClick={() => handleRemoveRow("B", index)}
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