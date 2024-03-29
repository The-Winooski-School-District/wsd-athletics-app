import "../styles/App.css";
import "../styles/Opponents.css";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";
import { db, auth } from "./Firebase";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";

const Roster = () => {
  const [roster, setRoster] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const { teamid, seasonid } = useParams();
  const [value, setValue] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamMulti, setTeamMulti] = useState("");
  const [teamRostersIdentical, setTeamRostersIdentical] = useState("");
  const [teamSchedulesIdentical, setTeamSchedulesIdentical] = useState("");
  const [seasonName, setSeasonName] = useState("");
  const [loadedData, setLoadedData] = useState([]);
  const [user, setUser] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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

  const isTrueUrl = window.location.href.endsWith("true");

  // Set teamB based on the URL
  const teamB = isTrueUrl ? true : false;

  // Set the roster path based on teamB
  const rosterPath = teamB
    ? `${seasonid}/teams/${teamid}/roster-b`
    : `${seasonid}/teams/${teamid}/roster`;

  /* get rosters from each team from each season */
  useEffect(() => {
    db.ref(`seasons/${seasonid}`)
      .once("value")
      .then((snapshot) => {
        const exists = snapshot.exists();

        /* for non-archived */
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

          /* for archived */
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
  }, [seasonid, teamid, rosterPath]);

  /* small screen condition */
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 920); // Adjust the width to your desired breakpoint
    };

    handleResize(); // Check the initial screen size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* adds player to roster */
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

  /* saves edits to player on roster */
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

  /* deletes player from roster */
  function handleDelete(id, index) {
    if (window.confirm("Are you sure you want to delete this player?")) {
      const updatedRoster = [...roster];
      updatedRoster.splice(index, 1);
      db.ref(`seasons/` + rosterPath + `/${id}`).remove();
      setRoster(updatedRoster);
      setEditIndex(null);
    }
  }

  function handleCancel() {
    setEditIndex(null);
  }

  /* reads csv to match db */
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
      <Link to="/athletics" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      <div className="navbuttons">
        <Link to="/athletics/seasons" className="yellow">
          <Button variant="outline-warning wsd">Seasons</Button>
        </Link>
        <Link to="/athletics/archive" className="yellow">
          <Button variant="outline-warning wsd">Archive</Button>
        </Link>
        <Link to="/athletics/opponents" className="yellow">
          <Button variant="outline-warning wsd">Opponents</Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div>
        <div className="opponents-title">
          {teamRostersIdentical ? null : (
            <Link to={`/athletics/roster/${seasonid}/${teamid}?teamB=${!teamB}`}>
              <Button variant="info title-button wsd">Switch Teams</Button>
            </Link>
          )}

          <h2>
            {teamRostersIdentical
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
                } Roster`}
          </h2>
          {teamSchedulesIdentical ? (
            <Link to={`/athletics/schedule/${seasonid}/${teamid}`}>
              <Button variant="info title-button wsd">View Schedule</Button>
            </Link>
          ) : (
            <Link to={`/athletics/schedule/${seasonid}/${teamid}?teamB=${teamB}`}>
              <Button variant="info title-button wsd">View Schedule</Button>
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
            filename={"roster.csv"}
            target="_blank"
            omit={["id"]}
          >
            <Button variant="danger wsd csv import-export"> Export CSV </Button>
          </CSVLink>
        </div>
        <Form onSubmit={handleAddplayer}>
          {isArchived || !user ? null : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{isSmallScreen ? "#" : "Number"}</th>
                  <th>{isSmallScreen ? "First" : "First Name"}</th>
                  <th>{isSmallScreen ? "Last" : "Last Name"}</th>
                  <th>Grade</th>
                  <th>{isSmallScreen ? "Pos" : "Position"}</th>
                  {isArchived ? null : <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
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
                      {isSmallScreen ? "Add" : "Add Player"}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
          {isArchived ? null : <br></br>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>{isSmallScreen ? "#" : "Number"}</th>
                <th>{isSmallScreen ? "First" : "First Name"}</th>
                <th>{isSmallScreen ? "Last" : "Last Name"}</th>
                <th>Grade</th>
                <th>{isSmallScreen ? "Pos" : "Position"}</th>
                {isArchived ? null : <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
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
                  {isArchived || !user ? null : (
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
                            {isSmallScreen ? "E" : "Edit"}
                          </Button>
                          <Button
                            variant="danger wsd"
                            onClick={() => handleDelete(player.id, index)}
                          >
                            {isSmallScreen ? "X" : "Delete"}
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
