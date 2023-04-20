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

  // editidex not in use, removing it breaks stuff. So, here it is! in use :)
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

        // get teams for each season
        const promises = seasonsList.map((season) => {
          return new Promise((resolve, reject) => {
            const teamsRef = db.ref(`archived-seasons/${season.id}/teams`);
            teamsRef.on("value", (snapshot) => {
              const teamsData = snapshot.val();
              if (teamsData) {
                const teamsList = Object.keys(teamsData).map((key) => {
                  return {
                    id: key,
                    ...teamsData[key],
                    seasonid: season.id,
                    year: season.year,
                    season: season.season,
                  };
                });
                resolve(teamsList);
              } else {
                resolve([]);
              }
            });
          });
        });
        Promise.all(promises).then((teams) => {
          const flattenedTeams = teams.flat();
          setTeams(flattenedTeams);
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
    const seasonId = id;
    const year_season = seasons[index].year_season;
    const year = seasons[index].year;
    const season = seasons[index].season;
    const teams = seasons[index].teams ? seasons[index].teams : {};
    const newSeason = { year, season, teams };
    if (window.confirm("Are you sure you want to restore this season?")) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(index, 1);
      db.ref(`archived-seasons/${seasonId}`).remove();
      setSeasons(updatedSeasons);
      setEditIndex(null);
      db.ref(`seasons/${seasonId}`).set({ year_season, ...newSeason });
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
    <div className="Container">
      <Link to="/*" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>

      <div className="navbuttons">
        <Link to="/seasons" className="yellow">
          <Button variant="outline-warning wsd">Seasons</Button>
        </Link>
        <Link to="/archive" className="yellow">
          <Button variant="outline-warning wsd" disabled>
            Archive
          </Button>
        </Link>
        <Link to="/opponents" className="yellow">
          <Button variant="outline-warning wsd">Opponents</Button>
        </Link>
      </div>
      <hr className="top-hr" />
      <div>
        <div className="archive-title">
          <h2>Archive</h2>
        </div>
      </div>
      <div>
        <Form>
          <Table striped bordered hover>

            <tbody>
              {seasons.map((season, index) => {
                const seasonTeams = teams.filter(
                  (team) => team.seasonid === season.id
                );

                return (
                  <React.Fragment key={season.id}>
                    <tr>
                      <td>{season.year}</td>
                      <td>{season.season}</td>
                      <td className="last-col">
                        <div className="action-buttons">
                          <Button
                            variant="info wsd"
                            onClick={(event) =>
                              handleSeasonRestore(event, season.id, index)
                            }
                          >
                            Restore
                          </Button>
                          <Button
                            variant="danger wsd"
                            onClick={() => handleSeasonDelete(season.id, index)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr>
                      <td colSpan="3" className="teams-row">
                        {seasonTeams.length > 0 ? (
                          <div className="teams-area">
                            {seasonTeams.map((team) => (
                              <TeamCard
                                key={team.id}
                                team={team}
                                seasonid={season.id}
                                archived={true}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="teams-area">No Teams To Display For This Season</div>
                        )}
                        <TeamModal
                          editing={false}
                          showModal={showModal}
                          handleCloseModal={() => setShowModal(false)}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </Form>
      </div>
    </div>
  );
};

export default Archive;
