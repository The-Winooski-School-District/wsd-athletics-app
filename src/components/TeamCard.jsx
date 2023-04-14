import "../styles/Teams.css";
import React from "react";
import { Button } from "react-bootstrap";

const TeamCard = ({ team }, handleTeamSave) => {
  return (
    <div className="team-card">
      <p key={team.id}>{team.name}</p>
      <div className="team-buttons">
        <Button variant="primary">Add Roster</Button>
        <Button variant="primary">Add Schedule</Button>
        <Button variant="primary">Edit Team</Button>
      </div>
    </div>
  );
};

export default TeamCard;
