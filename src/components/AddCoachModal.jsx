import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddCoachModal = ({
  showAddCoachModal,
  handleCloseAddCoachModal,
  handleCoachSave,
  onAddCoach,
  editing,
  coach,
}) => {
  const [coachSports, setCoachSports] = useState([]);
  const [coachName, setCoachName] = useState("");
  const [coachPic, setCoachPic] = useState("");
  const [coachBio, setCoachBio] = useState("");

  useEffect(() => {
    if (coach) {
      setCoachName(coach.coachName);
      setCoachPic(coach.coachPic);
      setCoachBio(coach.coachBio);
      setCoachSports(coach.coachSports);
    }
    if (!showAddCoachModal) {
      setCoachName(editing ? coach.coachName : "");
      setCoachPic(editing ? coach.coachPic : "");
      setCoachBio(editing ? coach.coachBio : "");
      setCoachSports(editing ? coach.coachSports : "");
    }
  }, [coach, editing, showAddCoachModal]);

  const handleCoachBioChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 1000) {
      setCoachBio(inputValue);
    }
  };
  const coachNameRef = useRef();
  const coachPicRef = useRef();
  const coachSportsRef = useRef();
  const coachBioRef = useRef();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCoachSports([...coachSports, value]);
    } else {
      setCoachSports(coachSports.filter((sport) => sport !== value));
    }
  };

  const handleAddCoachModalClose = () => {
    setCoachName(""); // Clear coach name input
    setCoachPic(""); // Clear coach photo input
    setCoachSports([]); // Clear coach sports input
    setCoachBio(""); // Clear coach info input
    handleCloseAddCoachModal();
  };

  return (
    <div>
      <Modal show={showAddCoachModal} onHide={handleAddCoachModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? `Edit Coach` : "Add A Coach"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-coach-modal-fit">
          <Form>
            <Form.Group controlId="coachName">
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="coachName"
                value={coachName}
                ref={coachNameRef}
                onChange={(event) => setCoachName(event.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group controlId="coachPhoto">
              <Form.Control
                type="text"
                placeholder="URL for Photo"
                name="coachPhoto"
                value={coachPic}
                ref={coachPicRef}
                onChange={(event) => setCoachPic(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="coachSports">
              <Form.Label>Sports Coached</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="baseball"
                  label="Baseball"
                  value="Baseball"
                  checked={coachSports.includes("Baseball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="basketball"
                  label="Basketball"
                  value="Basketball"
                  checked={coachSports.includes("Basketball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="softball"
                  label="Softball"
                  value="Softball"
                  checked={coachSports.includes("Softball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="soccer"
                  label="Soccer"
                  value="Soccer"
                  checked={coachSports.includes("Soccer")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="football"
                  label="Football"
                  value="Football"
                  checked={coachSports.includes("Football")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="track-and-field"
                  label="Track & Field"
                  value="Track & Field"
                  checked={coachSports.includes("Track & Field")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="cheerleading"
                  label="Cheerleading"
                  value="Cheerleading"
                  checked={coachSports.includes("Cheerleading")}
                  onChange={handleCheckboxChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-1 mt-3" controlId="coachBio">
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={1000}
                name="coachBio"
                value={coachBio}
                ref={coachBioRef}
                onChange={handleCoachBioChange}
                placeholder="A little info about yourself..."
              />
              <div className="character-count">
                Characters Used: {coachBio.length}/1000
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              if (coachSports.length === 0) {
                alert("Please select at least one sport");
              } else {
                if (editing) {
                  handleCoachSave({
                    id: coach.id,
                    coachName: coachName,
                    coachPic: coachPic,
                    coachSports: coachSports,
                    coachBio: coachBio,
                  });
                } else {
                  onAddCoach(coachName, coachPic, coachSports, coachBio);
                }
                handleCloseAddCoachModal();
              }
            }}
          >
            {editing ? "Save Changes" : "Add Coach"}
          </Button>
          <Button variant="secondary" onClick={handleCloseAddCoachModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCoachModal;
