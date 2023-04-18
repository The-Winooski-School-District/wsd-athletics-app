import "../styles/Seasons.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Table, Button } from "react-bootstrap";
import { db } from "./Firebase";
import TeamCard from "./TeamCard";
import TeamModal from "./TeamModal";

const Archive = () => {
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // editIdex not in use, removing it breaks stuff. So, here it is! in use :)
  if (!editIndex) {
    /*Do Nothing*/
  }

  useEffect(() => {
    const seasonsRef = db.ref("archived-seasons");
    seasonsRef.on("value", (snapshot) => {
      const seasonsData = snapshot.val();
      if (seasonsData) {
        const seasonsList = Object.keys(seasonsData).map((key) => {
          return { id: key, ...seasonsData[key] };
        });
        setSeasons(seasonsList);
  
        // get teams for each season does not work
        const promises = seasonsList.map((season) => {
          return new Promise((resolve, reject) => {
            const teamsRef = db.ref(`seasons/${season.id}/teams`);
            teamsRef.on("value", (snapshot) => {
              const teamsData = snapshot.val();
              if (teamsData) {
                const teamsList = Object.keys(teamsData).map((key) => {
                  return { id: key, ...teamsData[key] };
                });
                resolve({ [season.id]: teamsList });
              } else {
                resolve({ [season.id]: [] });
              }
            });
          });
        });
        Promise.all(promises).then((teams) => {
          setTeams(teams);
        });
      } else {
        setSeasons([]);
      }
    });
  
    return () => {
      seasonsRef.off();
    };
  }, []);
  
  function handleSeasonRestore(event, id, index) {
    event.preventDefault();
    const year = seasons[index].year;
    const season = seasons[index].season;
    const teams = seasons[index].teams ? seasons[index].teams : {}; // check if teams object exists, otherwise assign empty object
    const year_season = `${year}_${season}`;
    const newSeason = { year, season, year_season, teams };
    if (window.confirm("Are you sure you want to restore this season?")) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`archived-seasons/${id}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
      db.ref("seasons").push(newSeason);
    }
  }

  function handleSeasonDelete(id, index) {
    if (
      window.confirm("Are you sure you want to delete this season permanently?")
    ) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`archived-seasons/${id}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
    }
  }
  
  return (
    <div className='Container'>
      <Link to='/*' className='yellow'>
        <h1>WSD Athletics</h1>
      </Link>

      <div className='navbuttons'>
        <Link to="/seasons" className="yellow">
          <Button variant="outline-warning wsd">Seasons</Button>
        </Link>
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning wsd" disabled>Archive</Button>
        </Link>
        <Link to="/opponents" className="yellow">
          <Button variant="outline-warning wsd">Opponents</Button>
        </Link>
      </div>
      <hr className='top-hr' />
      <div>
        <div className='archive-title'>
          <h2>Archive</h2>
        </div>
      </div>
      <div>
        <Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Year</th>
                <th>Season</th>
                <th className='last-col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season, index) => (
                <React.Fragment key={season.id}>
                  <tr>
                    <td>{season.year}</td>
                    <td>{season.season}</td>
                    <td className='last-col'>
                      <div className='action-buttons'>
                        <Button
                          variant='info wsd'
                          onClick={(event) =>
                            handleSeasonRestore(event, season.id, index)
                          }>
                          Restore
                        </Button>
                        <Button
                          variant='danger wsd'
                          onClick={() => handleSeasonDelete(season.id, index)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td colSpan='3' className='teams-row'>
                      {teams.length > 0 ? (
                        <div className='teams-area'>
                          {teams.map((team) => (
                            <TeamCard
                              key={team.id}
                              team={team}
                              seasonID={season.id}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className='teams-area'>No Teams To Display</div>
                      )}
                      <TeamModal
                        viewingOnly={true}
                        showModal={showModal}
                        handleCloseModal={() => setShowModal(false)}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Form>
      </div>
    </div>
  );
};

export default Archive;
