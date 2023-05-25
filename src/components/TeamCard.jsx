/* eslint-disable jsx-a11y/img-redundant-alt */
import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeamModal from "./TeamModal";
import MultiModal from "./MultiModal";
import SetCoachesModal from "./SetCoachesModal";
import { db, auth } from "./Firebase";

const TeamCard = ({ team, seasonid, archived }) => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMultiModal, setShowMultiModal] = useState(false);
  const [showSetCoachesModal, setShowSetCoachesModal] = useState(false);
  const [season, setSeason] = useState(seasonid.season);
  const [teams, setTeams] = useState([]);
  const [hasRoster, setHasRoster] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [rosterButtonClicked, setRosterButtonClicked] = useState(false);
  const [user, setUser] = useState(null);

  // I... don't know where this variable is used, but if I remove it above, it breaks everything. :D
  if (!season) {
    /* nope */
  }

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

  useEffect(() => {
    const teamsRef = db.ref(`seasons/${seasonid}/teams`);

    const teamsListener = teamsRef.on("value", (snapshot) => {
      const teamsData = snapshot.val();
      if (teamsData) {
        const teamsList = Object.keys(teamsData).map((key) => ({
          id: key,
          ...teamsData[key],
        }));
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

    const rosterRef = db.ref(`seasons/${seasonid}/teams/${team.id}`);

    rosterRef.child("roster").on("value", (snapshot) => {
      const hasRoster = snapshot.exists();
      setHasRoster(hasRoster);
    });

    rosterRef.child("roster-b").on("value", (snapshot) => {
      const hasRosterB = snapshot.exists();
      setHasRoster((prevHasRoster) => prevHasRoster || hasRosterB);
    });

    const scheduleRef = db.ref(`seasons/${seasonid}/teams/${team.id}`);

    scheduleRef.child("schedule").on("value", (snapshot) => {
      const hasSchedule = snapshot.exists();
      setHasSchedule(hasSchedule);
    });

    scheduleRef.child("schedule-b").on("value", (snapshot) => {
      const hasScheduleB = snapshot.exists();
      setHasSchedule((prevHasSchedule) => prevHasSchedule || hasScheduleB);
    });

    return () => {
      teamsRef.off("value", teamsListener);
      seasonRef.off();
      rosterRef.off();
      scheduleRef.off();
    };
  }, [seasonid, team.id]);

  function handleTeamSave(teamInfo, index) {
    if (
      typeof teamInfo.name === "undefined" ||
      typeof teamInfo.sport === "undefined" ||
      typeof teamInfo.abbr === "undefined" ||
      typeof teamInfo.multi === "undefined" ||
      typeof teamInfo.identicalRosters === "undefined" ||
      typeof teamInfo.identicalSchedules === "undefined" ||
      typeof teamInfo.identicalCoaches === "undefined" ||
      typeof teamInfo.teamPageA === "undefined" ||
      typeof teamInfo.teamPicA === "undefined" ||
      typeof teamInfo.teamPageB === "undefined" ||
      typeof teamInfo.teamPicB === "undefined" ||
      typeof teamInfo.coachesA === "undefined" ||
      typeof teamInfo.coachesB === "undefined"
    ) {
      // Set default values for the missing keys
      teamInfo.name = teamInfo.name || "";
      teamInfo.sport = teamInfo.sport || "";
      teamInfo.abbr = teamInfo.abbr || "";
      teamInfo.multi = teamInfo.multi || "";
      teamInfo.identicalRosters = teamInfo.identicalRosters ?? true;
      teamInfo.identicalSchedules = teamInfo.identicalSchedules ?? true;
      teamInfo.identicalCoaches = teamInfo.identicalCoaches ?? true;
      teamInfo.teamPageA = teamInfo.teamPageA || "";
      teamInfo.teamPicA = teamInfo.teamPicA || "";
      teamInfo.teamPageB = teamInfo.teamPageB || "";
      teamInfo.teamPicB = teamInfo.teamPicB || "";
      teamInfo.coachesA = teamInfo.coachesA || "";
      teamInfo.coachesB = teamInfo.coachesB || "";
    }

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
        teamRef
          .remove()
          .then(() => {
            console.log(
              "Team information deleted successfully from Firebase database."
            );
            // Update the teams state by filtering out the deleted team
            const updatedTeams = teams.filter((team, i) => i !== index);
            setTeams(updatedTeams);
          })
          .catch((error) => {
            console.log("Error deleting team information:", error);
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
        teamRef
          .update(updatedTeamInfo)
          .then(() => {
            console.log(
              "Team information updated successfully in Firebase database."
            );
            // Update the teams state with the updated team information
            const updatedTeams = [...teams];
            updatedTeams[index] = {
              ...teams[index],
              ...updatedTeamInfo,
            };
            setTeams(updatedTeams);
          })
          .catch((error) => {
            console.log("Error updating team information:", error);
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
      <div className="team-card-main">
        {team.multi === "A&B" || team.multi === "V&JV" ? (
          <Row>
            <Col xs={3}></Col>
            <Col xs={4}>{team.multi === "A&B" ? "A" : "Varsity"}</Col>
            <Col xs={4}>{team.multi === "A&B" ? "B" : "JV"}</Col>
          </Row>
        ) : (
          <Row>
            <Col xs={3}></Col>
            <Col xs={7}>{/* Empty content */}&nbsp;</Col>
          </Row>
        )}

        <Row>
          {/* Display team pages */}
          <Col xs={3}>
            <p>Page(s):</p>
          </Col>
          {(team.teamPageA !== undefined && team.teamPageA.trim() !== "") ||
          (team.teamPageB !== undefined && team.teamPageB.trim() !== "") ? (
            <React.Fragment>
              <Col xs={team.multi === "Single" || team.multi === "" ? 7 : 4}>
                {team.teamPageA !== undefined &&
                  team.teamPageA.trim() !== "" && (
                    <div className="team-info team-page">
                      <p>
                        <a
                          className="team-links"
                          rel="noreferrer"
                          target="_blank"
                          href={
                            "https://www.wsdvt.org/" +
                            (team.teamPageA && team.teamPageA.charAt(0) === "/"
                              ? team.teamPageA.substring(1)
                              : team.teamPageA || "")
                          }
                        >
                          Team Page
                        </a>
                      </p>
                    </div>
                  )}
                {team.teamPageA === "" && (
                  <div className="team-info team-page">
                    <p>
                      <em>none</em>
                    </p>
                  </div>
                )}
              </Col>
              {team.multi !== "Single" && team.multi !== "" && (
                <Col xs={4}>
                  {team.teamPageB !== undefined &&
                    team.teamPageB.trim() !== "" && (
                      <div className="team-info team-page">
                        <p>
                          <a
                            className="team-links"
                            rel="noreferrer"
                            target="_blank"
                            href={
                              "https://www.wsdvt.org/" +
                              (team.teamPageB &&
                              team.teamPageB.charAt(0) === "/"
                                ? team.teamPageB.substring(1)
                                : team.teamPageB || "")
                            }
                          >
                            Team Page
                          </a>
                        </p>
                      </div>
                    )}
                  {team.teamPageB === "" && (
                    <div className="team-info team-page">
                      <p>
                        <em>none</em>
                      </p>
                    </div>
                  )}
                </Col>
              )}
            </React.Fragment>
          ) : null}
        </Row>

        <Row>
          {/* Display team pictures */}
          <Col xs={3}>
            <p>Picture(s):</p>
          </Col>
          {(team.teamPicA !== undefined && team.teamPicA.trim() !== "") ||
          (team.teamPicB !== undefined && team.teamPicB.trim() !== "") ? (
            <React.Fragment>
              <Col xs={team.multi === "Single" || team.multi === "" ? 7 : 4}>
                {team.teamPicA !== undefined && team.teamPicA.trim() !== "" && (
                  <div className="team-info team-pic">
                    <p>
                      <a
                        className="team-links"
                        rel="noreferrer"
                        target="_blank"
                        href={
                          "https://www.wsdvt.org/" +
                          (team.teamPicA.charAt(0) === "/"
                            ? team.teamPicA.substring(1)
                            : team.teamPicA)
                        }
                      >
                        <img
                          className="teamPic"
                          src={
                            "https://www.wsdvt.org/" +
                            (team.teamPicA.charAt(0) === "/"
                              ? team.teamPicA.substring(1)
                              : team.teamPicA)
                          }
                          alt="Team Photo"
                        />
                      </a>
                    </p>
                  </div>
                )}
                {team.teamPicA === "" && (
                  <div className="team-info team-pic">
                    <p>
                      <em>none</em>
                    </p>
                  </div>
                )}
              </Col>
              {team.multi !== "Single" && team.multi !== "" && (
                <Col xs={4}>
                  {team.teamPicB !== undefined &&
                    team.teamPicB.trim() !== "" && (
                      <div className="team-info team-pic">
                        <p>
                          <a
                            className="team-links"
                            rel="noreferrer"
                            target="_blank"
                            href={
                              "https://www.wsdvt.org/" +
                              (team.teamPicB.charAt(0) === "/"
                                ? team.teamPicB.substring(1)
                                : team.teamPicB)
                            }
                          >
                            <img
                              className="teamPic"
                              alt="Team Photo"
                              src={
                                "https://www.wsdvt.org/" +
                                (team.teamPicB.charAt(0) === "/"
                                  ? team.teamPicB.substring(1)
                                  : team.teamPicB)
                              }
                            />
                          </a>
                        </p>
                      </div>
                    )}
                  {team.teamPicB === "" && (
                    <div className="team-info team-pic">
                      <p>
                        <em>none</em>
                      </p>
                    </div>
                  )}
                </Col>
              )}
            </React.Fragment>
          ) : null}
        </Row>

        <Row>
          <React.Fragment>
            <Col xs={3}>
              <div className="coaches">
                <p>Coaches:</p>
              </div>
            </Col>
            {team.identicalCoaches === true ? (
              <Col xs={7}>
                <div className="team-info coaches">
                  <p
                    key={`${team.id}-coaches`}
                    className={
                      team.multi !== "Single" && team.multi !== "" ? "big" : ""
                    }
                  >
                    <Button
                      className="btn-info wsd"
                      onClick={() =>
                        setShowSetCoachesModal({ twoTeams: "A", show: true })
                      }
                    >
                      Coaches
                    </Button>
                  </p>
                </div>
              </Col>
            ) : (
              <Col xs={4}>
                <div className="team-info coaches">
                  <p key={`${team.id}-coaches`} className="">
                    <Button
                      className="btn-info wsd"
                      onClick={() =>
                        setShowSetCoachesModal({ twoTeams: "A", show: true })
                      }
                    >
                      Coaches
                    </Button>
                  </p>
                </div>
              </Col>
            )}

            {team.identicalCoaches === false && (
              <Col xs={4}>
                <div className="team-info coaches">
                  <p key={`${team.id}-coaches`}>
                    <Button
                      className="btn-info wsd"
                      onClick={() =>
                        setShowSetCoachesModal({ twoTeams: "B", show: true })
                      }
                    >
                      Coaches
                    </Button>
                  </p>
                </div>
              </Col>
            )}
          </React.Fragment>
        </Row>
      </div>
      <hr className="yellow"></hr>
      <div className="team-buttons">
        {archived || !user ? (
          <>
            {team.identicalRosters === false ? (
              <Button
                variant="outline-warning wsd"
                onClick={() => {
                  setShowMultiModal(true);
                  setRosterButtonClicked(true);
                }}
              >
                View Rosters
              </Button>
            ) : (
              <Link to={`/roster/${seasonid}/${team.id}`}>
                <Button variant="outline-warning wsd">View Roster</Button>
              </Link>
            )}

            {team.identicalSchedules === false ? (
              <Button
                variant="outline-warning wsd"
                onClick={() => {
                  setShowMultiModal(true);
                  setRosterButtonClicked(false);
                }}
              >
                View Schedules
              </Button>
            ) : (
              <Link to={`/schedule/${seasonid}/${team.id}`}>
                <Button variant="outline-warning wsd">View Schedule</Button>
              </Link>
            )}

            <Button
              variant="outline-warning wsd"
              onClick={() => setShowTeamModal(true)}
            >
              View Team
            </Button>
          </>
        ) : (
          <>
            <>
              {hasRoster ? (
                <>
                  {team.identicalRosters === false ? (
                    <Button
                      variant="outline-warning wsd"
                      onClick={() => {
                        setShowMultiModal(true);
                        setRosterButtonClicked(true);
                      }}
                    >
                      Edit Rosters
                    </Button>
                  ) : (
                    <Link to={`/roster/${seasonid}/${team.id}`}>
                      <Button variant="outline-warning wsd">Edit Roster</Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {team.identicalRosters === false ? (
                    <Button
                      variant="success wsd"
                      onClick={() => {
                        setShowMultiModal(true);
                        setRosterButtonClicked(true);
                      }}
                    >
                      Add Rosters
                    </Button>
                  ) : (
                    <Link to={`/roster/${seasonid}/${team.id}`}>
                      <Button variant="success wsd">Add Roster</Button>
                    </Link>
                  )}
                </>
              )}

              {hasSchedule ? (
                <>
                  {team.identicalSchedules === false ? (
                    <Button
                      variant="outline-warning wsd"
                      onClick={() => {
                        setShowMultiModal(true);
                        setRosterButtonClicked(false);
                      }}
                    >
                      Edit Schedules
                    </Button>
                  ) : (
                    <Link to={`/schedule/${seasonid}/${team.id}`}>
                      <Button variant="outline-warning wsd">
                        Edit Schedule
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {team.identicalSchedules === false ? (
                    <Button
                      variant="success wsd"
                      onClick={() => {
                        setShowMultiModal(true);
                        setRosterButtonClicked(false);
                      }}
                    >
                      Add Schedules
                    </Button>
                  ) : (
                    <Link to={`/schedule/${seasonid}/${team.id}`}>
                      <Button variant="success wsd">Add Schedule</Button>
                    </Link>
                  )}
                </>
              )}
            </>
            <Button
              variant="outline-warning wsd"
              onClick={() => setShowTeamModal(true)}
            >
              Edit Team
            </Button>
          </>
        )}
      </div>
      <MultiModal
        seasonid={seasonid}
        teamid={team.id}
        rosterButtonClicked={rosterButtonClicked}
        team={team}
        showMultiModal={showMultiModal}
        handleCloseMultiModal={() => setShowMultiModal(false)}
      />

      <SetCoachesModal
        seasonid={seasonid}
        teamid={team.id}
        team={team}
        archived={archived}
        showSetCoachesModal={showSetCoachesModal}
        handleCloseCoachesModal={() => setShowSetCoachesModal(false)}
      />

      <TeamModal
        team={team}
        editing={!archived}
        archived={archived}
        user={user}
        showTeamModal={showTeamModal}
        showSetCoachesModal={showSetCoachesModal}
        handleTeamSave={handleTeamSave}
        handleCloseTeamModal={() => setShowTeamModal(false)}
        setShowSetCoachesModal={setShowSetCoachesModal}
      />
    </div>
  );
};

export default TeamCard;