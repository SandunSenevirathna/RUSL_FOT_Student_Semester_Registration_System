import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import moment from "moment";
import config from "../../ipAddress";
import axios from "axios";
import { sha256 } from "js-sha256";

const AddProfile = ({ selectedRow }) => {
  const localIp = config.localIp;

  const [profileName, setProfileName] = useState("");
  const [universityEmail, setUniversityEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [time, setTime] = useState(moment().format("HH:mm:ss"));
  const encryptedPassword = sha256(password);
  // Update state values when selectedRow changes

  useEffect(() => {
    if (selectedRow) {
      setProfileName(selectedRow.profile_name || "");
      setUniversityEmail(selectedRow.university_email || "");
      setPassword(selectedRow.password || "");
      setPosition(selectedRow.position || "");
    } else {
      // If selectedRow is null, set state values to empty strings
      setProfileName("");
      setUniversityEmail("");
      setPassword("");
      setPosition("");
    }
  }, [selectedRow]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@tec\.rjt\.ac\.lk$/; // Corrected regex pattern
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 10 && password.length <= 100;
  };

  const handleAddData = () => {
    // Validate email and password
    if (!validateEmail(universityEmail)) {
      alert("Invalid email format. Please enter a valid university email.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must have between 10 to 100 characters.");
      return;
    }

    // Validate profile name
    const profileNamePattern = /^[A-S.]+$/;
    if (!profileNamePattern.test(profileName)) {
      alert("Profile name must consist of uppercase letters from A to S and periods.");
      return;
    }
    
    // Check if all fields are filled
    if (profileName && universityEmail && password && position) {
      axios
        .post(`http://${localIp}:8085/api/ar_office_profile/add_profile`, {
          profileName,
          universityEmail,
          password: encryptedPassword,
          position,
          date,
          time,
        })
        .then((response) => {
          alert(`${profileName} added successfully`);
          handleClearDate();
        })
        .catch((error) => {
          console.error("Error adding profile:", error);
          alert(
            "An error occurred while adding the profile. Please try again later."
          );
        });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleClearDate = () => {
    setProfileName("");
    setUniversityEmail("");
    setPassword("");
    setPosition("");
  };

  const positionOptions = ["AR", "Head of Department", "Lecturer", "Student"];
  return (
    <Box m={5}>
      <Box>
        <Typography
          sx={{ fontSize: 25, fontWeight: 700 /*color:"#6F6F6F"*/ }}
          gutterBottom
        >
          Profile Customization
        </Typography>
      </Box>
      <Box display={"flex"} flexDirection={"column"}>
        <TextField
          id="outlined-basic-profile-name"
          label="Profile Name"
          variant="outlined"
          style={{ marginBottom: "10px" }}
          value={profileName}
          onChange={(event) => setProfileName(event.target.value)}
          required
        />
        <TextField
          id="outlined-basic-university-email"
          label="University Email"
          variant="outlined"
          style={{ marginBottom: "10px" }}
          value={universityEmail}
          onChange={(event) => setUniversityEmail(event.target.value)}
          required
        />
        <TextField
          id="outlined-basic-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          style={{ marginBottom: "10px" }}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Position *</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={position}
            label="Position *"
            onChange={(event) => setPosition(event.target.value)}
          >
            <MenuItem value="">
              <em style={{ color: "#A9A3AF" }}>Select Position</em>
            </MenuItem>
            {positionOptions.map((position) => (
              <MenuItem key={position} value={position}>
                {position}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mt={2}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Button
            variant="contained"
            size="large"
            style={{ width: "120px", backgroundColor: "#1F1F1F" }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#388e3c")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1F1F1F")}
            onClick={handleAddData}
          >
            Add
          </Button>
          <Button
            variant="contained"
            size="large"
            style={{ width: "120px", backgroundColor: "#1F1F1F" }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#FCAD0C")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1F1F1F")}
            onClick={handleClearDate}
          >
            Clear
          </Button>
        </Box>
        <Box mt={1}>
          <Button
            variant="contained"
            size="large"
            style={{ width: "250px", backgroundColor: "#1F1F1F" }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#FA362B")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1F1F1F")}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProfile;
