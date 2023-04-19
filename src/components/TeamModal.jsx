import React, { useRef, useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const TeamModal = ({
  team,
  showModal,
  handleAddTeam,
  handleTeamSave,
  handleCloseModal,
  editing,
  isArchived,
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
    if (team) {
      setTeamName(team.name);
      setSport(team.sport);
      setAbbr(team.abbr);
      setMulti(team.multi);
      setTeamPage(team.teamPage);
      setTeamPic(team.teamPic);
      setCoaches(team.coaches);
      setDeleteChecked(!!team.delete);
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
          }}
        >
          <Form.Group controlId="teamName">
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter team name"
              value={teamName}
              ref={teamNameRef}
              onChange={(event) => setTeamName(event.target.value)}
              disabled={isArchived}
            />
          </Form.Group>


          <Form.Group controlId="sport">
            <Form.Label>Sport</Form.Label>
            <Form.Select
              as="select"
              placeholder="Sport"
              value={sport}
              ref={sportRef}
              onChange={(event) => setSport(event.target.value)}
              disabled={isArchived}
            >
            <option value="" disabled selected>Select Sport</option>
            <option value="Baseball">Baseball</option>
            <option value="Softball">Softball</option>
            <option value="Basketball">Basketball</option>
            <option value="Football">Football</option>
            <option value="Soccer">Soccer</option>
            <option value="Track & Field">Track & Field</option>
            <option value="Football">Cheerleading</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="teamAbbr">
            <Form.Label>ABBR</Form.Label>
            <Form.Control
              type="text"
              placeholder="ABBR"
              value={abbr}
              ref={abbrRef}
              onChange={(event) => setAbbr(event.target.value)}
              disabled={isArchived}
            />
          </Form.Group>

          <Form.Group controlId="multipleTeams">
            <Form.Label>Multiple Teams?</Form.Label>
            <Form.Select
              type="text"
              placeholder="Multiple Teams?"
              value={multi}
              ref={multiRef}
              onChange={(event) => setMulti(event.target.value)}
              disabled={isArchived}
              >
                <option value="" disabled selected>Multiple Teams?</option>
              <option value="Single">Single Team</option>
              <option value="V&JV">Varsity & JV</option>
              <option value="A&B">A & B Teams</option>
              </Form.Select>
          </Form.Group>

          <Form.Group controlId="teamPage">
            <Form.Label>Team Page URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://your-website.com"
              value={teamPage}
              ref={teamPageRef}
              onChange={(event) => setTeamPage(event.target.value)}
              disabled={isArchived}
            />
          </Form.Group>

          <Form.Group controlId="teamPic">
            <Form.Label>Picture URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://your-website.com"
              value={teamPic}
              ref={teamPicRef}
              onChange={(event) => setTeamPic(event.target.value)}
              disabled={isArchived}
            />
          </Form.Group>

          <Form.Group controlId="teamCoaches">
            <Form.Label>Coaches</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter Coaches names"
              value={coaches}
              ref={coachesRef}
              onChange={(event) => setCoaches(event.target.value)}
              disabled={isArchived}
            />
          </Form.Group>

          <Form.Group controlId="delete">
            {editing && (
              <Form.Check
                type="checkbox"
                label="Delete"
                checked={deleteChecked}
                onChange={(event) => setDeleteChecked(event.target.checked)}
                disabled={isArchived}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {isArchived ? (
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
        ) : (
          <>
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
              }}
            >
              {editing ? (deleteChecked ? "Delete" : "Save") : "Add"}
            </Button>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default TeamModal;
