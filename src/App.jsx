import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/RootLayout';
import { Home } from './pages/Home';
import { Guidelines } from './pages/Guidelines';
import { Tracks } from './pages/Tracks';
import { ScheduleLive } from './pages/ScheduleLive';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="guidelines" element={<Guidelines />} />
          <Route path="tracks" element={<Tracks />} />
          <Route path="schedule" element={<ScheduleLive />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
