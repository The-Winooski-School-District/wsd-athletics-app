import "../styles/Teams.css";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TeamModal from "./TeamModal";
import { db } from "./Firebase";

const TeamCard = ({ team, seasonID }) => {
  const [showModal, setShowModal] = useState(false);
  const [season, setSeason] = useState(seasonID.season);
  const [teams, setTeams] = useState([]);

  // I... don't know where this variable is used, but if I remove it above, it breaks everything. :D
  if (!season) {
    /* do nothing */
  }
  
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

  function handleTeamSave(teamInfo, index) {
    console.log(teamInfo, index);
    const teamID = team.id;
    if (!teamID) {
      console.log(`No team found at index ${index}.`);
      return;
    }

    if (teamInfo.delete) {
      // Remove the team from the database
      db.ref(`seasons/${seasonID}/teams/${teamID}`).remove((error) => {
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
      db.ref(`seasons/${seasonID}/teams/${teamID}`).set(
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
    <div className='team-card'>
      <div className='team-info'>
        <p key={`${team.id}-name`}>Name: {team.name}</p>
        <p key={`${team.id}-sport`}>Sport: {team.sport}</p>
        <p key={`${team.id}-abbr`}>ABBR: {team.abbr}</p>
        <p key={`${team.id}-multi`}>Teams: {team.multi}</p>
        <p key={`${team.id}-teamPage`}>Webpage: {team.teamPage}</p>
        <p key={`${team.id}-teamPic`}>Picture: {team.teamPic}</p>
        <p key={`${team.id}-coaches`}>coaches: {team.coaches}</p>
      </div>
      <div className='team-buttons'>
        <Button variant='success wsd'>Add Roster</Button>
        <Button variant='success wsd'>Add Schedule</Button>
        <Button
          variant='outline-warning wsd'
          onClick={() => setShowModal(true)}>
          Edit Team
        </Button>
      </div>
      <TeamModal
        team={team}
        editing={true}
        showModal={showModal}
        handleTeamSave={handleTeamSave}
        handleCloseModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default TeamCard;
