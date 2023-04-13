import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const AddTeam = ( seasonID ) => {
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState([]);

  const handleAddTeam = (teamName) => {
    setTeams([...teams, teamName]);
    setShowModal(false);
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
          <Form onSubmit={(event) => {
            event.preventDefault();
            const teamName = event.target.elements.teamName.value;
            handleAddTeam(teamName);
          }}>
            <Form.Group controlId="teamName">
              <Form.Label>Team Name</Form.Label>
              <Form.Control type="text" placeholder="Enter team name" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            const teamName = document.getElementById("teamName").value;
            handleAddTeam(teamName);
          }}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddTeam;
