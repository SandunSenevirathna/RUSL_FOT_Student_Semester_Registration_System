import React, { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import axios from "axios";
import config from "../../ipAddress";
import { getStudentData } from "../StudentData";
import moment from "moment";

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
  const uniqueSemesters = [...new Set(registeredSubjects.map(subject => subject.semester))];

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
          const notApproved = registeredSubjects.some(subject => subject.semester === semester && subject.approve === 0);

          return (
            <Box key={index} mt={2}>
              <Typography variant="h6" sx={{ color: notApproved ? 'red' : 'green' }}>
                Semester {semester} - {notApproved ? 'Not Approved' : 'Approved'}
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
