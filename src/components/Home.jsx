import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Seasons from "./Seasons";
import Opponents from "./Opponents";

const Home = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <React.Fragment>
            <div className="Container">
              <h1 className="title">WSD Athletics</h1>
              <hr className="top-hr"></hr>
              <div className="Select">
                <Link to="/seasons" className="Seasons">
                  <h2>Seasons</h2>
                  <br />
                  <p>Seasons and Teams</p>
                </Link>
                <Link to="/opponents" className="Opponents">
                  <h2>Opponents</h2>
                  <br />
                  <p>Information</p>
                </Link>
              </div>
              <hr className="separator"></hr>
              <Link to="/archive" className="Archive">
                <h2>Archive</h2>
              </Link>
            </div>
          </React.Fragment>
        }
      />
      <Route path="/seasons" element={<Seasons />} />
      <Route path="/opponents" element={<Opponents />} />
    </Routes>
  );
};

export default Home;
