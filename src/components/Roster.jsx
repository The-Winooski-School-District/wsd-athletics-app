import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db } from "./Firebase";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";

const Roster = () => {
  const [roster, setRoster] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const { teamid, seasonid } = useParams();
  const [value, setValue] = useState("");
  const [teamName, setTeamName] = useState("");
  const [seasonName, setSeasonName] = useState("");
  const [loadedData, setLoadedData] = useState([]);

  const csvData = roster.map(({ number, fName, lName, grade, position }) => ({
    number,
    fName,
    lName,
    grade,
    position,
  }));

  function handleChange(event, index) {
    const { name, value } = event.target;
    const updatedRoster = [...roster];
    const updatedPlayerInfo = { ...updatedRoster[index], [name]: value };
    updatedRoster[index] = updatedPlayerInfo;
    setRoster(updatedRoster);

    let newValue = event.target.value;
    // Check if the new value is less than 0
    if (newValue < 0) {
      // Update the value to "00"
      newValue = "00";
    }

    setValue(newValue);
  }

  const isTrueUrl = window.location.href.endsWith("true");

  // Set teamB based on the URL
  const teamB = isTrueUrl ? true : false;

  // Set the roster path based on teamB
  const rosterPath = teamB
    ? `${seasonid}/teams/${teamid}/roster-b`
    : `${seasonid}/teams/${teamid}/roster`;

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

          db.ref(`seasons/` + rosterPath).on("value", (snapshot) => {
            const rosterData = snapshot.val();
            if (rosterData) {
              const rosterList = Object.keys(rosterData).map((key) => {
                return { id: key, ...rosterData[key] };
              });
              setRoster(rosterList);
            } else {
              setRoster([]);
            }
          });

          db.ref(`seasons/${seasonid}/teams/${teamid}`)
            .once("value")
            .then((snapshot) => {
              const teamData = snapshot.val();
              if (teamData) {
                const teamName = teamData.name;
                // Set the team's name in state
                setTeamName(teamName);
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

          db.ref(`archived-seasons/` + rosterPath).on("value", (snapshot) => {
            const rosterData = snapshot.val();
            if (rosterData) {
              const rosterList = Object.keys(rosterData).map((key) => {
                return { id: key, ...rosterData[key] };
              });
              setRoster(rosterList);
            } else {
              setRoster([]);
            }
          });

          db.ref(`archived-seasons/${seasonid}/teams/${teamid}`)
            .once("value")
            .then((snapshot) => {
              const teamData = snapshot.val();
              if (teamData) {
                const teamName = teamData.name;
                // Set the team's name in state
                setTeamName(teamName);
              }
            });
        }
      });
  }, [seasonid, teamid, rosterPath]);

  function handleAddplayer(event) {
    event.preventDefault();
    const number = event.target.elements.number.value;
    const fName = event.target.elements.fName.value;
    const lName = event.target.elements.lName.value;
    const grade = event.target.elements.grade.value;
    const position = event.target.elements.position.value;
    const newplayer = { number, fName, lName, grade, position };
    db.ref(`seasons/` + rosterPath).push(newplayer);
    event.target.reset();
    setValue(""); // reset the player.number field to its default value
  }

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleSave(playerInfo, index) {
    const id = playerInfo.id;
    const updatedPlayerInfo = { ...roster[index], ...playerInfo, id: id };
    db.ref(`seasons/` + rosterPath + `/${id}`).set(
      updatedPlayerInfo,
      (error) => {
        if (error) {
          console.log("Error updating player information:", error);
        } else {
          console.log(
            "player information updated successfully in Firebase database."
          );
          const updatedRoster = [...roster];
          updatedRoster[index] = updatedPlayerInfo;
          setRoster(updatedRoster);
          setEditIndex(null);
        }
      }
    );
  }

  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this player?")) {
      const updatedRoster = [...roster];
      updatedRoster.splice(index, 1);
      db.ref(`seasons/${seasonid}/teams/${teamid}/roster/${id}`).remove();
      setRoster(updatedRoster);
      setEditIndex(null);
    }
  }

  function handleCancel() {
    setEditIndex(null);
  }

  const handleFileLoaded = (data, fileInfo) => {
    const newRoster = data.map((row) => ({
      number: row.number,
      fName: row.fName,
      lName: row.lName,
      grade: row.grade,
      position: row.position,
    }));
    const uniqueNewRoster = newRoster.filter((newPlayer) => {
      let found = false;
      for (let i = 0; i < loadedData.length; i++) {
        const loadedPlayer = loadedData[i];
        if (
          loadedPlayer &&
          newPlayer.number === loadedPlayer.number &&
          newPlayer.fName === loadedPlayer.fName &&
          newPlayer.lName === loadedPlayer.lName &&
          newPlayer.grade === loadedPlayer.grade &&
          newPlayer.position === loadedPlayer.position
        ) {
          found = true;
          break;
        }
      }
      return !found;
    });
    if (uniqueNewRoster.length === 0) {
      alert("The file you uploaded contains only duplicates.");
    } else {
      const rosterRef = db.ref(`seasons/` + rosterPath);
      uniqueNewRoster.forEach((newPlayer) => {
        rosterRef.push(newPlayer);
      });
      setRoster([...roster, ...uniqueNewRoster]);
      setLoadedData([...loadedData, ...uniqueNewRoster]);
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
          <h2>{seasonName + " - " + teamName} Roster</h2>
          <Link to={`/schedule/${seasonid}/${teamid}`}>
            <Button variant="info title-button wsd">View Schedule</Button>
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
            filename={"roster.csv"}
            target="_blank"
            omit={["id"]}
          >
            <Button variant="danger wsd csv import-export"> Export CSV </Button>
          </CSVLink>
        </div>
        <Form onSubmit={handleAddplayer}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Grade</th>
                <th>Position</th>
                {isArchived ? null : <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isArchived ? null : (
                <tr>
                  <td>
                    <Form.Control
                      type="number"
                      name="number"
                      min="-1"
                      max="99"
                      value={value}
                      placeholder="Player Number"
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="fName"
                      placeholder="First Name"
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="lName"
                      placeholder="Last Name"
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="grade"
                      min="6"
                      max="12"
                      placeholder="Grade"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="position"
                      placeholder="Position(s)"
                    />
                  </td>
                  <td>
                    <Button variant="success oneline" type="submit">
                      Add Player
                    </Button>
                  </td>
                </tr>
              )}
              {roster.map((player, index) => (
                <tr key={player.id}>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="number"
                        name="number"
                        min="-1"
                        max="99"
                        placeholder="Player Number"
                        value={player.number}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      player.number
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="fName"
                        value={player.fName}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      player.fName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="lName"
                        value={player.lName}
                        onChange={(event) => handleChange(event, index)}
                        required
                      />
                    ) : (
                      player.lName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="number"
                        name="grade"
                        value={player.grade}
                        min="6"
                        max="12"
                        placeholder="Grade"
                        required
                      />
                    ) : (
                      player.grade
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="text"
                        name="position"
                        value={player.position}
                        onChange={(event) => handleChange(event, index)}
                      />
                    ) : (
                      player.position
                    )}
                  </td>
                  {isArchived ? null : (
                    <td>
                      {editIndex === index ? (
                        <div className="action-buttons">
                          <Button
                            variant="primary wsd"
                            onClick={() => handleSave(player, index)}
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
                            onClick={() => handleDelete(player.id, index)}
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
export default Roster;
