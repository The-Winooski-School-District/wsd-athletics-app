import "../styles/Opponents.css";
import "../index.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db } from "./Firebase";
import { CSVLink } from "react-csv";

const Opponents = () => {
  const [opponents, setOpponents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const csvData = opponents.map(({ name, phone, address, school, fax }) => ({
    name,
    phone,
    address,
    school,
    fax,
  }));

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
      <Link to="/" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      <div className="navbuttons">
        <Link to="/seasons" className="yellow">
          <Button variant="outline-warning wsd">Seasons</Button>
        </Link>
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning wsd">Archive</Button>
        </Link>
        <Link to="/opponents" className="yellow">
          <Button variant="outline-warning wsd" disabled>
            Opponents
          </Button>
        </Link>
      </div>

      <hr className="top-hr" />
      <div>
        <div className="opponents-title">
          <h2>Opponents</h2>
        </div>
        
          <CSVLink
            data={csvData}
            filename={"opponents.csv"}
            target="_blank"
            omit={["id"]}
          >
           <Button variant="danger wsd csv"> Export to CSV </Button>
          </CSVLink>

        <Form onSubmit={handleAddOpponent}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>School</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Fax</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
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
                      <a
                        href={`https://www.google.com/maps/place/${opponent.address}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {opponent.address.replace(/\+/g, " ")}
                      </a>
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
                      <a href={`tel:${opponent.phone.replace(/\D/g, "")}`}>
                        {opponent.phone}
                      </a>
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
                    ) : opponent.fax !== "NULL" ? (
                      opponent.fax
                    ) : null}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <div className="action-buttons">
                        <Button
                          variant="primary wsd"
                          onClick={() => handleSave(opponent, index)}
                          disabled
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary wsd"
                          onClick={() => handleCancel()}
                          disabled
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <Button
                          variant="info wsd"
                          onClick={() => handleEdit(index)}
                          disabled
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger wsd"
                          onClick={() => handleDelete(opponent.id, index)}
                          disabled
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
