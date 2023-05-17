import React, { useState, useRef } from 'react';
import { Modal, Form, Button } from "react-bootstrap";

const AddCoachModal = ({ showAddCoachModal, handleCloseAddCoachModal }) => {
  const [checkedSports, setCheckedSports] = useState([]);
  const [coachName, setCoachName] = useState("");
  const [coachPic, setCoachPic] = useState("");

  const coachNameRef = useRef();
  const coachPicRef = useRef();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedSports([...checkedSports, value]);
    } else {
      setCheckedSports(checkedSports.filter((sport) => sport !== value));
    }
  };

  const handleAddCoachModalClose = () => {
    handleCloseAddCoachModal();
  };

  return (
    <div>
      <Modal show={showAddCoachModal} onHide={handleAddCoachModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add A Coach</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddCoachModalClose();
            }}
          >
            <Form.Group controlId="Name">
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={coachName}
                ref={coachNameRef}
                onChange={(event) => setCoachName(event.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group controlId="Photo">
              <Form.Control
                type="text"
                placeholder="URL for Photo"
                value={coachPic}
                ref={coachPicRef}
                onChange={(event) => setCoachPic(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="Sports">
              <Form.Label>Choose Sports:</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="checkbox"
                  id="baseball"
                  label="Baseball"
                  value="baseball"
                  checked={checkedSports.includes("baseball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  id="basketball"
                  label="Basketball"
                  value="basketball"
                  checked={checkedSports.includes("basketball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  id="softball"
                  label="Softball"
                  value="softball"
                  checked={checkedSports.includes("softball")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  id="soccer"
                  label="Soccer"
                  value="soccer"
                  checked={checkedSports.includes("soccer")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  id="football"
                  label="Football"
                  value="football"
                  checked={checkedSports.includes("football")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  id="track-and-field"
                  label="Track & Field"
                  value="track-and-field"
                  checked={checkedSports.includes("track-and-field")}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  id="cheerleading"
                  label="Cheerleading"
                  value="cheerleading"
                  checked={checkedSports.includes("cheerleading")}
                  onChange={handleCheckboxChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseAddCoachModal}>
            Done
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
