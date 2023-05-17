import "../styles/Seasons.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { db } from "./Firebase";
import AddCoachModal from "./AddCoachModal";

const Coaches = () => {
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);
  const [coaches, setCoaches] = useState([]);

  if (!coaches) {
    /* Do Nothing */
  }

  useEffect(() => {
    const coachesRef = db.ref("coaches");
    coachesRef.on("value", (snapshot) => {
      const coachesData = snapshot.val();
      if (coachesData) {
        const coachesList = Object.keys(coachesData).map((key) => {
          return { id: key, ...coachesData[key] };
        });
        setCoaches(coachesList);
      }
    });

    return () => {
      coachesRef.off();
    };
  }, []);

  const handleShowAddCoachModal = () => {
    setShowAddCoachModal(true);
  };

  return (
    <div className="Container">
      <Link to="/" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>
      <div className="navbuttons">
        <Link to="/seasons" className="yellow">
          <Button variant="outline-warning wsd">Seasons</Button>
        </Link>
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning wsd">Archive</Button>
        </Link>
        <Link to="/opponents" className="yellow">
          <Button variant="outline-warning wsd">Opponents</Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div>
        <div className="archive-title">
          <h2>Coaches</h2>
        </div>
      </div>
      <Container>
        <div className="add-coach-btn">
          <Button variant="primary wsd" onClick={handleShowAddCoachModal}>
            Add Coach
          </Button>
        </div>
        <div className="teams-area">
          {/*coaches.map((team, index) => (
          <CoachCard
            key={coach.id}
            index={index}
          />
        ))*/}
        </div>
      </Container>
      <AddCoachModal
        showAddCoachModal={showAddCoachModal}
        handleCloseAddCoachModal={() => setShowAddCoachModal(false)}
      />
    </div>
  );
};

export default Coaches;
