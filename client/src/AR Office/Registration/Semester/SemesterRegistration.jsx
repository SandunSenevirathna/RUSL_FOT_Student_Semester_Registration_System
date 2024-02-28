import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import axios from "axios";
import config from "../../../ipAddress";

const SemesterRegistration = ({
  onClose,
  filteredSubjects,
  semester,
  department,
  batch,
}) => {
  const localIp = config.localIp;

  const [isHovered, setIsHovered] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleStartRegistration = () => {
    // Check if a date is selected
    if (!selectedDate) {
      alert("Please select a registration date.");
      return;
    }

    // Extract only the required fields from filteredSubjects
    const filteredSubjectData = filteredSubjects.map((subject) => ({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      subject_type: subject.subject_type,
      credit: subject.credit,
    }));

    // Get the current system date
    const registration_started_date = moment().format("YYYY-MM-DD");

    // Make a POST request to your backend endpoint to start registration
    axios
      .post(
        `http://${localIp}:8085/api/Registration_Start_Data/started_semester_registration`,
        {
          batch,
          department,
          semester,
          filteredSubjects: filteredSubjectData, // Pass filteredSubjects data
          registration_started_date,
          registration_end_date: selectedDate.format("YYYY-MM-DD"),
          // Other relevant data you want to send
        }
      )
      .then((response) => {
        console.log("Registration started successfully:", response.data);
        alert(`${batch} ${department} ${semester} Registration started`);
        onClose();
        // Handle success, such as closing the modal or showing a success message
      })
      .catch((error) => {
        console.error("Error starting registration:", error);
        if (error.response && error.response.status === 400) {
          // Data already exists, show an appropriate message to the user
          alert("Data already exists for this semester, department, and batch");
        } else {
          // Other errors, handle them accordingly
          alert(
            "An error occurred while starting registration. Please try again later."
          );
        }
      });
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Box>
        <Typography
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: 20, color: "#636363" }}
        >
          Final Step
        </Typography>
      </Box>
      <Box sx={{ alignSelf: "center" }}>
        <Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DemoContainer components={["DateRangePicker"]}>
              <DatePicker
                label="Last Registration Date"
                format="YYYY-MM-DD"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color={isHovered ? "success" : "warning"}
            size="large"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleStartRegistration}
          >
            Start Registration
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SemesterRegistration;
