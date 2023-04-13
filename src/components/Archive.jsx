import "../styles/Seasons.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Table, Button } from "react-bootstrap";
import { db } from "./Firebase";

const Archive = () => {
  const [seasons, setSeasons] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newSeasonYear] = useState("");
  const [newSeasonType] = useState("Fall");

  function handleSeasonChange(event, index) {
    const { name, value } = event.target;
    const updatedSeasons = [...seasons];
    const updatedSeasonInfo = { ...updatedSeasons[index], [name]: value };
    updatedSeasons[index] = updatedSeasonInfo;
    setSeasons(updatedSeasons);
  }

  useEffect(() => {
    const seasonsRef = db.ref("archived-seasons");
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

  function handleSeasonRestore(event, id, index) {
    event.preventDefault();
    const year = seasons[index].year;
    const season = seasons[index].season;
    const newSeason = { year, season };
    if (window.confirm("Are you sure you want to restore this season?")) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`archived-seasons/${id}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
    }
    db.ref("seasons").push(newSeason);
  }

  function handleSeasonDelete(id, index) {
    if (
      window.confirm("Are you sure you want to delete this season permanently?")
    ) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`archived-seasons/${id}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
    }
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
        <Link to="/opponents" className="yellow">
          <Button variant="outline-warning">Opponents</Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div>
        <div className="archive-title">
          <h2>Archive</h2>
        </div>
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
                          min="2015"
                          max="2099"
                          id="year"
                          value={newSeasonYear}
                          onChange={(event) => handleSeasonChange(event, index)}
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
                          onChange={(event) => handleSeasonChange(event, index)}
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
                        <></>
                      ) : (
                        <div className="action-buttons">
                          <Button
                            variant="info"
                            onClick={(event) =>
                              handleSeasonRestore(event, season.id, index)
                            }
                          >
                            Restore
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleSeasonDelete(season.id, index)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td colSpan="3" className="text-center align-middle">
                      Placeholder for teams
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

export default Archive;
