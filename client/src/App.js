import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginMain from './Login Main/LoginMain';
import Sidebar from './SideBar/Sidebar';
import Student_Profile from './Student/Profile/Profile';
import SubjectHistory from './Student/SubjectHistory/SubjectHistory';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import RegisterMenu from './AR Office/Registration/Register Menu/RegisterMenu';
import AROffice_Profile from './AR Office/Profile/AROffice_Profile';
import Student_Semester from './Student/Semester/Student_Semester';
import Lec_Profile from './Lecturer/Profile/Profile';
import Lec_Approve from './Lecturer/Approve/Approve';
import AROffice_Semester from './AR Office/Registration/Semester/Semester';
import Lec_Subject_Register_Student_Report from './Components/StudentsReport/Subject_Register_Student_Report';


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
              <Route path="Student_Profile" element={<Student_Profile />} />
              <Route path="Student_Semester" element={<Student_Semester/>} />
              <Route path="Student_Subject" element={<SubjectHistory />} />
              
              <Route path="AROffice_Registration" element={<RegisterMenu />} />
              <Route path="AROffice_Profile" element={<AROffice_Profile />} />
              <Route path="AROffice_Semester" element={<AROffice_Semester />} />


              <Route path="Lec_Profile" element={<Lec_Profile />} />
              <Route path="Lec_Approve" element={<Lec_Approve />} />
              <Route path="Lec_Subject_Register_Student_Report" element={<Lec_Subject_Register_Student_Report />} />





            </Routes>
          </Sidebar>
        }
      />
    </Routes>
  );
};

export default App;
