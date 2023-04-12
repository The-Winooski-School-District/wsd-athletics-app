import "../styles/Seasons.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Table, Button } from "react-bootstrap";
import { db } from "./Firebase";

const Seasons = () => {
  const [seasons, setSeasons] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedSeasons = [...seasons];
    const updatedSeasonInfo = { ...updatedSeasons[index], [name]: value };
    updatedSeasons[index] = updatedSeasonInfo;
    setSeasons(updatedSeasons);
  }

  useEffect(() => {
    const seasonsRef = db.ref("seasons");
    seasonsRef.on("value", (snapshot) => {
      const seasonsData = snapshot.val();
      if (seasonsData) {
        const seasonsList = Object.keys(seasonsData).map((key) => {
          return { id: key, ...seasonsData[key] };
        });
        setSeasons(seasonsList);
      } else {
        setSeasons([]);
      }
    });
  }, []);

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleSave(seasonInfo, index) {
    const id = seasons[index].id;
    const updatedSeasonInfo = {
      ...seasons[index],
      ...seasonInfo,
      id: id,
    };
    db.ref(`seasons/${id}`).set(updatedSeasonInfo, (error) => {
      if (error) {
        console.log("Error updating seasont information:", error);
      } else {
        console.log(
          "Season information updated successfully in Firebase database."
        );
        const updatedSeasons = [...seasons];
        updatedSeasons[index] = updatedSeasonInfo;
        setSeasons(updatedSeasons);
        setEditIndex(null);
      }
    });
  }

  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this season?")) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`seasons/${id}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
    }
  }

  function handleCancel() {
    setEditIndex(null);
  }

  function handleAddSeason(event) {
    event.preventDefault();
    const year = event.target.elements.year.value;
    const season = event.target.elements.season.value;
    const newSeason = { year, season };
    db.ref("seasons").push(newSeason);
    event.target.reset();
  }

  return (
    <div className="Container">
      <Link to="/" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      <hr />
      <Link to="/opponents" className="yellow">
        <Button variant="outline-warning">Opponents</Button>
      </Link>
      <hr className="separator" />

      <div>
        <div className="seasons-title">
          <h2>Seasons</h2>
        </div>
        <Form onSubmit={handleAddSeason}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Year</th>
                <th>Season</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    name="year"
                    placeholder="Year"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="season"
                    placeholder="Season"
                    required
                  />
                </td>
                <td>
                  <Button variant="success" type="submit">
                    Add
                  </Button>
                </td>
              </tr>
              {seasons.map((season, index) => (
                <React.Fragment key={season.id}>
                  <tr>
                    <td>
                      {editIndex === index ? (
                        <Form.Control
                          type="text"
                          name="year"
                          value={season.year}
                          onChange={(event) => handleChange(event, index)}
                          required
                        />
                      ) : (
                        season.year
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <Form.Control
                          type="text"
                          name="season"
                          value={season.season}
                          onChange={(event) => handleChange(event, index)}
                          required
                        />
                      ) : (
                        season.season
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={() => handleSave(season, index)}
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
                        <>
                          <Button
                            variant="info"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(season.id, index)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td colSpan="3" className="text-center align-middle">
                      <Button variant="primary">Add Team</Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Form>
      </div>
    </div>
  );
};

export default Seasons;
