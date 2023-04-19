import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db } from "./Firebase";

const Roster = ({ teamID, seasonID }) => {
  const [roster, setRoster] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedRoster = [...roster];
    const updatedPlayerInfo = { ...updatedRoster[index], [name]: value };
    updatedRoster[index] = updatedPlayerInfo;
    setRoster(updatedRoster);
  }

  useEffect(() => {
    const rosterRef = db.ref(`seasons/-NTP7b81Z_ukNDZDTYWO/teams/-NTP7dM88Q5jagDA5RdA/roster`);
    rosterRef.on("value", (snapshot) => {
      const rosterData = snapshot.val();
      if (rosterData) {
        const rosterList = Object.keys(rosterData).map((key) => {
          return { id: key, ...rosterData[key] };
        });
        setRoster(rosterList);
      } else {
        setRoster([]);
      }
    });
  }, []);

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleSave(playerInfo, index) {
    console.log("handleSave");
    const id = roster[index].id;
    const updatedPlayerInfo = { ...roster[index], ...playerInfo, id: id };
    db.ref(`roster/${id}`).set(updatedPlayerInfo, (error) => {
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
    });
  }

  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this player?")) {
      const updatedRoster = [...roster];
      updatedRoster.splice(index, 1);
      db.ref(`seasons/-NTP7b81Z_ukNDZDTYWO/teams/-NTP7dM88Q5jagDA5RdA/roster/${id}`).remove();
      setRoster(updatedRoster);
      setEditIndex(null);
    }
  }

  function handleCancel() {
    setEditIndex(null);
  }

  function handleAddplayer(event) {
    event.preventDefault();
    const number = event.target.elements.number.value;
    const fName = event.target.elements.fName.value;
    const lName = event.target.elements.lName.value;
    const grade = event.target.elements.grade.value;
    const position = event.target.elements.position.value;
    const newplayer = { number, fName, lName, grade, position };
    db.ref(`seasons/-NTP7b81Z_ukNDZDTYWO/teams/-NTP7dM88Q5jagDA5RdA/roster`).push(newplayer);
    event.target.reset();
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
          <Button variant="outline-warning wsd">
            Opponents
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
                <th>Number</th> <th>First Name</th> <th>Last Name</th>
                <th>Grade</th> <th>Position</th> <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    name="number"
                    placeholder="number"
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
                    type="text"
                    name="grade"
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
                  <Button variant="success wsd2" type="submit">
                    Add Player
                  </Button>
                </td>
              </tr>
              {roster.map((player, index) => (
                <tr key={player.id}>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="number"
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
                        type="text"
                        name="number"
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
                        name="position"
                        value={player.position}
                        onChange={(event) => handleChange(event, index)}
                      />
                    ) : (
                      player.position
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <Button
                          variant="primary wsd"
                          onClick={() => handleSave(player, index)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="warning wsd"
                          onClick={() => handleCancel()}
                        >
                          Cancel
                        </Button>
                      </>
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
