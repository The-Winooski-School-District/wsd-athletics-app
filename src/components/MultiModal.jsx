import React /* useRef, useState, useEffect */ from "react";
import { Modal, Form, Button } from "react-bootstrap";


const MultiModal = ({ team, showMultiModal, handleCloseMultiModal }) => {
    const handleMultiModalClose = () => {
      console.log(team);
      handleCloseMultiModal();
    };
  return (
    <div>
      <Modal show={showMultiModal} onHide={handleMultiModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Which Team's {/*roster or schedule*/} is being modified?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="identicalRosters">
            <Form.Label>Rosters identical?</Form.Label>
    {/* THESE BOTH NEED REF= REFRENCES I THINK IDK */}
            <div className="radio">
              <Form.Check
                inline
                label="Varisty or A"
                name="team1"
                type="radio"
                id="team1"
                value={true}

                onChange={console.log(team)}
              />
              <Form.Check
                inline
                label="JV or B"
                name="team2"
                type="radio"
                id="team2"
                value={false}

                onChange={console.log(team)}
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success">Go</Button>
          <Button variant="secondary" onClick={handleCloseMultiModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MultiModal;
