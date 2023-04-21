import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db } from "./Firebase";

const Roster = () => {
  const navigate = useNavigate();
  const [roster, setRoster] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const { teamid, seasonid } = useParams();
  const [value, setValue] = useState("");


  function handleGoBack() {
    navigate(-1);
  }

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedRoster = [...roster];
    const updatedPlayerInfo = { ...updatedRoster[index], [name]: value };
    updatedRoster[index] = updatedPlayerInfo;
    setRoster(updatedRoster);

    let newValue = event.target.value;
    // Check if the new value is less than 0
    if (newValue < 0) {
      // Update the value to "00"
      newValue = "00";
    }

    setValue(newValue);
  }

  useEffect(() => {
    db.ref(`seasons/${seasonid}`)
      .once("value")
      .then((snapshot) => {
        const exists = snapshot.exists();
        if (exists) {
          db.ref(`seasons/${seasonid}/teams/${teamid}/roster`).on(
            "value",
            (snapshot) => {
              const rosterData = snapshot.val();
              if (rosterData) {
                const rosterList = Object.keys(rosterData).map((key) => {
                  return { id: key, ...rosterData[key] };
                });
                setRoster(rosterList);
              } else {
                setRoster([]);
              }
            }
          );
        } else {
          setIsArchived(true);
          db.ref(`archived-seasons/${seasonid}/teams/${teamid}/roster`).on(
            "value",
            (snapshot) => {
              const rosterData = snapshot.val();
              if (rosterData) {
                const rosterList = Object.keys(rosterData).map((key) => {
                  return { id: key, ...rosterData[key] };
                });
                setRoster(rosterList);
              } else {
                setRoster([]);
              }
            }
          );
        }
      });
  }, [seasonid, teamid]);

  function handleAddplayer(event) {
    event.preventDefault();
    const number = event.target.elements.number.value;
    const fName = event.target.elements.fName.value;
    const lName = event.target.elements.lName.value;
    const grade = event.target.elements.grade.value;
    const position = event.target.elements.position.value;
    const newplayer = { number, fName, lName, grade, position };
    db.ref(`seasons/${seasonid}/teams/${teamid}/roster`).push(newplayer);
    event.target.reset();
    setValue(""); // reset the player.number field to its default value
  }

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleSave(playerInfo, index) {
    const id = playerInfo.id;
    const updatedPlayerInfo = { ...roster[index], ...playerInfo, id: id };
    db.ref(`seasons/${seasonid}/teams/${teamid}/roster/${id}`).set(
      updatedPlayerInfo,
      (error) => {
        if (error) {
          console.log("Error updating player information:", error);
        } else {
          console.log(
            "player information updated successfully in Firebase database."
          );
          const updatedRoster = [...roster];
          updatedRoster[index] = updatedPlayerInfo;
          setRoster(updatedRoster);
          setEditIndex(null);
        }
      }
    );
  }

  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this player?")) {
      const updatedRoster = [...roster];
      updatedRoster.splice(index, 1);
      db.ref(`seasons/${seasonid}/teams/${teamid}/roster/${id}`).remove();
      setRoster(updatedRoster);
      setEditIndex(null);
    }
  }

  function handleCancel() {
    setEditIndex(null);
  }

  return (
    <div className="Container">
      <Link to="/*" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      <div className="navbuttons">
        <Link to="/seasons" className="yellow">
          <Button variant="outline-warning wsd">Seasons</Button>
        </Link>
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning wsd">Archive</Button>
        </Link>
        <Link to="/roster" className="yellow">
          <Button variant="outline-warning wsd">Opponents</Button>
        </Link>
        <Link className="yellow">
          <Button variant="outline-danger wsd" onClick={handleGoBack}>
            Go Back
          </Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div>
        <div className="roster-title">
          <h2>Roster</h2>
        </div>
        <Form onSubmit={handleAddplayer}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Grade</th>
                <th>Position</th>
                {isArchived ? null : <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isArchived ? null : (
                <tr>
                  <td>
                    <Form.Control
                      type="number"
                      name="number"
                      min="-1"
                      max="99"
                      value={value}
                      placeholder="Player Number"
                      onChange={handleChange}
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="fName"
                      placeholder="First Name"
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="lName"
                      placeholder="Last Name"
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="grade"
                      min="6"
                      max="12"
                      placeholder="Grade"
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="position"
                      placeholder="Position(s)"
                    />
                  </td>
                  <td>
                    <Button variant="success oneline" type="submit">
                      Add Player
                    </Button>
                  </td>
                </tr>
              )}
              {roster.map((player, index) => (
                <tr key={player.id}>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="number"
                        name="number"
                        min="-1"
                        max="99"
                        placeholder="Player Number"
                        value={player.number}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      player.number
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="fName"
                        value={player.fName}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      player.fName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="lName"
                        value={player.lName}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      player.lName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="number"
                        name="grade"
                        value={player.grade}
                        min="6"
                        max="12"
                        placeholder="Grade"
                        required
                      />
                    ) : (
                      player.grade
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="position"
                        value={player.position}
                        onChange={(event) => handleChange(event, index)}
                      />
                    ) : (
                      player.position
                    )}
                  </td>
                  {isArchived ? null : (
                    <td>
                      {editIndex === index ? (
                        <div className="action-buttons">
                          <Button
                            variant="primary wsd"
                            onClick={() => handleSave(player, index)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary wsd"
                            onClick={() => handleCancel()}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <Button
                            variant="info wsd"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger wsd"
                            onClick={() => handleDelete(player.id, index)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Form>
      </div>
    </div>
  );
};
export default Roster;
