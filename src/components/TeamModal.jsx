import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddTeamModal = ({ showModal, handleAddTeam, handleCloseModal }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
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

            <Form.Group controlId="sport">
              <Form.Label>Sport</Form.Label>
              <Form.Control type="text" placeholder="Sport" />
            </Form.Group>

            <Form.Group controlId="teamAbbr">
              <Form.Label>ABBR</Form.Label>
              <Form.Control type="text" placeholder="ABBR" />
            </Form.Group>

            <Form.Group controlId="multipleTeams">
              <Form.Label>Multiple Teams?</Form.Label>
              <Form.Control type="text" placeholder="Multiple Teams?" />
            </Form.Group>

            <Form.Group controlId="teamYear">
              <Form.Label>Year</Form.Label>
              <Form.Control type="text" placeholder="Change year?" />
            </Form.Group>

            <Form.Group controlId="teamSeason">
              <Form.Label>Season</Form.Label>
              <Form.Control type="text" placeholder="Change season?" />
            </Form.Group>

            <Form.Group controlId="teamPage">
              <Form.Label>Team Page URL</Form.Label>
              <Form.Control type="text" placeholder="Enter team page URL" />
            </Form.Group>

            <Form.Group controlId="teamPic">
              <Form.Label>Picture URL</Form.Label>
              <Form.Control type="text" placeholder="Enter team name" />
            </Form.Group>

            <Form.Group controlId="teamCoaches">
              <Form.Label>Coaches</Form.Label>
              <Form.Control type="textarea" placeholder="Enter team name" />
            </Form.Group>

            <Form.Group controlId="delete">
              <Form.Label>Delete</Form.Label>
              <Form.Control type="checkbox" placeholder="Delete" />
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
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTeamModal;