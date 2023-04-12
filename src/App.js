import './styles/App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Seasons from './components/Seasons';
import Opponents from './components/Opponents';
import Archive from './components/Archive';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/seasons" element={<Seasons />} />
          <Route path="/opponents" element={<Opponents />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;