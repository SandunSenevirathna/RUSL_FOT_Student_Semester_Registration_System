import React, { useEffect, useState } from "react";
import { Box, Divider, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import config from "../../ipAddress";
import { getStudentData } from "../StudentData";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const SubjectHistory = () => {
  const localIp = config.localIp;
  const { student_registration_number, batch, department } = getStudentData();

  const [registeredSubjects, setRegisteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredSubjects = async () => {
      try {
        const response = await axios.get(
          `http://${localIp}:8085/api/student/semester_registration/all_subjects_registered_previous_semesters`,
          {
            params: {
              student_registration_number: student_registration_number, // Replace with actual registration number
            },
          }
        );
        setRegisteredSubjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      }
    };

    fetchRegisteredSubjects();
  }, [localIp, student_registration_number]);

  // Get unique semesters
  const uniqueSemesters = [
    ...new Set(registeredSubjects.map((subject) => subject.semester)),
  ];

  return (
    <Box m={3}>
      <Box>
        <Typography sx={{ fontSize: 30, fontWeight: 500 }}>
          Registered Subjects on Previous Semesters
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 300 }}>
          You can see which subjects you have registered in previous semesters
        </Typography>
        <Divider orientation="horizontal" flexItem sx={{ mt: 1, mb: 1 }} />
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        uniqueSemesters.map((semester, index) => {
          // Check if any subject in this semester is not approved
          const semesterSubjects = registeredSubjects.filter(
            (subject) => subject.semester === semester
          );
          const notApproved = semesterSubjects.some(
            (subject) => subject.approve === 0
          );
          const comment =
            semesterSubjects.find((subject) => subject.comment)?.comment || "";

          return (
            <Box key={index} mt={2}>
              <Typography
                variant="h6"
                sx={{ color: notApproved ? "red" : "green" }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  {!!comment && (
                    <Tooltip title={comment}>
                      <NotificationsNoneOutlinedIcon
                        sx={{ marginRight: "5px" }}
                      />
                    </Tooltip>
                  )}
                  Semester {semester} -{" "}
                  {notApproved ? "Not Approved" : "Approved"}
                </span>
              </Typography>
              {registeredSubjects
                .filter((subject) => subject.semester === semester)
                .map((subject, i) => (
                  <Typography key={i} mt={1}>
                    • {subject.subject_code} {subject.subject_name}
                  </Typography>
                ))}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default SubjectHistory;
