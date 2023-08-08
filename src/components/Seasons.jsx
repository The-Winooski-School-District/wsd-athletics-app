import "../styles/Seasons.css";
import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Table, Button, Row, Col } from "react-bootstrap";
import { db, auth } from "./Firebase";
import AddTeam from "./AddTeam";

const Seasons = () => {
  const [seasons, setSeasons] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newSeasonYear, setNewSeasonYear] = useState("");
  const [newSeasonType, setNewSeasonType] = useState("");
  const [clickedSeasonIndex, setClickedSeasonIndex] = useState(null);
  const [user, setUser] = useState(null);

  if (!clickedSeasonIndex) {
    /* Do Nothing */
  }

  /* authentication */
  useEffect(() => {
    // Listen for changes in the user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const sortedSeasons = seasons.sort(compareSeasons);

  // define the compare function to sort seasons in chronological order
  function compareSeasons(seasonA, seasonB) {
    // compare years first
    if (seasonA.year > seasonB.year) {
      return -1; // seasonA comes first
    } else if (seasonA.year < seasonB.year) {
      return 1; // seasonB comes first
    } else {
      // if years are equal, compare season types
      const seasonOrder = ["Summer", "Spring", "Winter", "Fall"];
      const seasonIndexA = seasonOrder.indexOf(seasonA.season);
      const seasonIndexB = seasonOrder.indexOf(seasonB.season);
      return seasonIndexB - seasonIndexA; // seasonA comes first if it's later in the year
    }
  }

  function handleAddTeamClick(index) {
    setClickedSeasonIndex(index);
  }

  useEffect(() => {
    /* use db to populate seasons */
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

  /* To make sure we dont have duplicate seasons per year */
  function yearSeasonChecker(year, season) {
    const year_season = `${year}_${season}`;
    const seasonsRef = db.ref("seasons");
    const archivedSeasonsRef = db.ref("archived-seasons");

    return Promise.all([
      seasonsRef.orderByChild("year_season").equalTo(year_season).once("value"),
      archivedSeasonsRef
        .orderByChild("year_season")
        .equalTo(year_season)
        .once("value"),
    ])
      .then((snapshots) => {
        const [seasonsSnapshot, archivedSeasonsSnapshot] = snapshots;
        const seasonExists = seasonsSnapshot.exists();
        const archivedSeasonExists = archivedSeasonsSnapshot.exists();

        return { seasonExists, archivedSeasonExists };
      })
      .catch((error) => {
        console.log("Error checking if year_season exists:", error);
      });
  }

  /* add season to db */
  function handleAddSeason(event) {
    event.preventDefault();
    const year = event.target.elements.year.value;
    const season = event.target.elements.season.value;

    yearSeasonChecker(year, season).then(
      ({ seasonExists, archivedSeasonExists }) => {
        if (seasonExists) {
          alert(
            `Cannot add team: ${year} ${season} already exists in 'seasons' collection.`
          );
        } else if (archivedSeasonExists) {
          alert(
            `Cannot add team: ${year} ${season} already exists in 'archived-seasons' collection.`
          );
        } else {
          const newSeason = { year, season, year_season: `${year}_${season}` };
          db.ref("seasons").push(newSeason);
          event.target.reset();
        }
      }
    );
  }

  /* edit season in db */
  function handleSeasonSave(seasonInfo, index) {
    const id = seasons[index].id;
    const updatedSeasonInfo = {
      ...seasons[index],
      ...seasonInfo,
      id: id,
    };

    /* To make sure we dont have duplicate seasons per year */
    const { year, season } = updatedSeasonInfo;
    yearSeasonChecker(year, season).then(
      ({ seasonExists, archivedSeasonExists }) => {
        if (seasonExists) {
          alert(
            `Cannot update season: ${year} ${season} already exists in 'seasons' collection.`
          );
        } else if (archivedSeasonExists) {
          alert(
            `Cannot update season: ${year} ${season} already exists in 'archived-seasons' collection.`
          );
        } else {
          // Update the year_season field
          updatedSeasonInfo.year_season = `${year}_${season}`;

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
      }
    );
  }

  /* sends season to Archive in db and app UI */
  function handleSeasonArchive(event, id, index) {
    event.preventDefault();
    const seasonId = id;
    const year = seasons[index].year;
    const season = seasons[index].season;
    const teams = seasons[index].teams ? seasons[index].teams : {};
    const year_season = `${year}_${season}`;
    const newSeason = { year, season, teams };
    if (window.confirm("Are you sure you want to archive this season?")) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`seasons/${seasonId}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
      db.ref(`archived-seasons/${seasonId}`).set({ year_season, ...newSeason });
    }
  }

  function handleCancel() {
    setEditIndex(null);
  }

  return (
    <div className="Container">
      <Link to="/athletics" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>

      <div className="navbuttons">
        <Link to="/seasons" className="yellow">
          <Button variant="outline-warning wsd disabled" disabled>
            Seasons
          </Button>
        </Link>
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning wsd">Archive</Button>
        </Link>
        <Link to="/opponents" className="yellow">
          <Button variant="outline-warning wsd">Opponents</Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div className="season-adder">
        <div
          className="seasons-title"
          style={user ? {} : { padding: "0", important: true }}
        >
          <h2>Seasons</h2>
        </div>

        {user ? (
          <Form onSubmit={handleAddSeason}>
            <Row className="justify-content-md-center">
              <Col xs={4}>
                <Form.Control
                  type="number"
                  placeholder="Year"
                  min="2023"
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
                </Form.Control>
              </Col>
              <Col xs={3} className="border-control">
                <Button variant="primary  wsd" type="submit">
                  Add Season
                </Button>
              </Col>
            </Row>
          </Form>
        ) : null}
      </div>
      <div>
        <Form>
          <Table striped bordered hover>
            <tbody>
              {sortedSeasons.map((season, index) => (
                <React.Fragment key={season.id}>
                  <tr>
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
                        </Form.Control>
                      ) : (
                        <h4 className="column-title">{season.season}</h4>
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <Form.Control
                          type="number"
                          placeholder="Year"
                          min="2023"
                          max="2099"
                          id="year"
                          value={newSeasonYear}
                          onChange={(e) => setNewSeasonYear(e.target.value)}
                          required
                        />
                      ) : (
                        <h4 className="column-title">
                          {season.year + ` - ${parseInt(season.year) + 1}`}
                        </h4>
                      )}
                    </td>
                    {user ? (
                      <td className="last-col">
                        {editIndex === index ? (
                        <div className="action-buttons">
                          <Button
                            variant="primary wsd"
                            onClick={() =>
                              handleSeasonSave(
                                {
                                  year: newSeasonYear,
                                  season: newSeasonType,
                                },
                                index
                              )
                            }
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
                            onClick={(event) =>
                              handleSeasonArchive(event, season.id, index)
                            }
                          >
                            Archive
                          </Button>
                        </div>
                        )}
                      </td>
                    ) : null}
                  </tr>
                  <tr>
                    <td colSpan="3" className="teams-row">
                      {/* render the "Add Team" button */}
                      <AddTeam
                        seasonid={season.id}
                        index={index}
                        onAddTeamClick={handleAddTeamClick}
                      />
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
