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
  const { teamid, seasonid } = useParams();

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
          <h2>Schedule</h2>
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
                    type="text"
                    name="date"
                    placeholder="Date"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="opponent"
                    placeholder="Opponent"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Home/Away"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="time"
                    placeholder="Time"
                    required
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="score"
                    placeholder="SCore"
                  />
                </td>
                <td>
                  <Button variant="success wsd2" type="submit">
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
                        type="text"
                        name="date"
                        value={game.date}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      game.date
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="opponent"
                        value={game.opponent}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      game.opponent
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="location"
                        value={game.location}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      game.location
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="time"
                        value={game.time}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      game.time
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
                      <>
                        <Button
                          variant="primary wsd"
                          onClick={() => handleSave(game, index)}
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
}

export default Schedule