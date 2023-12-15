import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginMain from './Login Main/LoginMain';
import Sidebar from './SideBar/Sidebar';
import Profile from './Student/Profile';
import Approve from './Lecturer/Approve';
import Notification from './Lecturer/Notification';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import RegisterMenu from './AR Office/Registration/Register Menu/RegisterMenu';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginMain />} />
      {/* Wrap the nested Routes inside a Route or React.Fragment */}
      <Route
        path="/Main_Menu/*"
        element={
          <Sidebar>
            <Routes>

              <Route index element={<WelcomePage />} />
              <Route path="Student_Profile" element={<Profile />} />
              <Route path="Student_Semester" element={<Approve />} />
              <Route path="Student_Subject" element={<Notification />} />
              <Route path="Student_Subject" element={<Notification />} />
              <Route path="AROffice_Registration" element={<RegisterMenu />} />

            </Routes>
          </Sidebar>
        }
      />
    </Routes>
  );
};

export default App;
