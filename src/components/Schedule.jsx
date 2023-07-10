import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db, auth } from "./Firebase";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";
import { AddToCalendarButton } from "add-to-calendar-button-react";

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const [opponents, setOpponents] = useState([]);
  const { teamid, seasonid } = useParams();
  const [teamName, setTeamName] = useState("");
  const [teamMulti, setTeamMulti] = useState("");
  const [teamSchedulesIdentical, setTeamSchedulesIdentical] = useState("");
  const [teamRostersIdentical, setTeamRostersIdentical] = useState("");
  const [seasonName, setSeasonName] = useState("");
  const [loadedData, setLoadedData] = useState([]);
  const [user, setUser] = useState(null);

  const csvData = schedule.map(
    ({ date, opponent, location, time, notes, score_w, score_o }) => ({
      date,
      opponent,
      location,
      time,
      notes,
      score_w,
      score_o,
    })
  );

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedSchedule = [...schedule];
    const updatedOpponentInfo = { ...updatedSchedule[index], [name]: value };

    if (name === "date") {
      // Perform additional formatting for the date field
      const formattedDate = formatDate(value); // Call your formatDate function here or use any other formatting logic
      updatedOpponentInfo[name] = formattedDate;
    }

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

  /* auth */
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

  /* get schedules for each team from each season */
  useEffect(() => {
    db.ref(`seasons/${seasonid}`)
      .once("value")
      .then((snapshot) => {
        const exists = snapshot.exists();

        /* check seasons */
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
                const rostersIdentical = teamData.identicalRosters;
                // Set the team's name in state
                setTeamName(teamName);
                setTeamMulti(teamMulti);
                setTeamSchedulesIdentical(schedulesIdentical);
                setTeamRostersIdentical(rostersIdentical);
              }
            });
        /* check archive */
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
                const rostersIdentical = teamData.identicalRosters;
                // Set the team's name in state
                setTeamName(teamName);
                setTeamMulti(teamMulti);
                setTeamSchedulesIdentical(schedulesIdentical);
                setTeamRostersIdentical(rostersIdentical);
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

  /* save edit to game/schedule */
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

  /* delete game from schedule */
  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this game?")) {
      const updatedSchedule = [...schedule];
      updatedSchedule.splice(index, 1);
      db.ref(`seasons/` + schedulePath + `/${id}`).remove();
      setSchedule(updatedSchedule);
      setEditIndex(null);
    }
  }
  function handleCancel() {
    setEditIndex(null);
  }

  /* add game to schedule */
  function handleAddGame(event) {
    event.preventDefault();
    const date = event.target.elements.date.value;
    const opponent = event.target.elements.opponent.value;
    const location = event.target.elements.location.value;
    const time = event.target.elements.time.value;
    const notes = event.target.elements.notes.value;
    const score_w = "pending...";
    const score_o = "pending...";
    const newGame = { date, opponent, location, time, notes, score_w, score_o };
    db.ref(`seasons/` + schedulePath).push(newGame);
    event.target.reset();
  }

  /* formats the time entry */
  function formatTime(time) {
    const [hours, minutes] = time.split(":");
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${period}`;
  }

  /* formats the date entry */
  function formatDate(date) {
    let year, month, day;

    if (date.includes("-")) {
      [year, month, day] = date.split("-");
    } else if (date.includes("/")) {
      [month, day, year] = date.split("/");
    }

    return `${month} - ${day} - ${year}`;
  }

  /* parses csv for schedule */
  const handleFileLoaded = (data, fileInfo) => {
    const newSchedule = data.map((row) => ({
      date: row.date,
      opponent: row.opponent,
      location: row.location,
      time: row.time,
      notes: row.notes,
      score_w: row.score_w,
      score_o: row.score_o,
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
          newGame.notes === loadedGame.notes &&
          newGame.score_w === loadedGame.score_w &&
          newGame.score_o === loadedGame.score_o
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

  const dates = schedule.map((game) => {
    const location = game.location === "Home" ? "@Home" : `@${game.opponent}`;

    return {
      name: `${game.location} Game vs ${game.opponent}`,
      description: `${game.location} Game vs ${game.opponent}`,
      startDate: game.date,
      startTime: game.time,
      endTime: game.time,
      location: location,
    };
  });

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
          {teamRostersIdentical ? (
            <Link to={`/roster/${seasonid}/${teamid}`}>
              <Button variant="info title-button wsd">View Roster</Button>
            </Link>
          ) : (
            <Link to={`/roster/${seasonid}/${teamid}?teamB=${teamB}`}>
              <Button variant="info title-button wsd">View Roster</Button>
            </Link>
          )}
        </div>
        <div className="import-export-container">
          {isArchived ? null : (
            <>
              {user ? (
                <Button
                  variant="primary wsd csv import-export"
                  onClick={() => {
                    if (document.getElementById("react-csv-reader-input"))
                      document.getElementById("react-csv-reader-input").click();
                  }}
                >
                  Import CSV
                </Button>
              ) : null}
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
          {isArchived ? null : (
            <>
            {user ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Opponent</th>
                    <th>Home/Away</th>
                    <th>Time</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
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
                        name="notes"
                        placeholder="Notes"
                      />
                    </td>
                    <td>
                      <Button variant="success oneline" type="submit">
                        Add Game
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
              ) : (null)}
              <div className="calendar-scheduler">
                <AddToCalendarButton
                  name="Schedule"
                  label="Add Schedule To Calendar"
                  dates={JSON.stringify(dates)}
                  timeZone="America/New_York"
                  options={[
                    "Google",
                    "Apple",
                    "Microsoft365",
                    "Outlook.com",
                    "iCal",
                  ]}
                  trigger="click"
                  size="3"
                  styleLight="--btn-background: #198754; --btn-text: #fff; --font:inherit;"
                  styleDark="--btn-background: #198754; --btn-text: #fff; --font:inherit;"
                  hideCheckmark
                ></AddToCalendarButton>
              </div>
            </>
          )}
          {isArchived ? null : <br></br>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Home/Away</th>
                <th>Time</th>
                <th>Score</th>
                {isArchived ? null : (<th>Actions</th>)}
              </tr>
            </thead>
            <tbody>
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
                      <>
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
                        <Form.Control
                          type="text"
                          placeholder="Notes"
                          name="notes"
                          value={game.notes}
                          onChange={(event) => handleChange(event, index)}
                        />
                      </>
                    ) : (
                      <>
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
                        <figcaption>{game.notes}</figcaption>
                      </>
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Select
                        type="text"
                        as="select"
                        name="location"
                        placeholder="Home/Away"
                        onChange={(event) => handleChange(event, index)}
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
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Winooski"
                          name="score_w"
                          value={game.score_w}
                          onChange={(event) => handleChange(event, index)}
                        />
                        <Form.Control
                          type="text"
                          placeholder="Opponent"
                          name="score_o"
                          value={game.score_o}
                          onChange={(event) => handleChange(event, index)}
                        />
                      </>
                    ) : (
                      <>
                        <div className="score-header">
                          <figcaption>Winooski</figcaption>
                          <figcaption>{game.opponent}</figcaption>
                        </div>
                        <div className="scores">
                          <figcaption>{game.score_w}</figcaption>
                          <figcaption>{game.score_o}</figcaption>
                        </div>
                      </>
                    )}
                  </td>
                  {isArchived ? null : (
                    <td className="action-buttons-cell">
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
                          <AddToCalendarButton
                            name={`${game.location} Game vs ${game.opponent}`}
                            options={[
                              "Google",
                              "Apple",
                              "Microsoft365",
                              "Outlook.com",
                              "iCal",
                            ]}
                            location={
                              game.location === "Home"
                                ? "@Home"
                                : `@${game.opponent}`
                            }
                            startDate={game.date}
                            endDate={game.date}
                            startTime={game.time}
                            endTime={game.time}
                            timeZone="America/New_York"
                            trigger="click"
                            hideTextLabelButton
                            size="3"
                            styleLight="--btn-background: #198754; --btn-text: #fff; --font:inherit;"
                            styleDark="--btn-background: #198754; --btn-text: #fff; --font:inherit;"
                            hideCheckmark
                            hideTextLabelList
                          ></AddToCalendarButton>
                          {user ? (
                            <>
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
                            </>
                          ) : null}
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
