import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { db } from "./Firebase";
import TeamCard from './TeamCard';
import TeamModal from './TeamModal';

const AddTeam = ({ seasonID }) => {
  console.log(seasonID, db);
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

  function handleTeamSave(teamInfo, index) {
    const teamID = teams[index].id;
    const updatedTeamInfo = {
      ...teams[index],
      ...teamInfo,
      id: teamID,
    };

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
          updatedTeams[index] = updatedTeamInfo;
          setTeams(updatedTeams);
        }
      }
    );
  }

  const handleAddTeam = (teamName) => {
    const teamID = db.ref().child(`seasons/${seasonID}/teams`).push().key;
    const updatedSeason = {
      ...season,
      teams: {
        ...season.teams,
        [teamID]: {
          name: teamName,
          // add any additional team data here
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
          name: teamName 
        }; // create a new team object
        setTeams([...teams, newTeam]); // add the new team to the state
      }
    });
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Team
      </Button>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} handleTeamSave={handleTeamSave}/>
      ))}
      <TeamModal 
        showModal={showModal} 
        handleAddTeam={handleAddTeam} 
        handleCloseModal={() => 
          setShowModal(false)
          } 
        />
    </div>
  );
};

export default AddTeam;
