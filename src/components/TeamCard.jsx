import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeamModal from "./TeamModal";
import MultiModal from "./MultiModal";
import { db } from "./Firebase";

const TeamCard = ({ team, seasonid, archived }) => {
  const [showTeamModal, setshowTeamModal] = useState(false);
  const [showMultiModal, setshowMultiModal] = useState(false);
  const [season, setSeason] = useState(seasonid.season);
  const [teams, setTeams] = useState([]);
  const [hasRoster, setHasRoster] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);

  // I... don't know where this variable is used, but if I remove it above, it breaks everything. :D
  if (!season) {
    /* do nothing */
  }

  useEffect(() => {
    const teamsRef = db.ref(`seasons/${seasonid}/teams`);
    teamsRef.on("value", (snapshot) => {
      const teamsData = snapshot.val();
      if (teamsData) {
        const teamsList = Object.keys(teamsData).map((key) => {
          return { id: key, ...teamsData[key] };
        });
        setTeams(teamsList);
      } else {
        setTeams([]);
      }
    });

    const seasonRef = db.ref(`seasons/${seasonid}`);
    seasonRef.on("value", (snapshot) => {
      const seasonData = snapshot.val();
      if (seasonData) {
        setSeason(seasonData);
      } else {
        setSeason(null);
      }
    });

    const rosterRef = db.ref(`seasons/${seasonid}/teams/${team.id}/roster/`);
    rosterRef.once("value", (snapshot) => {
      const hasRoster = snapshot.exists();
      setHasRoster(hasRoster);
    });

    const scheduleRef = db.ref(
      `seasons/${seasonid}/teams/${team.id}/schedule/`
    );
    scheduleRef.once("value", (snapshot) => {
      const hasSchedule = snapshot.exists();
      setHasSchedule(hasSchedule);
    });

    return () => {
      teamsRef.off();
      seasonRef.off();
      rosterRef.off();
      scheduleRef.off();
    };
  }, [seasonid, team.id]);

  function handleTeamSave(teamInfo, index) {
    const teamid = team.id;
    if (!teamid) {
      console.log(`No team found at index ${index}.`);
      return;
    }

    const teamRef = db.ref(`seasons/${seasonid}/teams/${teamid}`);
    teamRef.once("value", (snapshot) => {
      const existingTeam = snapshot.val();

      const updatedTeamInfo = { ...existingTeam, ...teamInfo };
      delete updatedTeamInfo.id; // Remove the ID property

      // Check if the team already has a single team page, picture, or coach
      if (existingTeam.teamPage) {
        updatedTeamInfo.teamPageA = existingTeam.teamPage;
        teamRef.child("teamPage").remove();
        if (!existingTeam.teamPageB) {
          updatedTeamInfo.teamPageB = "";
        }
      }
      if (existingTeam.teamPic) {
        updatedTeamInfo.teamPicA = existingTeam.teamPic;
        teamRef.child("teamPic").remove();
        if (!existingTeam.teamPicB) {
          updatedTeamInfo.teamPicB = "";
        }
      }
      if (existingTeam.coaches) {
        updatedTeamInfo.coachesA = existingTeam.coaches;
        teamRef.child("coaches").remove();
        if (!existingTeam.coachesB) {
          updatedTeamInfo.coachesB = "";
        }
      }

      // Remove original fields after setting new ones
      delete updatedTeamInfo.teamPage;
      delete updatedTeamInfo.teamPic;
      delete updatedTeamInfo.coaches;

      if (teamInfo.delete) {
        // Remove the team from the database
        teamRef.remove((error) => {
          if (error) {
            console.log("Error deleting team information:", error);
          } else {
            console.log(
              "Team information deleted successfully from Firebase database."
            );
            const updatedTeams = [...teams];
            updatedTeams.splice(index, 1); // Remove the team from the array
            setTeams(updatedTeams);
          }
        });
      } else {
        // Set identical fields to true if multi is "Single Team" or ""
        if (
          updatedTeamInfo.multi === "Single" ||
          updatedTeamInfo.multi === ""
        ) {
          updatedTeamInfo.identicalRosters = true;
          updatedTeamInfo.identicalSchedules = true;
          updatedTeamInfo.identicalCoaches = true;
        }

        // Update the team in the database
        delete updatedTeamInfo.delete; // Remove the delete property
        teamRef.update(updatedTeamInfo, (error) => {
          if (error) {
            console.log("Error updating team information:", error);
          } else {
            console.log(
              "Team information updated successfully in Firebase database."
            );
            const updatedTeams = [...teams];
            updatedTeams[index] = {
              ...teams[index],
              ...updatedTeamInfo,
            };
            setTeams(updatedTeams);
          }
        });
      }
    });
  }

  function getTeamGender(abbr) {
    switch (abbr) {
      case "VFOO":
      case "VBSO":
      case "MSBS":
      case "VJBB":
      case "MSBB":
      case "VRBA":
      case "MSBA":
      case "JVBA":
      case "JVBS":
        return "boys-team";
      case "VGSO":
      case "FVCH":
      case "MSGS":
      case "VJGB":
      case "MSGB":
      case "VRSO":
      case "MSSO":
      case "JVSO":
      case "JVGS":
      case "WVCH":
        return "girls-team";
      default:
        return "other-team";
    }
  }

  return (
    <div className="team-card">
      <div className={`team-title-area ${getTeamGender(team.abbr)}`}>
        <h4>{team.name}</h4>
      </div>
      <hr className="yellow"></hr>
      {team.multi === "A&B" || team.multi === "V&JV" ? (
        <Row>
          <Col xs={3}></Col>
          <Col xs={4}>{team.multi === "A&B" ? "A" : "Varsity"}</Col>
          <Col xs={4}>{team.multi === "A&B" ? "B" : "JV"}</Col>
        </Row>
      ) : null}

      <Row>
        {/* Display team pages */}
        {(team.teamPage &&
          team.teamPage.trim() !== "" &&
          team.teamPage.trim() !== "NULL") ||
        (team.teamPageA &&
          team.teamPageA.trim() !== "" &&
          team.teamPageA.trim() !== "NULL") ||
        (team.teamPageB &&
          team.teamPageB.trim() !== "" &&
          team.teamPageB.trim() !== "NULL") ? (
          <React.Fragment>
            <Col xs={3}>
              <p>Page(s):</p>
            </Col>
            {[team.teamPage, team.teamPageA, team.teamPageB]
              .filter(
                (page) => page && page.trim() !== "" && page.trim() !== "NULL"
              )
              .flatMap((page) => page.split("|"))
              .map((page, index) => (
                <Col key={`${team.id}-teamPage-${index}`} xs={4}>
                  <div className="team-info team-page">
                    <p>
                      <a
                        className="team-links"
                        rel="noreferrer"
                        target="_blank"
                        href={
                          "https://www.wsdvt.org/" +
                          (page.charAt(0) === "/" ? page.substring(1) : page)
                        }
                      >
                        Team Page
                      </a>
                    </p>
                  </div>
                </Col>
              ))}
          </React.Fragment>
        ) : null}
      </Row>

      <Row>
        {/* Display team pictures */}
        {(team.teamPic &&
          team.teamPic.trim() !== "" &&
          team.teamPic.trim() !== "NULL") ||
        (team.teamPicA &&
          team.teamPicA.trim() !== "" &&
          team.teamPicA.trim() !== "NULL") ||
        (team.teamPicB &&
          team.teamPicB.trim() !== "" &&
          team.teamPicB.trim() !== "NULL") ? (
          <React.Fragment>
            <Col xs={3}>
              <p>Picture(s):</p>
            </Col>
            {[team.teamPic, team.teamPicA, team.teamPicB]
              .filter(
                (pic) => pic && pic.trim() !== "" && pic.trim() !== "NULL"
              )
              .flatMap((pic) => pic.split("|"))
              .map((pic, index) => (
                <Col key={`${team.id}-teamPic-${index}`} xs={4}>
                  <div className="team-info team-pic">
                    <p>
                      <a
                        className="team-links"
                        rel="noreferrer"
                        target="_blank"
                        href={
                          "https://www.wsdvt.org/" +
                          (pic.charAt(0) === "/" ? pic.substring(1) : pic)
                        }
                      >
                        <img
                          className="teamPic"
                          alt="bad URL"
                          src={
                            "https://www.wsdvt.org/" +
                            (pic.charAt(0) === "/" ? pic.substring(1) : pic)
                          }
                        />
                      </a>
                    </p>
                  </div>
                </Col>
              ))}
          </React.Fragment>
        ) : null}
      </Row>

      {/* Gonna have to do to coaches what we did to pages and pics to show more than 1 if there's more than 1*/}
      <Row>
        <React.Fragment>
          <Col xs={3}>
            <div className="coaches">
              <p>Coaches:</p>
            </div>
          </Col>
          <Col xs={4}>
            <div className="team-info coaches">
              <p key={`${team.id}-coaches`}>
                {/*team.coaches*/}
                <Button className="btn-info wsd">Coaches</Button>
              </p>
            </div>
          </Col>
          {team.identicalCoaches === false && (
            <Col xs={4}>
              <div className="team-info coaches">
                <p key={`${team.id}-coaches`}>
                  {/*team.coaches*/}
                  <Button className="btn-info wsd">Coaches</Button>
                </p>
              </div>
            </Col>
          )}
        </React.Fragment>
      </Row>

      <hr className="yellow"></hr>
      <div className="team-buttons">
        {archived ? (
          <>
            <Link to={`/roster/${seasonid}/${team.id}`}>
              <Button variant="outline-warning wsd">View Roster</Button>
            </Link>
            <Link to={`/schedule/${seasonid}/${team.id}`}>
              <Button variant="outline-warning wsd">View Schedule</Button>
            </Link>
            <Button
              variant="outline-warning wsd"
              onClick={() => setshowTeamModal(true)}
            >
              View Team
            </Button>
          </>
        ) : (
          <>
            <>
              <Link to={`/roster/${seasonid}/${team.id}`}>
                {hasRoster ? (
                  <>
                    {team.identicalRosters === false ? (
                      <Button variant="outline-warning wsd">
                        Edit Rosters
                      </Button>
                    ) : (
                      <Button variant="outline-warning wsd">Edit Roster</Button>
                    )}
                  </>
                ) : (
                  <>
                    {team.identicalRosters === false ? (
                      <Button variant="success wsd">Add Rosters</Button>
                    ) : (
                      <Button variant="success wsd">Add Roster</Button>
                    )}
                  </>
                )}
              </Link>
              <Link to={`/schedule/${seasonid}/${team.id}`}>
                {hasSchedule ? (
                  <>
                    {team.identicalSchedules === false ? (
                      <Button variant="outline-warning wsd">
                        Edit Schedules
                      </Button>
                    ) : (
                      <Button variant="outline-warning wsd">
                        Edit Schedule
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {team.identicalSchedules === false ? (
                      <Button variant="success wsd">Add Schedules</Button>
                    ) : (
                      <Button variant="success wsd">Add Schedule</Button>
                    )}
                  </>
                )}
              </Link>
            </>
            <Button
              variant="outline-warning wsd"
              onClick={() => setshowTeamModal(true)}
            >
              Edit Team
            </Button>
            <Button
              variant="danger wsd"
              onClick={() => setshowMultiModal(true)}
            >
              TEST
            </Button>
          </>
        )}
      </div>
      <MultiModal
        team={team}
        showMultiModal={showMultiModal}
        handleCloseMultiModal={() => setshowMultiModal(false)}
      />

      <TeamModal
        team={team}
        editing={!archived}
        archived={archived}
        showTeamModal={showTeamModal}
        handleTeamSave={handleTeamSave}
        handleCloseTeamModal={() => setshowTeamModal(false)}
      />
    </div>
  );
};

export default TeamCard;
