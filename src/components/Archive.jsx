import "../styles/App.css";
import "../styles/Seasons.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Table, Button } from "react-bootstrap";
import { db, auth } from "./Firebase";
import TeamCard from "./TeamCard";
import TeamModal from "./TeamModal";

const Archive = () => {
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showTeamModal, setshowTeamModal] = useState(false);
  const [user, setUser] = useState(null);

  const sortedSeasons = seasons.sort(compareSeasons);

  const [showTeams, setShowTeams] = useState(
    new Array(seasons.length).fill(false)
  );

  const toggleTeamDisplay = (index) => {
    const newShowTeams = [...showTeams];
    newShowTeams[index] = !newShowTeams[index];
    setShowTeams(newShowTeams);
  };

  // define the compare function to sort seasons in chronological order
  function compareSeasons(seasonA, seasonB) {
    // compare years first
    if (seasonA.year > seasonB.year) {
      return -1; // seasonA comes first
    } else if (seasonA.year < seasonB.year) {
      return 1; // seasonB comes first
    } else {
      // if years are equal, compare season types
      const seasonOrder = ["Summer", "Spring", "Winter", "Fall"];
      const seasonIndexA = seasonOrder.indexOf(seasonA.season);
      const seasonIndexB = seasonOrder.indexOf(seasonB.season);
      return seasonIndexB - seasonIndexA; // seasonA comes first if it's later in the year
    }
  }

  // editidex not in use, removing it breaks stuff. So, here it is! in use :)
  if (!editIndex) {
    /*Do Nothing*/
  }

  /* auth */
  useEffect(() => {
    // Listen for changes in the user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);


  /* get archive from db */
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

  /* send seasonf rom archive back to seasons */
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

  /* delete season */
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
      <Link to="/athletics" className="yellow">
        <h1>WSD Athletics</h1>
      </Link>

      <div className="navbuttons">
        <Link to="/athletics/seasons" className="yellow">
          <Button variant="outline-warning wsd">Seasons</Button>
        </Link>
        <Link to="/athletics/archive" className="yellow">
          <Button variant="outline-warning wsd" disabled>
            Archive
          </Button>
        </Link>
        <Link to="/athletics/opponents" className="yellow">
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
              {sortedSeasons.map((season, index) => {
                const seasonTeams = teams.filter(
                  (team) => team.seasonid === season.id
                );

                return (
                  <React.Fragment key={season.id}>
                    <tr
                      className="always"
                      onClick={() => toggleTeamDisplay(index)}
                    >
                      <td>
                        <h4 className="column-title">{season.season}</h4>
                      </td>
                      <td>
                        <h4 className="column-title">
                          {season.year + ` - ${parseInt(season.year) + 1}`}
                        </h4>
                      </td>
                      {user ? (
                        <td className="last-col">
                          <div className="action-buttons">
                            <Button
                              variant="info wsd"
                              onClick={(event) =>
                                handleSeasonRestore(event, season.id, index)
                              }
                              disabled
                            >
                              Restore
                            </Button>
                            <Button
                              variant="danger wsd"
                              onClick={() =>
                                handleSeasonDelete(season.id, index)
                              }
                              disabled
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                    {showTeams[index] && (
                      <tr className="onlyif">
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
                            <div className="teams-area">
                              No Teams To Display For This Season
                            </div>
                          )}
                          <TeamModal
                            editing={false}
                            showTeamModal={showTeamModal}
                            handleCloseModal={() => setshowTeamModal(false)}
                          />
                        </td>
                      </tr>
                    )}
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
