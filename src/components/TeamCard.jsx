import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import TeamModal from "./TeamModal";
import { db } from "./Firebase";

const TeamCard = ({ team, seasonid, archived }) => {
  const [showModal, setShowModal] = useState(false);
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

    const scheduleRef = db.ref(`seasons/${seasonid}/teams/${team.id}/schedule/`);
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
    console.log(teamInfo, index);
    const teamid = team.id;
    if (!teamid) {
      console.log(`No team found at index ${index}.`);
      return;
    }

    if (teamInfo.delete) {
      // Remove the team from the database
      db.ref(`seasons/${seasonid}/teams/${teamid}`).remove((error) => {
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
      // Update the team in the database
      const { id: _, ...updatedTeamInfo } = teamInfo;

      // Update the team in the database
      db.ref(`seasons/${seasonid}/teams/${teamid}`).set(
        updatedTeamInfo,
        (error) => {
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
        }
      );
    }
  }

  return (
    <div className="team-card">
      <div className="team-title-area">
        <h4>Team!</h4>
      </div>
      <hr className="yellow"></hr>
      <Row>
        <Col xs={3}>
          <p>Name:</p>
        </Col>
        <Col>
          <div className="team-info">
            <p key={`${team.id}-name`}>{team.name}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <p>Sport:</p>
        </Col>
        <Col>
          <div className="team-info">
            <p key={`${team.id}-sport`}>{team.sport}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <p>ABBR:</p>
        </Col>
        <Col>
          <div className="team-info">
            <p key={`${team.id}-abbr`}>{team.abbr}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <p>Teams:</p>
        </Col>
        <Col>
          <div className="team-info">
            <p key={`${team.id}-multi`}>{team.multi}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <p>Webpage:</p>
        </Col>
        <Col>
          <div className="team-info">
            <p key={`${team.id}-teamPage`}>{team.teamPage}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <p>Picture:</p>
        </Col>
        <Col>
          <div className="team-info">
            <p key={`${team.id}-teamPic`}>{team.teamPic}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <p>Coaches:</p>
        </Col>
        <Col>
          <div className="team-info">
            <p key={`${team.id}-coaches`}>{team.coaches}</p>
          </div>
        </Col>
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
              onClick={() => setShowModal(true)}
            >
              View Team
            </Button>
          </>
        ) : (
          // THIS!! This is how we make the individual team pages. Take note for schedule's sake.
          <>
            <Link to={`/roster/${seasonid}/${team.id}`}>
              {hasRoster ? (
                <Button variant="outline-warning wsd">Edit Roster</Button>
              ) : (
                <Button variant="success wsd">Add Roster</Button>
              )}
            </Link>

            <Link to={`/schedule/${seasonid}/${team.id}`}>
              {hasSchedule ? (
                <Button variant="outline-warning wsd">Edit Schedule</Button>
              ) : (
                <Button variant="success wsd">Add Schedule</Button>
              )}
            </Link>

            <Button
              variant="outline-warning wsd"
              onClick={() => setShowModal(true)}
            >
              Edit Team
            </Button>
          </>
        )}
      </div>
      <TeamModal
        team={team}
        editing={!archived}
        archived={archived}
        showModal={showModal}
        handleTeamSave={handleTeamSave}
        handleCloseModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default TeamCard;
