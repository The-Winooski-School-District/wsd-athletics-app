import React, { useState, useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddCoachModal = ({
  showAddCoachModal,
  handleCloseAddCoachModal,
  onAddCoach,
}) => {
  const [coachSports, setCoachSports] = useState([]);
  const [coachName, setCoachName] = useState("");
  const [coachPic, setCoachPic] = useState("");
  const [coachInfo, setCoachInfo] = useState("");

  const handleCoachInfoChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 1000) {
      setCoachInfo(inputValue);
    }
  };
  const coachNameRef = useRef();
  const coachPicRef = useRef();
  const coachSportsRef = useRef();
  const coachInfoRef = useRef();

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
    setCoachInfo(""); // Clear coach info input
    handleCloseAddCoachModal();
  };

  return (
    <div>
      <Modal show={showAddCoachModal} onHide={handleAddCoachModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add A Coach</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                required
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
                  checked={coachSports.includes("baseball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="basketball"
                  label="Basketball"
                  value="Basketball"
                  checked={coachSports.includes("basketball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="softball"
                  label="Softball"
                  value="Softball"
                  checked={coachSports.includes("softball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="soccer"
                  label="Soccer"
                  value="Soccer"
                  checked={coachSports.includes("soccer")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="football"
                  label="Football"
                  value="Football"
                  checked={coachSports.includes("football")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="track-and-field"
                  label="Track & Field"
                  value="Track & Field"
                  checked={coachSports.includes("track-and-field")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  ref={coachSportsRef}
                  id="cheerleading"
                  label="Cheerleading"
                  value="Cheerleading"
                  checked={coachSports.includes("cheerleading")}
                  onChange={handleCheckboxChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="coachInfo">
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={1000}
                name="coachInfo"
                value={coachInfo}
                ref={coachInfoRef}
                onChange={handleCoachInfoChange}
                placeholder="A little info about yourself..."
              />
              <div className="character-count">
                Characters Used: {coachInfo.length}/1000
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
                onAddCoach(coachName, coachPic, coachSports, coachInfo);
                handleCloseAddCoachModal();
              }
            }}
          >
            Add Coach
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
