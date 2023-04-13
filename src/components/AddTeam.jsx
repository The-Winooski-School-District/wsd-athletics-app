import React, { useState } from "react";
import { Button } from "react-bootstrap";

const AddTeam = () => {
  const [showMessage, setShowMessage] = useState(false);

  const deleteme = () => {
    setShowMessage(true);
  };
  return (
    <div>
      <Button variant="primary" onClick={deleteme}>
        Add Team
      </Button>
      {showMessage && <p>Hello, world</p>}
    </div>
  );
};

export default AddTeam;
