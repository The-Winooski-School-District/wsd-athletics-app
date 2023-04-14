import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { db } from "./Firebase";

const AddTeam = ({ seasonID }) => {
  console.log(seasonID, db);
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState(null);

  useEffect(() => {
    const teamsRef = db.ref("teams");
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
        setTeams([...teams, teamName]); // add the new team to the state
      }
    });
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Team
      </Button>
      {teams.map((team) => (
        <p key={team}>{team}</p>
      ))}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              const teamName = event.target.elements.teamName.value;
              handleAddTeam(teamName);
            }}
          >
            <Form.Group controlId="teamName">
              <Form.Label>Team Name</Form.Label>
              <Form.Control type="text" placeholder="Enter team name" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              const teamName = document.getElementById("teamName").value;
              handleAddTeam(teamName);
            }}
          >
            Add
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddTeam;
