import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db } from "./Firebase";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const [opponents, setOpponents] = useState([]);
  const { teamid, seasonid } = useParams();
  const [teamName, setTeamName] = useState("");
  const [teamMulti, setTeamMulti] = useState("");
  const [teamSchedulesIdentical, setTeamSchedulesIdentical] = useState("");
  const [seasonName, setSeasonName] = useState("");
  const [loadedData, setLoadedData] = useState([]);

  const csvData = schedule.map(({ date, opponent, location, time, score }) => ({
    date,
    opponent,
    location,
    time,
    score,
  }));

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedSchedule = [...schedule];
    const updatedOpponentInfo = { ...updatedSchedule[index], [name]: value };
    updatedSchedule[index] = updatedOpponentInfo;
    setSchedule(updatedSchedule);
  }

  const isTrueUrl = window.location.href.endsWith("true");

  // Set teamB based on the URL
  const teamB = isTrueUrl ? true : false;

  // Set the roster path based on teamB
  const schedulePath = teamB
    ? `/${seasonid}/teams/${teamid}/schedule-b`
    : `/${seasonid}/teams/${teamid}/schedule`;

  useEffect(() => {
    db.ref(`seasons/${seasonid}`)
      .once("value")
      .then((snapshot) => {
        const exists = snapshot.exists();
        if (exists) {
          const seasonData = snapshot.val();
          if (seasonData) {
            const seasonName = seasonData.year + " " + seasonData.season;
            setSeasonName(seasonName);
          }

          db.ref(`seasons/` + schedulePath).on("value", (snapshot) => {
            const scheduleData = snapshot.val();
            if (scheduleData) {
              const scheduleList = Object.keys(scheduleData).map((key) => {
                return { id: key, ...scheduleData[key] };
              });
              setSchedule(scheduleList);
            } else {
              setSchedule([]);
            }
          });

          db.ref(`seasons/${seasonid}/teams/${teamid}`)
            .once("value")
            .then((snapshot) => {
              const teamData = snapshot.val();
              if (teamData) {
                const teamName = teamData.name;
                const teamMulti = teamData.multi;
                const schedulesIdentical = teamData.identicalSchedules;
                // Set the team's name in state
                setTeamName(teamName);
                setTeamMulti(teamMulti);
                setTeamSchedulesIdentical(schedulesIdentical);
              }
            });
        } else {
          setIsArchived(true);
          db.ref(`archived-seasons/${seasonid}`)
            .once("value")
            .then((snapshot) => {
              const seasonData = snapshot.val();
              if (seasonData) {
                const seasonName = seasonData.year + " " + seasonData.season;
                setSeasonName(seasonName);
              }
            });

          db.ref(`archived-seasons/` + schedulePath).on("value", (snapshot) => {
            const scheduleData = snapshot.val();
            if (scheduleData) {
              const scheduleList = Object.keys(scheduleData).map((key) => {
                return { id: key, ...scheduleData[key] };
              });
              setSchedule(scheduleList);
            } else {
              setSchedule([]);
            }
          });

          db.ref(`archived-seasons/${seasonid}/teams/${teamid}`)
            .once("value")
            .then((snapshot) => {
              const teamData = snapshot.val();
              if (teamData) {
                const teamName = teamData.name;
                const teamMulti = teamData.multi;
                const schedulesIdentical = teamData.identicalSchedules;
                // Set the team's name in state
                setTeamName(teamName);
                setTeamMulti(teamMulti);
                setTeamSchedulesIdentical(schedulesIdentical);
              }
            });
        }
      });
    db.ref(`opponents`).on("value", (snapshot) => {
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
  }, [seasonid, teamid, schedulePath]);

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleSave(gameInfo, index) {
    const id = gameInfo.id;
    const updatedGameInfo = { ...schedule[index], ...gameInfo, id: id };
    db.ref(`seasons/` + schedulePath + `/${id}`).set(
      updatedGameInfo,
      (error) => {
        if (error) {
          console.log("Error updating game schedule information:", error);
        } else {
          console.log(
            "Game schedule information updated successfully in Firebase database."
          );
          const updatedSchedule = [...schedule];
          updatedSchedule[index] = updatedGameInfo;
          setSchedule(updatedSchedule);
          setEditIndex(null);
        }
      }
    );
  }

  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this game?")) {
      const updatedSchedule = [...schedule];
      updatedSchedule.splice(index, 1);
      db.ref(`seasons/${seasonid}/teams/${teamid}/schedule/${id}`).remove();
      setSchedule(updatedSchedule);
      setEditIndex(null);
    }
  }
  function handleCancel() {
    setEditIndex(null);
  }

  function handleAddGame(event) {
    event.preventDefault();
    const date = event.target.elements.date.value;
    const opponent = event.target.elements.opponent.value;
    const location = event.target.elements.location.value;
    const time = event.target.elements.time.value;
    const score = event.target.elements.score.value;
    const newGame = { date, opponent, location, time, score };
    db.ref(`seasons/` + schedulePath).push(newGame);
    event.target.reset();
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(":");
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${period}`;
  }

  function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${month} - ${day} - ${year}`;
  }

  const handleFileLoaded = (data, fileInfo) => {
    const newSchedule = data.map((row) => ({
      date: row.date,
      opponent: row.opponent,
      location: row.location,
      time: row.time,
      score: row.score,
    }));
    const uniqueNewSchedule = newSchedule.filter((newGame) => {
      let found = false;
      for (let i = 0; i < loadedData.length; i++) {
        const loadedGame = loadedData[i];
        if (
          loadedGame &&
          newGame.date === loadedGame.date &&
          newGame.opponent === loadedGame.opponent &&
          newGame.location === loadedGame.location &&
          newGame.time === loadedGame.time &&
          newGame.score === loadedGame.score
        ) {
          found = true;
          break;
        }
      }
      return !found;
    });
    if (uniqueNewSchedule.length === 0) {
      alert("The file you uploaded contains only duplicates.");
    } else {
      const scheduleRef = db.ref(`seasons/` + schedulePath);
      uniqueNewSchedule.forEach((newGame) => {
        scheduleRef.push(newGame);
      });
      setSchedule([...schedule, ...uniqueNewSchedule]);
      setLoadedData([...loadedData, ...uniqueNewSchedule]);
    }
  };

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
          <Button variant="outline-warning wsd">Opponents</Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div>
        <div className="opponents-title">
          {teamSchedulesIdentical ? null : (
            <Link to={`/schedule/${seasonid}/${teamid}?teamB=${!teamB}`}>
              <Button variant="info title-button wsd">Switch Teams</Button>
            </Link>
          )}

          <h2>
            {teamSchedulesIdentical
              ? `${seasonName} - ${teamName}`
              : `${seasonName} - ${teamName} ${
                  teamMulti === "V&JV"
                    ? teamB
                      ? " - Junior Varsity"
                      : " - Varsity"
                    : teamMulti === "A&B"
                    ? teamB
                      ? " - B Team"
                      : " - A Team"
                    : ""
                } Schedule`}
          </h2>

          <Link to={`/roster/${seasonid}/${teamid}?teamB=${teamB}`}>
            <Button variant="info title-button wsd">View Roster</Button>
          </Link>
        </div>
        <div className="import-export-container">
          {isArchived ? null : (
            <>
              <Button
                variant="primary wsd csv import-export"
                onClick={() => {
                  if (document.getElementById("react-csv-reader-input"))
                    document.getElementById("react-csv-reader-input").click();
                }}
              >
                Import CSV
              </Button>

              <CSVReader
                onFileLoaded={handleFileLoaded}
                inputStyle={{ display: "none" }}
                parserOptions={{
                  header: true,
                  dynamicTyping: true,
                  skipEmptyLines: true,
                }}
              />
            </>
          )}
          <CSVLink
            data={csvData}
            filename={"schedule.csv"}
            target="_blank"
            omit={["id"]}
          >
            <Button variant="danger wsd csv"> Export to CSV </Button>
          </CSVLink>
        </div>
        <Form onSubmit={handleAddGame}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Home/Away</th>
                <th>Time</th>
                <th>Score</th>
                {isArchived ? null : <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isArchived ? null : (
                <tr>
                  <td>
                    <Form.Control
                      type="date"
                      name="date"
                      placeholder="Date"
                      required
                    />
                  </td>
                  <td>
                    <Form.Select
                      name="opponent"
                      onChange={(event) => handleChange(event)}
                      required
                    >
                      <option value="" disabled>
                        Select an opponent
                      </option>
                      {opponents.map((opponent) => (
                        <option key={opponent.id} value={opponent.name}>
                          {opponent.name}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      type="text"
                      as="select"
                      name="location"
                      placeholder="Home/Away"
                      required
                    >
                      <option value="" disabled>
                        Home/Away
                      </option>
                      <option value="Home">Home</option>
                      <option value="Away">Away</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="time"
                      name="time"
                      placeholder="Time"
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="score"
                      placeholder="Score"
                    />
                  </td>
                  <td>
                    <Button variant="success oneline" type="submit">
                      Add Game
                    </Button>
                  </td>
                </tr>
              )}
              {schedule.map((game, index) => (
                <tr key={game.id}>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="date"
                        name="date"
                        value={game.date}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      formatDate(game.date)
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Select
                        name="opponent"
                        onChange={(event) => handleChange(event, index)}
                        required
                      >
                        <option value="" disabled>
                          Select an opponent
                        </option>
                        {opponents.map((opponent) => (
                          <option key={opponent.id} value={opponent.name}>
                            {opponent.name}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <a
                        href={`https://www.google.com/maps/place/${
                          opponents.find((o) => o.name === game.opponent)
                            ?.address
                        }`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {game.opponent}
                      </a>
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Select
                        type="text"
                        as="select"
                        name="location"
                        placeholder="Home/Away"
                        required
                      >
                        <option value="" disabled>
                          Home/Away
                        </option>
                        <option value="Home">Home</option>
                        <option value="Away">Away</option>
                      </Form.Select>
                    ) : (
                      game.location
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="time"
                        name="time"
                        value={game.time}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      formatTime(game.time)
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="score"
                        value={game.score}
                        onChange={(event) => handleChange(event, index)}
                      />
                    ) : (
                      game.score
                    )}
                  </td>
                  {isArchived ? null : (
                    <td>
                      {editIndex === index ? (
                        <div className="action-buttons">
                          <Button
                            variant="primary wsd"
                            onClick={() => handleSave(game, index)}
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
                            onClick={() => handleDelete(game.id, index)}
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

export default Schedule;
