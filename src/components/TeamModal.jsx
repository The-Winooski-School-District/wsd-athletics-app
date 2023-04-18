import React, { useRef, useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddTeamModal = ({
  team,
  showModal,
  handleAddTeam,
  handleTeamSave,
  handleCloseModal,
  editing,
}) => {
  const [teamName, setTeamName] = useState(editing ? team.name : "");
  const [sport, setSport] = useState(editing ? team.sport : "");
  const [abbr, setAbbr] = useState(editing ? team.abbr : "");
  const [multi, setMulti] = useState(editing ? team.multi : "");
  const [teamPage, setTeamPage] = useState(editing ? team.teamPage : "");
  const [teamPic, setTeamPic] = useState(editing ? team.teamPic : "");
  const [coaches, setCoaches] = useState(editing ? team.coaches : "");
  const [deleteChecked, setDeleteChecked] = useState(false);

  useEffect(() => {
    if (team && team.name) {
      setTeamName(team.name);
    }
    if (team && team.delete) {
      setDeleteChecked(true);
    }
  }, [team]);

  const teamNameRef = useRef(null);
  const sportRef = useRef(null);
  const abbrRef = useRef(null);
  const multiRef = useRef(null);
  const teamPageRef = useRef(null);
  const teamPicRef = useRef(null);
  const coachesRef = useRef(null);

  function handleModalClose() {
    setTeamName("");
    setSport("");
    setAbbr("");
    setMulti("");
    setTeamPage("");
    setTeamPic("");
    setCoaches("");
    handleCloseModal();
  }

  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editing ? "Edit Team" : "Add Team"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            const teamName = teamNameRef.current.value;
            const deleteValue = deleteChecked ? true : false; // Get the value of the "Delete" checkbox
            if (editing) {
              handleTeamSave({
                id: team.id,
                name: teamName,
                delete: deleteValue,
              }); // Pass the value of the "Delete" checkbox
            } else {
              handleAddTeam(teamName);
            }
            handleModalClose();
          }}>
          <Form.Group controlId='teamName'>
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter team name'
              value={teamName}
              ref={teamNameRef}
              onChange={(event) => setTeamName(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='sport'>
            <Form.Label>Sport</Form.Label>
            <Form.Control
              type='text'
              placeholder='Sport'
              value={sport}
              ref={sportRef}
              onChange={(event) => setSport(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='teamAbbr'>
            <Form.Label>ABBR</Form.Label>
            <Form.Control
              type='text'
              placeholder='ABBR'
              value={abbr}
              ref={abbrRef}
              onChange={(event) => setAbbr(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='multipleTeams'>
            <Form.Label>Multiple Teams?</Form.Label>
            <Form.Control
              type='text'
              placeholder='Multiple Teams?'
              value={multi}
              ref={multiRef}
              onChange={(event) => setMulti(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='teamPage'>
            <Form.Label>Team Page URL</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter team page URL'
              value={teamPage}
              ref={teamPageRef}
              onChange={(event) => setTeamPage(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='teamPic'>
            <Form.Label>Picture URL</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter team name'
              value={teamPic}
              ref={teamPicRef}
              onChange={(event) => setTeamPic(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='teamCoaches'>
            <Form.Label>Coaches</Form.Label>
            <Form.Control
              type='textarea'
              placeholder='Enter team name'
              value={coaches}
              ref={coachesRef}
              onChange={(event) => setCoaches(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='delete'>
            {editing && (
              <Form.Check
                type='checkbox'
                label='Delete'
                checked={deleteChecked}
                onChange={(event) => setDeleteChecked(event.target.checked)}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={deleteChecked ? "danger" : "primary"}
          onClick={() => {
            const teamName = teamNameRef.current.value;
            const deleteValue = deleteChecked ? true : false; // Get the value of the "Delete" checkbox
            if (editing) {
              handleTeamSave({
                id: team.id,
                name: teamName,
                sport: sport,
                abbr: abbr,
                multi: multi,
                teamPage: teamPage,
                teamPic: teamPic,
                coaches: coaches,
                delete: deleteValue,
              }); // Pass the value of the "Delete" checkbox
            } else {
              handleAddTeam(
                teamName,
                sport,
                abbr,
                multi,
                teamPage,
                teamPic,
                coaches
              );
            }
            handleModalClose();
          }}>
          {editing ? (deleteChecked ? "Delete" : "Save") : "Add"}
        </Button>
        <Button variant='secondary' onClick={handleModalClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTeamModal;
