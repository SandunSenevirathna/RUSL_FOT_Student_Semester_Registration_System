import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginMain from './Login Main/LoginMain';
import Sidebar from './SideBar/Sidebar';
import Profile from './Student/Profile';
import Approve from './Lecturer/Approve';
import Notification from './Lecturer/Notification';
import WelcomePage from './Components/WelcomePage/WelcomePage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginMain />} />
      <Route path="/Main_Menu/*" element={<MainWithSidebar />} />
    </Routes>
  );
};

const MainWithSidebar = () => {
  return (
    <Sidebar>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/Student_Profile" element={<Profile />} />
        <Route path="/Student_Semester" element={<Approve />} />
        <Route path="/Student_Subject" element={<Notification />} />
      </Routes>
    </Sidebar>
  );
};

export default App;
