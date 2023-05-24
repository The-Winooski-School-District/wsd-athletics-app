import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { db } from "./Firebase";
import AddCoachModal from "./AddCoachModal";
import CoachCard from "./CoachCard";

const Coaches = () => {
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const coachesRef = db.ref("coaches");
    const coachesListener = coachesRef.on("value", (snapshot) => {
      const coachesData = snapshot.val();
      if (coachesData) {
        const coachesList = Object.keys(coachesData).map((key) => {
          return { id: key, ...coachesData[key] };
        });
        setCoaches(coachesList);
      } else {
        setCoaches([]);
      }
    });

    return () => {
      coachesRef.off("value", coachesListener);
    };
  }, []);

  const handleShowAddCoachModal = () => {
    setShowAddCoachModal(true);
  };

  const handleAddCoach = (coachName, coachPhoto, coachBio, coachSports) => {
    const newCoach = { coachName, coachPhoto, coachBio, coachSports };
    db.ref("coaches")
      .push(newCoach)
      .catch((error) => {
        console.log("Error adding coach:", error);
      });
  };

  return (
    <div className="Container">
      <Link to="/*" className="yellow">
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
          {coaches.map((coach, index) => (
            <CoachCard key={coach.id} index={index} coach={coach} />
          ))}
        </div>
      </Container>
      <AddCoachModal
        showAddCoachModal={showAddCoachModal}
        handleCloseAddCoachModal={() => setShowAddCoachModal(false)}
        onAddCoach={handleAddCoach}
      />
    </div>
  );
};

export default Coaches;
