import "../styles/Teams.css";
import React from "react";
import { Button } from "react-bootstrap";

const TeamCard = ({ team }, handleTeamSave) => {
  return (
    <div className="team-card">
      <div className="team-info">
        <p key={team.id}>{team.name}</p>
      </div>
      <div className="team-buttons">
        <Button variant="success">Add Roster</Button>
        <Button variant="success">Add Schedule</Button>
        <Button variant="outline-warning">Edit Team</Button>
      </div>
    </div>
  );
};

export default TeamCard;
