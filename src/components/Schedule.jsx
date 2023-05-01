import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db } from "./Firebase";

const Schedule = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const [opponents, setOpponents] = useState([]);
  const { teamid, seasonid } = useParams();
  const [teamName, setTeamName] = useState("");

  function handleGoBack() {
    navigate(-1);
  }

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedSchedule = [...schedule];
    const updatedOpponentInfo = { ...updatedSchedule[index], [name]: value };
    updatedSchedule[index] = updatedOpponentInfo;
    setSchedule(updatedSchedule);
  }

  useEffect(() => {
    db.ref(`seasons/${seasonid}`)
      .once("value")
      .then((snapshot) => {
        const exists = snapshot.exists();
        if (exists) {
          db.ref(`seasons/${seasonid}/teams/${teamid}/schedule`).on(
            "value",
            (snapshot) => {
              const scheduleData = snapshot.val();
              if (scheduleData) {
                const scheduleList = Object.keys(scheduleData).map((key) => {
                  return { id: key, ...scheduleData[key] };
                });
                setSchedule(scheduleList);
              } else {
                setSchedule([]);
              }
            }
          );
        } else {
          setIsArchived(true);
          db.ref(`archived-seasons/${seasonid}/teams/${teamid}/schedule`).on(
            "value",
            (snapshot) => {
              const scheduleData = snapshot.val();
              if (scheduleData) {
                const rosterList = Object.keys(scheduleData).map((key) => {
                  return { id: key, ...scheduleData[key] };
                });
                setSchedule(rosterList);
              } else {
                setSchedule([]);
              }
            }
          );
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
    
    db.ref(`seasons/${seasonid}/teams/${teamid}/name`).once("value").then((snapshot) => {
      const teamName = snapshot.val();
      setTeamName(teamName);
    });
  }, [seasonid, teamid]);

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleSave(gameInfo, index) {
    const id = gameInfo.id;
    const updatedGameInfo = { ...schedule[index], ...gameInfo, id: id };
    db.ref(`seasons/${seasonid}/teams/${teamid}/roster/${id}`).set(
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
    db.ref(`seasons/${seasonid}/teams/${teamid}/schedule`).push(newGame);
    event.target.reset();
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${minutes} ${period}`;
  }

  function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${month} - ${day} - ${year}`;
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
        <Link to="/opponents" className="yellow">
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
        <div className="opponents-title">
          <h2>{teamName}</h2>
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
                      game.opponent
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
