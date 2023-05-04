import React, { useRef, useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const TeamModal = ({
  team,
  showModal,
  handleAddTeam,
  handleTeamSave,
  handleCloseModal,
  editing,
  archived,
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
      if (team.roster !== undefined) {
        console.log("1 " + team.roster["fName"]);
      }
      setTeamName(team.name);
      setSport(team.sport);
      setAbbr(team.abbr);
      setMulti(team.multi);
      setTeamPage(team.teamPage);
      setTeamPic(team.teamPic);
      setCoaches(team.coaches);
      setDeleteChecked(!!team.delete);
    }
    if (!showModal) {
      setTeamName(editing ? team.name : "");
      setSport(editing ? team.sport : "");
      setAbbr(editing ? team.abbr : "");
      setMulti(editing ? team.multi : "");
      setTeamPage(editing ? team.teamPage : "");
      setTeamPic(editing ? team.teamPic : "");
      setCoaches(editing ? team.coaches : "");
      setDeleteChecked(false);
      console.log("2 " + {team});
    }
  }, [team, editing, showModal]);

  const teamNameRef = useRef(null);
  const sportRef = useRef(null);
  const abbrRef = useRef(null);
  const multiRef = useRef(null);
  const teamPageRef = useRef(null);
  const teamPicRef = useRef(null);
  const coachesRef = useRef(null);

  function handleModalClose(team, editing) {
    
    if (team && editing) {
      console.log("3 " + {team});
      setTeamName(team.name);
      setSport(team.sport);
      setAbbr(team.abbr);
      setMulti(team.multi);
      setTeamPage(team.teamPage);
      setTeamPic(team.teamPic);
      setCoaches(team.coaches);
      handleCloseModal();
    } else {
      setTeamName("");
      setSport("");
      setAbbr("");
      setMulti("");
      setTeamPage("");
      setTeamPic("");
      setCoaches("");
      handleCloseModal();
      console.log("4 " + {team});
    }
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
          <Form.Group controlid="teamName">
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter team name"
              value={teamName}
              ref={teamNameRef}
              onChange={(event) => setTeamName(event.target.value)}
              disabled={archived}
              autoFocus
            />
          </Form.Group>

          <Form.Group controlid="sport">
            <Form.Label>Sport</Form.Label>
            <Form.Select
              type="text"
              placeholder="Select Sport"
              as="select"
              value={sport}
              ref={sportRef}
              onChange={(event) => setSport(event.target.value)}
              disabled={archived}
            >
              <option value="" disabled>
                Select Sport
              </option>
              <option value="Baseball">Baseball</option>
              <option value="Softball">Softball</option>
              <option value="Basketball">Basketball</option>
              <option value="Football">Football</option>
              <option value="Soccer">Soccer</option>
              <option value="Track & Field">Track & Field</option>
              <option value="Cheerleading">Cheerleading</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlid="teamAbbr">
            <Form.Label>ABBR</Form.Label>
            <Form.Control
              type="text"
              placeholder="ABBR"
              value={abbr}
              ref={abbrRef}
              onChange={(event) => setAbbr(event.target.value)}
              disabled={archived}
            />
          </Form.Group>

          <Form.Group controlid="multipleTeams">
            <Form.Label>Multiple Teams?</Form.Label>
            <Form.Select
              type="text"
              placeholder="Multiple Teams?"
              value={multi}
              ref={multiRef}
              onChange={(event) => setMulti(event.target.value)}
              disabled={archived}
            >
              <option value="" disabled>
                Multiple Teams?
              </option>
              <option value="Single">Single Team</option>
              <option value="V&JV">Varsity & JV</option>
              <option value="A&B">A & B Teams</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlid="teamPage">
            <Form.Label>Team Page URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://your-website.com"
              value={teamPage}
              ref={teamPageRef}
              onChange={(event) => setTeamPage(event.target.value)}
              disabled={archived}
            />
          </Form.Group>

          <Form.Group controlid="teamPic">
            <Form.Label>Picture URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://your-website.com"
              value={teamPic}
              ref={teamPicRef}
              onChange={(event) => setTeamPic(event.target.value)}
              disabled={archived}
            />
          </Form.Group>

          <Form.Group controlid="teamCoaches">
            <Form.Label>Coaches</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter Coaches names"
              value={coaches}
              ref={coachesRef}
              onChange={(event) => setCoaches(event.target.value)}
              disabled={archived}
            />
          </Form.Group>

          <Form.Group controlid="delete">
            {editing && (
              <Form.Check
                type="checkbox"
                label="Delete"
                checked={deleteChecked}
                onChange={(event) => setDeleteChecked(event.target.checked)}
                disabled={archived}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {archived ? (
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