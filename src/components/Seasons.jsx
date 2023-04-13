import "../styles/Seasons.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Table, Button, Row, Col } from "react-bootstrap";
import { db } from "./Firebase";

const Seasons = () => {
  const [seasons, setSeasons] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newSeasonYear, setNewSeasonYear] = useState("");
  const [newSeasonType, setNewSeasonType] = useState("");

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
    setNewSeasonYear(seasons[index].year);
    setNewSeasonType(seasons[index].season);
  }

  function handleSeasonSave(seasonInfo, index) {
    const id = seasons[index].id;
    const updatedSeasonInfo = {
      ...seasons[index],
      ...seasonInfo,
      id: id,
    };

    db.ref(`seasons/${id}`).set(updatedSeasonInfo, (error) => {
      if (error) {
        console.log("Error updating season information:", error);
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

  function handleSeasonArchive(event, id, index) {
    event.preventDefault();
    const year = seasons[index].year;
    const season = seasons[index].season;
    const newSeason = { year, season };
    if (window.confirm("Are you sure you want to archive this season?")) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`seasons/${id}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
    }
    db.ref("archived-seasons").push(newSeason);
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
  const deleteme = () => {
    console.log("get ridda 'deleteme' already");
  };

  return (
    <div className="Container">
      <Link to="/*" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>

      <div className="navbuttons">
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning">Archive</Button>
        </Link>
        <Link to="/opponents" className="yellow">
          <Button variant="outline-warning">Opponents</Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div className="season-adder">
        <div className="seasons-title">
          <h2>Seasons</h2>
        </div>
        <Form onSubmit={handleAddSeason}>
          <Row className="justify-content-md-center">
            <Col xs={4}>
              <Form.Control
                type="number"
                placeholder="Year"
                min="2020"
                max="2099"
                id="year"
                value={newSeasonYear}
                onChange={(e) => setNewSeasonYear(e.target.value)}
                required
              />
            </Col>
            <Col xs={3}>
              <Form.Control
                as="select"
                id="season"
                value={newSeasonType}
                onChange={(e) => setNewSeasonType(e.target.value)}
                required
              >
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </Form.Control>
            </Col>
            <Col xs={3} className="border-control">
              <Button variant="primary" type="submit">
                Add Season
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div>
        <Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Year</th>
                <th>Season</th>
                <th className="last-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season, index) => (
                <React.Fragment key={season.id}>
                  <tr>
                    <td>
                      {editIndex === index ? (
                        <Form.Control
                          type="number"
                          placeholder="Year"
                          min="2020"
                          max="2099"
                          id="year"
                          value={newSeasonYear}
                          onChange={(e) => setNewSeasonYear(e.target.value)}
                          required
                        />
                      ) : (
                        season.year
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <Form.Control
                          as="select"
                          id="season"
                          value={newSeasonType}
                          onChange={(e) => setNewSeasonType(e.target.value)}
                          required
                        >
                          <option value="Fall">Fall</option>
                          <option value="Winter">Winter</option>
                          <option value="Spring">Spring</option>
                          <option value="Summer">Summer</option>
                        </Form.Control>
                      ) : (
                        season.season
                      )}
                    </td>
                    <td className="last-col">
                      {editIndex === index ? (
                        <div className="action-buttons">
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleSeasonSave(
                                { year: newSeasonYear, season: newSeasonType },
                                index
                              )
                            }
                          >
                            Save
                          </Button>
                          <Button
                            variant="warning"
                            onClick={() => handleCancel()}
                          >
                            Cancel
                          </Button>
                        </div>
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
                            onClick={(event) =>
                              handleSeasonArchive(event, season.id, index)
                            }
                          >
                            Archive
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td colSpan="3" className="text-center align-middle">
                      <Button variant="primary" onClick={deleteme}>
                        Add Team
                      </Button>
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
