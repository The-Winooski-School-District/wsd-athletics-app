import "./styles/App.css";
import "./styles/Buttons.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Seasons from "./components/Seasons";
import Opponents from "./components/Opponents";
import Archive from "./components/Archive";
import Navigation from "./components/Navigation";
import Roster from "./components/Roster";
import Schedule from "./components/Schedule";
import Coaches from "./components/Coaches";

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/*' element={<Home />} />
          <Route path='/seasons' element={<Seasons />} />
          <Route path='/opponents' element={<Opponents />} />
          <Route path='/archive' element={<Archive />} />
          <Route path='/coaches' element={<Coaches />} />
          <Route path='/roster/:seasonid/:teamid' element={<Roster />} />
          <Route path='/schedule/:seasonid/:teamid' element={<Schedule />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
