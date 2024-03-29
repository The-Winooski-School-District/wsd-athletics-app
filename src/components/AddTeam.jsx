import "../styles/App.css";
import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { db, auth } from "./Firebase";
import TeamCard from "./TeamCard";
import TeamModal from "./TeamModal";

const AddTeam = ({ seasonid }) => {
  const [showSetCoachesModal, setShowSetCoachesModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState(null);
  const [user, setUser] = useState(null);

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

  /* get teams for season from db */
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

    return () => {
      teamsRef.off();
      seasonRef.off();
    };
  }, [seasonid]);

  /* Add Team to season */
  const handleAddTeam = (
    teamName,
    sport,
    abbr,
    multi,
    identicalRosters,
    identicalSchedules,
    identicalCoaches,
    teamPageA,
    teamPicA,
    teamPageB,
    teamPicB,
    coachesA,
    coachesB
  ) => {
    const teamid = db.ref().child(`seasons/${seasonid}/teams`).push().key;
    const updatedSeason = {
      ...season,
      teams: {
        ...season.teams,
        [teamid]: {
          name: teamName,
          sport: sport,
          abbr: abbr,
          multi: multi,
          identicalRosters: identicalRosters,
          identicalSchedules: identicalSchedules,
          identicalCoaches: identicalCoaches,
          teamPageA: teamPageA,
          teamPicA: teamPicA,
          teamPageB: teamPageB,
          teamPicB: teamPicB,
          coachesA: coachesA,
          coachesB: coachesB,
        },
      },
    };
    db.ref(`seasons/${seasonid}`).set(updatedSeason, (error) => {
      if (error) {
        console.log("Error updating season information:", error);
      } else {
        console.log(
          "Season information updated successfully in Firebase database."
        );
        setShowTeamModal(false);
        const newTeam = {
          id: teamid,
          name: teamName,
          sport: sport,
          abbr: abbr,
          multi: multi,
          identicalRosters: identicalRosters,
          identicalSchedules: identicalSchedules,
          identicalCoaches: identicalCoaches,
          teamPageA: teamPageA,
          teamPicA: teamPicA,
          teamPageB: teamPageB,
          teamPicB: teamPicB,
          coachesA: coachesA,
          coachesB: coachesB,
        }; // create a new team object
        setTeams([...teams, newTeam]); // add the new team to the state
      }
    });
  };

  return (
    <div>
      {user ? (
        <div className="add-team-btn">
          <Button variant="primary wsd" onClick={() => setShowTeamModal(true)}>
            Add Team
          </Button>
        </div>
      ) : null}
      <div className="teams-area">
        {teams.map((team, index) => (
          <TeamCard
            key={team.id}
            team={team}
            index={index}
            seasonid={seasonid}
            teams={teams}
          />
        ))}
        <TeamModal
          showTeamModal={showTeamModal}
          showSetCoachesModal={showSetCoachesModal}
          handleCloseTeamModal={() => setShowTeamModal(false)}
          setShowSetCoachesModal={setShowSetCoachesModal}
          editing={false}
          handleAddTeam={handleAddTeam}
          user={user}
        />
      </div>
    </div>
  );
};

export default AddTeam;
