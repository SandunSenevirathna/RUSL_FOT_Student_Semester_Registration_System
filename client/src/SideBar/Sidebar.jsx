import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CastForEducationOutlinedIcon from "@mui/icons-material/CastForEducationOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AddReactionRoundedIcon from "@mui/icons-material/AddReactionRounded";
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { getLoginData } from "../LoginData";
import { getStudentData, setStudentData } from "../Student/StudentData";
import { getLecturerData, setLecturerData } from "../Lecturer/LecturerData";
import "./Sidebar.css";
import axios from "axios";
import config from "../ipAddress";

const Sidebar = ({ children }) => {
  const localIp = config.localIp;

  const [openSidebar, setOpenSidebar] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null); // Track the selected menu item
  const navigate = useNavigate(); // Add the useNavigate hook to access the navigation function
  const { profileName, universityEmail, position, profile_photo } = getLoginData();

  const menuItems_Student = [
    //1 student
    {
      name: "Profile",
      link: "/Main_Menu/Student_Profile",
      icon: AccountCircleOutlinedIcon,
    },
    {
      name: "Semester",
      link: "/Main_Menu/Student_Semester",
      icon: CastForEducationOutlinedIcon,
    },
    {
      name: "Subject",
      link: "/Main_Menu/Student_Subject",
      icon: ClassOutlinedIcon,
    },
  ];
 
  const menuItems_Lecturer = [
    //2 Lec
    { name: "Approve", link: "/Main_Menu/Lec_Approve", icon: TaskAltOutlinedIcon },
    {
      name: "Report",
      link: "/Main_Menu/Lec_Subject_Register_Student_Report",
      icon: AssessmentRoundedIcon,
    },
    {
      name: "Profile",
      link: "/Main_Menu/Lec_Profile",
      icon: AccountCircleOutlinedIcon,
    },
  ];

  const menuItems_AR_Office = [
    //3 AR
    {
      name: "Registration",
      link: "/Main_Menu/AROffice_Registration",
      icon: AddReactionRoundedIcon,
    },
    { name: "Semester", link: "/Main_Menu/AROffice_Semester", icon: CastForEducationOutlinedIcon },
    {
      name: "Profile",
      link: "/Main_Menu/AROffice_Profile",
      icon: AccountCircleOutlinedIcon,
    },
  ];

  const renderMenuItems = () => {
    let menuItems;

    if (position === "Student") {
      menuItems = menuItems_Student;
    } else if (position === "Lecturer" || position === "Head of Department") {
      menuItems = menuItems_Lecturer;
    } else if (position === "AR") {
      menuItems = menuItems_AR_Office;
    }

    // Ensure menuItems is defined and not null
    if (!menuItems) {
      menuItems = [];
    }

    return menuItems.map((menu, i) => (
      <NavLink
        to={menu.link}
        key={i}
        className={`flex items-center text-sm gap-5 font-medium p-2 rounded-xl 
          hover:bg-gray-500 ${
            selectedMenuItem === menu.name ? "bg-gray-500" : ""
          }`}
      >
        <div className={`${!openSidebar && "translate-x-[-3px]"}`}>
          {React.createElement(menu.icon, { size: "20" })}
        </div>
        <h2
          style={{
            transitionDelay: `${i + 2}00ms`,
          }}
          className={`whitespace-pre duration-500 ${
            !openSidebar ? "opacity-0 translate-x-28 overflow-hidden" : ""
          }`}
        >
          {menu.name}
        </h2>
      </NavLink>
    ));
  };

  useEffect(() => {
    if (position === "Student") {
      console.log(universityEmail);
      axios
        .get(`http://${localIp}:8085/api/student/selected_student_by_email`, {
          params: { email: universityEmail },
        })
        .then((response) => {
          if (response.data.length > 0) {
            // Check if data is received
            const {
              student_registration_number,
              student_index_number,
              batch,
              department,
            } = response.data[0];
            setStudentData(
              student_registration_number,
              student_index_number,
              batch,
              department
            );
            console.log("Student data:", getStudentData()); 
          } else {
            console.log("No student data found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    if (position === "Head of Department" || position === "Lecturer") {
      console.log(universityEmail);
      axios
        .get(`http://${localIp}:8085/api/lecturer/selected_lecturer_by_email`, {
          params: { email: universityEmail },
        })
        .then((response) => {
          if (response.data.length > 0) {
            // Check if data is received
            const { position, department } = response.data[0];
            setLecturerData(position, department);
            console.log("Lecturer data:", getLecturerData());
          } else {
            console.log("No lecturer data found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching lecturer data:", error);
        });
    }
  }, [localIp, position, universityEmail]);

  const logOutEvent = () => {
    navigate("/"); // Assuming "/login" is the route for the LoginMain component
  };

  return (
    <div className={"min-w-[320px]"}>
      <section className={`flex gap-9 ${openSidebar ? "" : "sidebar-closed"}`}>
        <div
          className={`bg-[#343541] min-h-screen ${
            openSidebar ? "w-60" : "w-16"
          } duration-500 text-white px-4`}
          style={{ position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 1 }} // Apply fixed position to sidebar
        >
          <div className={"py-3 flex justify-end"}>
            <MenuIcon
              style={{ fontSize: 30 }}
              className={"cursor-pointer"}
              onClick={() => setOpenSidebar(!openSidebar)}
            />
          </div>

          <div className={`pt-5 flex flex-col items-center ${!openSidebar}`}>
            <Avatar
              alt="Profile"
              src={profile_photo}
              sx={{
                width: openSidebar ? 100 : 30,
                height: openSidebar ? 100 : 30,
              }}
              className={`transition-all ${!openSidebar ? "w-0 h-0" : ""}`}
            />
          </div>
          <div
            className={` opacity-0 ${
              !openSidebar && "translate-y-[-30px] translate-x-6 opacity-100"
            }`}
          >
            <img
              style={{
                width: openSidebar ? 25 : 10,
                height: openSidebar ? 25 : 10,
              }}
              src="https://img.icons8.com/emoji/48/green-circle-emoji.png"
              alt="green-circle-emoji"
            />
          </div>

          <div className={"flex flex-col items-center"}>
            <h5
              className={`whitespace-pre text-base font-medium duration-200 ${
                !openSidebar && "opacity-0  overflow-hidden"
              }`}
            >
              {profileName}
            </h5>
          </div>

          <div className={"py-0 flex flex-col items-center"}>
            <h5
              className={`whitespace-pre text-sm duration-200 ${
                !openSidebar && "opacity-0 overflow-hidden"
              }`}
            >
              {universityEmail}
            </h5>
          </div>

          <div
            className={`space-y-3 duration-500  py-20 ${
              !openSidebar && " pt-36 translate-y-[-50px]"
            }`}
          >
            {renderMenuItems()}
          </div>

          <div className={"pt-15  whitespace-pre flex flex-col items-center"}>
            <button
              className={` duration-500  bg-slate-50 text-base text-black px-5 py-2 rounded-full font-semibold  hover:bg-slate-500 cursor-pointer hover:text-white ${
                !openSidebar && " bg-transparent text-white"
              }`}
              onClick={logOutEvent}
            >
              <LoginRoundedIcon sx={{ pr: "3px" }} />
              {!openSidebar ? "" : "Log Out"}
            </button>
          </div>
        </div>
        <main
          className={`flex-grow overflow-y-auto pr-3 ${
            openSidebar ? "main-blur" : ""
          }`}
          style={{
            marginLeft: openSidebar ? "240px" : "64px",
            transition: "margin-left 0.3s ease",
          }}
        >
          {children}
        </main>
      </section>
    </div>
  );
};

export default Sidebar;
