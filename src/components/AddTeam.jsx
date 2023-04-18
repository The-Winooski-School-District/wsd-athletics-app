import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { db } from "./Firebase";
import TeamCard from "./TeamCard";
import TeamModal from "./TeamModal";

const AddTeam = ({ seasonID }) => {
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState(null);

  useEffect(() => {
    const teamsRef = db.ref(`seasons/${seasonID}/teams`);
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

    const seasonRef = db.ref(`seasons/${seasonID}`);
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
  }, [seasonID]);

  const handleAddTeam = (
    teamName,
    sport,
    abbr,
    multi,
    teamPage,
    teamPic,
    coaches
  ) => {
    const teamID = db.ref().child(`seasons/${seasonID}/teams`).push().key;
    const updatedSeason = {
      ...season,
      teams: {
        ...season.teams,
        [teamID]: {
          name: teamName,
          sport: sport,
          abbr: abbr,
          multi: multi,
          teamPage: teamPage,
          teamPic: teamPic,
          coaches: coaches,
        },
      },
    };
    db.ref(`seasons/${seasonID}`).set(updatedSeason, (error) => {
      if (error) {
        console.log("Error updating season information:", error);
      } else {
        console.log(
          "Season information updated successfully in Firebase database."
        );
        setShowModal(false);
        const newTeam = {
          id: teamID,
          name: teamName,
          sport: sport,
          abbr: abbr,
          multi: multi,
          teamPage: teamPage,
          teamPic: teamPic,
          coaches: coaches,
        }; // create a new team object
        setTeams([...teams, newTeam]); // add the new team to the state
      }
    });
  };

  return (
    <div>
      <div className='add-team-btn'>
        <Button variant='primary wsd' onClick={() => setShowModal(true)}>
          Add Team
        </Button>
      </div>
      <div className='teams-area'>
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} seasonID={seasonID} />
        ))}
        <TeamModal
          editing={false}
          showModal={showModal}
          handleAddTeam={handleAddTeam}
          handleCloseModal={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default AddTeam;
