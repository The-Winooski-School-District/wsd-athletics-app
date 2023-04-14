import React from "react";

const TeamCard = ( {team}, handleTeamSave ) => {
  return (
    <div className="teamCard">
      <p key={team.id}>{team.name}</p>
    </div>
  );
};

export default TeamCard;
