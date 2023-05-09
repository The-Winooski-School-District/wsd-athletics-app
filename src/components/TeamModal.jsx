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
  const [teamPageA, setTeamPageA] = useState(editing ? team.teamPageA : "");
  const [teamPicA, setTeamPicA] = useState(editing ? team.teamPicA : "");
  const [teamPageB, setTeamPageB] = useState(editing ? team.teamPageB : "");
  const [teamPicB, setTeamPicB] = useState(editing ? team.teamPicB : "");
  const [coachesA, setCoachesA] = useState(editing ? team.coachesA : "");
  const [coachesB, setCoachesB] = useState(editing ? team.coachesB : "");
  const [deleteChecked, setDeleteChecked] = useState(false);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setSport(team.sport);
      setAbbr(team.abbr);
      setMulti(team.multi);
      setTeamPageA(team.teamPageA);
      setTeamPicA(team.teamPicA);
      setTeamPageB(team.teamPageB);
      setTeamPicB(team.teamPicB);
      setCoachesA(team.coachesA);
      setCoachesB(team.coachesB);
      setDeleteChecked(!!team.delete);
    }
    if (!showModal) {
      setTeamName(editing ? team.name : "");
      setSport(editing ? team.sport : "");
      setAbbr(editing ? team.abbr : "");
      setMulti(editing ? team.multi : "");
      setTeamPageA(editing ? team.teamPageA : "");
      setTeamPicA(editing ? team.teamPicA : "");
      setTeamPageB(editing ? team.teamPageB : "");
      setTeamPicB(editing ? team.teamPicB : "");
      setCoachesA(editing ? team.coachesA : "");
      setCoachesB(editing ? team.coachesB : "");
      setDeleteChecked(false);
    }
  }, [team, editing, showModal]);

  const teamNameRef = useRef(null);
  const sportRef = useRef(null);
  const abbrRef = useRef(null);
  const multiRef = useRef(null);
  const teamPageARef = useRef(null);
  const teamPicARef = useRef(null);
  const teamPageBRef = useRef(null);
  const teamPicBRef = useRef(null);
  const coachesARef = useRef(null);
  const coachesBRef = useRef(null);

  function handleModalClose(team, editing) {
    if (team && editing) {
      setTeamName(team.name);
      setSport(team.sport);
      setAbbr(team.abbr);
      setMulti(team.multi);
      setTeamPageA(team.teamPageA);
      setTeamPicA(team.teamPicA);
      setTeamPageB(team.teamPageB);
      setTeamPicB(team.teamPicB);
      setCoachesA(team.coachesA);
      setCoachesB(team.coachesB);
      handleCloseModal();
    } else {
      setTeamName("");
      setSport("");
      setAbbr("");
      setMulti("");
      setTeamPageA("");
      setTeamPicA("");
      setTeamPageB("");
      setTeamPicB("");
      setCoachesA("");
      setCoachesB("");
      handleCloseModal();
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
            <Form.Label></Form.Label>
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
            <Form.Label></Form.Label>
            <Form.Select
              type="text"
              placeholder="ABBR"
              value={abbr}
              ref={abbrRef}
              onChange={(event) => setAbbr(event.target.value)}
              disabled={archived}
            >
              <option value="" disabled>
                ABBR
              </option>
              <option value="VFOO">VFOO - Varsity Football</option>
              <option value="VGSO">VGSO - Varsity Girls Soccer</option>
              <option value="VBSO">VBSO - Varsity Boys Soccer</option>
              <option value="MSGS">MSGS - Middleschool Girls Soccer</option>
              <option value="MSBS">MSBS - Middleschool Boys Soccer</option>
              <option value="FVCH">FVCH - Fall Varsity Cheerleading</option>
              <option value="VJGB">
                VJGB - Varsity And Junior Varsity Girls Basketball
              </option>
              <option value="VJBB">
                VJBB - Varsity And Junior Varsity Boys Basketball
              </option>
              <option value="MSGB">MSGB - Middleschool Girls Basketball</option>
              <option value="MSBB">MSBB - Middleschool Boys Basketball</option>
              <option value="VTRF">VTRF - Varsity Track & Field</option>
              <option value="VRSO">VRSO - Varsity Softball</option>
              <option value="VRBA">VRBA - Varsity Baseball</option>
              <option value="JVSO">VRSO - Junior Varsity Softball</option>
              <option value="JVBA">VRBA - JuniorVarsity Baseball</option>
              <option value="MSTF">MSTF - Middleschool Track & Field</option>
              <option value="MSSO">MSSO - Middleschool Softball</option>
              <option value="MSBA">MSBA - Middleschool Baseball</option>
              <option value="JVGS">JVGS - Junior Varsity Girls Soccer</option>
              <option value="JVBS">JVBS - Junior Varsity Boys Soccer</option>
              <option value="WVCH">WVCH - Winter Varsity Cheerleading</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlid="multipleTeams">
            <Form.Label></Form.Label>
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

          {multi === "A&B" ? (
            <>
            <div className="multi-split">
              <Form.Group controlid="teamPageA">
                <Form.Label>Pages</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Team A Page URL"
                  value={teamPageA}
                  ref={teamPageARef}
                  onChange={(event) => setTeamPageA(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>

              <Form.Group controlid="teamPicA">
                <Form.Label>Pictures</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Team A Picture URL"
                  value={teamPicA}
                  ref={teamPicARef}
                  onChange={(event) => setTeamPicA(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>
              </div>
              <div className="multi-split">
              <Form.Group controlid="teamPageB">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Team B Page URL"
                  value={teamPageB}
                  ref={teamPageBRef}
                  onChange={(event) => setTeamPageB(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>

              <Form.Group controlid="teamPicB">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Team B Picture URL"
                  value={teamPicB}
                  ref={teamPicBRef}
                  onChange={(event) => setTeamPicB(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>
              </div>
              <div className="coach-split">
                <Form.Group controlid="teamCoachesA">
                  <Form.Label></Form.Label>
                  <Button variant="info wsd set-coaches w-100">Set A Coaches</Button>
                </Form.Group>

                <Form.Group controlid="teamCoachesB">
                  <Form.Label></Form.Label>
                  <Button variant="info wsd set-coaches w-100">Set B Coaches</Button>
                </Form.Group>
              </div>
            </>
          ) : multi === "V&JV" ? (
            <>
            <div className="multi-split">
              <Form.Group controlid="teamPageA">
                <Form.Label>Pages</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Varsity Team Page URL"
                  value={teamPageA}
                  ref={teamPageARef}
                  onChange={(event) => setTeamPageA(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>

              <Form.Group controlid="teamPicA">
                <Form.Label>Pictures</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Varsity Team Picture URL"
                  value={teamPicA}
                  ref={teamPicARef}
                  onChange={(event) => setTeamPicA(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>
              </div>

              <div className="multi-split">
              <Form.Group controlid="teamPageB">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="JV Team Page URL"
                  value={teamPageB}
                  ref={teamPageBRef}
                  onChange={(event) => setTeamPageB(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>

              <Form.Group controlid="teamPicB">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="JV Team Picture URL"
                  value={teamPicB}
                  ref={teamPicBRef}
                  onChange={(event) => setTeamPicB(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>
              </div>

              <div className="coach-split">
                <Form.Group controlid="teamCoachesA">
                  <Form.Label></Form.Label>
                  <Button variant="info wsd set-coaches w-100">
                    Set Varsity Coaches
                  </Button>
                </Form.Group>

                <Form.Group controlid="teamCoachesB">
                  <Form.Label></Form.Label>
                  <Button variant="info wsd set-coaches w-100">Set JV Coaches</Button>
                </Form.Group>
              </div>
            </>
          ) : (
            <>
              <Form.Group controlid="teamPageA">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Team Page URL"
                  value={teamPageA}
                  ref={teamPageARef}
                  onChange={(event) => setTeamPageA(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>

              <Form.Group controlid="teamPicA">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Team Picture URL"
                  value={teamPicA}
                  ref={teamPicARef}
                  onChange={(event) => setTeamPicA(event.target.value)}
                  disabled={archived}
                />
              </Form.Group>

              <Form.Group controlid="teamCoaches">
                <Form.Label></Form.Label>

                <Button variant="info wsd set-coaches"> Set Coaches </Button>
                {
                  /*<Form.Control
              type="textarea"
              placeholder="Enter Coaches names"
              value={coaches}
              ref={coachesRef}
              onChange={(event) => setCoaches(event.target.value)}
              disabled={archived}
        />*/ console.log(coachesARef || coachesBRef)
                }
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="left-delete" style={{ marginRight: "auto" }}>
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
        </div>
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
                    teamPageA: teamPageA,
                    teamPicA: teamPicA,
                    teamPageB: teamPageB,
                    teamPicB: teamPicB,
                    coachesA: coachesA,
                    coachesB: coachesB,
                    delete: deleteValue,
                  }); // Pass the value of the "Delete" checkbox
                } else {
                  handleAddTeam(
                    teamName,
                    sport,
                    abbr,
                    multi,
                    teamPageA,
                    teamPicA,
                    teamPageB,
                    teamPicB,
                    coachesA,
                    coachesB
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
