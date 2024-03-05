import { Box, Button, Typography } from "@mui/material";
import React from "react";
import BackupIcon from "@mui/icons-material/Backup";
import { getSelectedSubjectData } from "./SelectedSubjectData";
import { getStudentData } from "../StudentData";
import axios from "axios";
import config from "../../ipAddress";
import moment from "moment";

const FinalStep = ({onClose}) => {
  const localIp = config.localIp;

  const selectedSubjectData = getSelectedSubjectData(); // Retrieve selected subject data
  const { department } = getStudentData();

  const currentDate = moment().format("YYYY-MM-DD");

  // Function to handle form submission
  const handleSubmit = () => {
    try {
      // Prepare data to be sent to the backend
      const dataToSend = {
        student_registration_number: selectedSubjectData.student_registration_number,
        subjects: selectedSubjectData.subjects.map(subject => ({
          code: subject.code,
          name: subject.name
        })),
        semester: selectedSubjectData.semester,
        department:department,
        date: currentDate,
      };
      
      //console.log(dataToSend);
      // Send data to the backend for submission
      axios.post(`http://${localIp}:8085/api/registered_semester_data/submit_data`, dataToSend)
        .then(response => {
          //console.log(response.data);
          onClose();
          // Add any additional logic here after successful submission
        })
        .catch(error => {
          console.error("Error submitting Subject Data:", error);
          // Handle errors
        });
    } catch (error) {
      console.error("Error in handleSubmit:", error); // Log any caught errors
    }
  };

  return (
    <Box m={3}>
      <Box>
        <Box display={"flex"} flexDirection={"column"}>
          <Box>
            <Typography sx={{ fontWeight: "500" }}>
              Selected {selectedSubjectData.semester} Semester Subjects
            </Typography>
            {selectedSubjectData.subjects.map((subject, index) => (
              <Typography key={index}>
                <span style={{ fontSize: 25, fontWeight: "bold" }}>•</span>{" "}
                {subject.code}: {subject.name}
              </Typography>
            ))}
          </Box>

          <Box>
            <Button
              variant="contained"
              endIcon={<BackupIcon />}
              color="success"
              onClick={handleSubmit}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FinalStep;
