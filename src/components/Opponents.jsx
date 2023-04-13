import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db } from "./Firebase";

const Opponents = () => {
  const [opponents, setOpponents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedOpponents = [...opponents];
    const updatedOpponentInfo = { ...updatedOpponents[index], [name]: value };
    updatedOpponents[index] = updatedOpponentInfo;
    setOpponents(updatedOpponents);
  }

  useEffect(() => {
    const opponentsRef = db.ref("opponents");
    opponentsRef.on("value", (snapshot) => {
      const opponentsData = snapshot.val();
      if (opponentsData) {
        const opponentsList = Object.keys(opponentsData).map((key) => {
          return { id: key, ...opponentsData[key] };
        });
        setOpponents(opponentsList);
      } else {
        setOpponents([]);
      }
    });
  }, []);

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleSave(opponentInfo, index) {
    console.log("handleSave");
    const id = opponents[index].id;
    const updatedOpponentInfo = {
      ...opponents[index],
      ...opponentInfo,
      id: id,
    };
    db.ref(`opponents/${id}`).set(updatedOpponentInfo, (error) => {
      if (error) {
        console.log("Error updating opponent information:", error);
      } else {
        console.log(
          "Opponent information updated successfully in Firebase database."
        );
        const updatedOpponents = [...opponents];
        updatedOpponents[index] = updatedOpponentInfo;
        setOpponents(updatedOpponents);
        setEditIndex(null);
      }
    });
  }

  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this opponent?")) {
      const updatedOpponents = [...opponents];
      updatedOpponents.splice(index, 1);
      db.ref(`opponents/${id}`).remove();
      setOpponents(updatedOpponents);
      setEditIndex(null);
    }
  }

  function handleCancel() {
    setEditIndex(null);
  }

  function handleAddOpponent(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const school = event.target.elements.school.value;
    const address = event.target.elements.address.value;
    const phone = event.target.elements.phone.value;
    const fax = event.target.elements.fax.value;
    const newOpponent = { name, school, address, phone, fax };
    db.ref("opponents").push(newOpponent);
    event.target.reset();
  }

  return (
    <div className="Container">
      <Link to="/*" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      
      <div className="navbuttons">
        <Link to="/seasons" className="yellow">
          <Button variant="outline-warning">Seasons</Button>
        </Link>
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning">Archive</Button>
        </Link>
      </div>
      
      <hr className="top-hr" />
      <div>
        <div className="opponents-title">
          <h2>Opponents</h2>
        </div>
        <Form onSubmit={handleAddOpponent}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>School</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Fax</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Opponent name"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="school"
                    placeholder="School name"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Opponent address"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Opponent phone number"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="fax"
                    placeholder="Opponent fax number"
                  />
                </td>
                <td>
                  <Button variant="success" type="submit">
                    Add
                  </Button>
                </td>
              </tr>
              {opponents.map((opponent, index) => (
                <tr key={opponent.id}>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="name"
                        value={opponent.name}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      opponent.name
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="school"
                        value={opponent.school}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      opponent.school
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="address"
                        value={opponent.address}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      opponent.address
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="phone"
                        value={opponent.phone}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      opponent.phone
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="fax"
                        value={opponent.fax}
                        onChange={(event) => handleChange(event, index)}
                      />
                    ) : (
                      opponent.fax
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleSave(opponent, index)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="warning"
                          onClick={() => handleCancel()}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <div className="action-buttons">
                        <Button
                          variant="info"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(opponent.id, index)}
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

export default Opponents;
