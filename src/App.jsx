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
import Forms from "./components/Forms";
import Login from "./components/Login";

/* routing for the app. Any new components/pages need to be added here. */
const App = () => {
  return (
    <div className='App'>

      <Router>
        <Navigation />
        <Routes>
          <Route path='/athletics/' element={<Home />} />
          <Route path='/athletics/seasons' element={<Seasons />} />
          <Route path='/athletics/opponents' element={<Opponents />} />
          <Route path='/athletics/archive' element={<Archive />} />
          <Route path='/athletics/coaches' element={<Coaches />} />
          <Route path='/athletics/forms' element={<Forms />} />
          <Route path='/athletics/login' element={<Login />} />
          <Route path='/athletics/roster/:seasonid/:teamid' element={<Roster />} />
          <Route path='/athletics/schedule/:seasonid/:teamid' element={<Schedule />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
