import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginMain from './Login Main/LoginMain';
import Sidebar from './SideBar/Sidebar';

const App = () => {
  return (
    <Routes>
      <Route path="/Student_Part" element={<Sidebar />} />
      <Route path="/login" element={<LoginMain />} />
    </Routes>
  );
};

export default App;
