import React, { useState, useEffect } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CustomButton from "../../../../Components/Buttons/CutomButton/CustomButton";
import RoundTextbox from "../../../../Components/Textboxs/RoundTextbox";
import axios from "axios";
import config from "../../../../ipAddress";

const AddLecturer = ({ onClose, initialLecturerData, isNewStudent }) => {
  const localIp = config.localIp;

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [tpNumber, setTpNumber] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const registrationNumberTextFieldRef = React.useRef(null);
  const positionTextFieldRef = React.useRef(null);
  const nameTextFieldRef = React.useRef(null);
  const addressTextFieldRef = React.useRef(null);
  const emailTextFieldRef = React.useRef(null);
  const tpNumberTextFieldRef = React.useRef(null);

  const positionOptions = [
    "Head of Department",
    "Senior Lecturer",
    "Lecturer",
    "Professor",
  ];

  useEffect(() => {
    // Fetch all departments from the backend when the component mounts
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `http://${localIp}:8085/api/departments/all`
        );
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
    console.log(initialLecturerData);
    registrationNumberTextFieldRef.current?.focus();
  }, [localIp]);

  useEffect(() => {
    if (isNewStudent) {
      handleCleanTextBox();
    } else {
      setRegistrationNumber(
        initialLecturerData.lecturer_registration_number || ""
      );
      setName(initialLecturerData.lecturer_name || "");
      setSelectedPosition(initialLecturerData.position || "");
      setSelectedDepartment(initialLecturerData.department || "");
      setAddress(initialLecturerData.address || "");
      setEmail(initialLecturerData.email || "");
      setTpNumber(initialLecturerData.tp_number || "");
    }
  }, [initialLecturerData]);

  const handleSubjectUpsert = async () => {
    try {
      if (
        !registrationNumber ||
        !name ||
        !selectedPosition ||
        !selectedDepartment ||
        !address ||
        !email ||
        !tpNumber
      ) {
        alert("All data  required.");
        handleCleanTextBox();
        return;
      } else {
        const data = {
          registrationNumber,
          name,
          position: selectedPosition,
          selectedDepartment: selectedDepartment,
          address,
          email,
          tpNumber,
        };

        // Make a POST request to the new upsert endpoint
        const response = await axios.post(
          `http://${localIp}:8085/api/lecturer/upsert`,
          data
        );

        // Handle the response accordingly
        if (response.status === 201) {
          alert("Lecturer inserted successfully");
          handleCleanTextBox();
        } else if (response.status === 200) {
          alert("Lecturer updated successfully");
          handleCleanTextBox();
        }
      }
      // Construct the data object to be sent to the backend

      // Additional actions if needed
    } catch (error) {
      console.error("Error adding/updating lecturer:", error);
      // Handle the error as needed
    }
  };

  const handleLecturerDelete = async () => {
    try {
      // Validate registrationNumber
      console.log("Delete Pressed");
      if (!registrationNumber) {
        alert("Registration Number is required for deletion.");
        return;
      }

      const response = await axios.delete(
        `http://${localIp}:8085/api/lecturer/delete?registrationNumber=${registrationNumber}`
      );

      if (response.status === 200) {
        alert(
          `Lecturer with Registration Number ${registrationNumber} deleted successfully`
        );
        handleCleanTextBox();
      } else {
        alert(
          `Error deleting secturer: ${response.data || response.statusText}`
        );
      }
      // You can perform additional actions after a successful deletion
    } catch (error) {
      console.error("Error deleting secturer:", error);
      // Handle the error as needed
    }
  };

  const handleCleanTextBox = () => {
    setRegistrationNumber("");
    setSelectedPosition("");
    setName("");
    setSelectedDepartment("");
    setAddress("");
    setEmail("");
    setTpNumber("");

    registrationNumberTextFieldRef.current?.focus();
  };

  return (
    <Box
      mt={5}
      ml={5}
      mr={5}
      mb={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <div className="flex flex-col space-y-5">
        <RoundTextbox
          className={"text-center"}
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          height="40px"
          placeholder="L-REG"
          inputRef={registrationNumberTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              nameTextFieldRef.current?.focus();
            }
          }}
        />

        <RoundTextbox
          className={"text-center"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          height="40px"
          placeholder="Lecturer Name"
          inputRef={nameTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              positionTextFieldRef.current?.focus();
            }
          }}
        />

        <FormControl size="small">
          <InputLabel id="position-label" sx={{ textAlign: "center", mb: 1 }}>
            Position
          </InputLabel>
          <Select
            labelId="position-label"
            id="position-select"
            value={selectedPosition}
            onChange={(event) => setSelectedPosition(event.target.value)}
            label="Position"
            sx={{ borderRadius: "40px", pl: 10 }}
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

        <FormControl size="small">
          <InputLabel id="department-label" sx={{ textAlign: "center", mb: 1 }}>
            Department
          </InputLabel>
          <Select
            labelId="department-label"
            id="department-select"
            value={selectedDepartment}
            onChange={(event) => setSelectedDepartment(event.target.value)}
            label="Department"
            sx={{ borderRadius: "40px", pl: 10 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "ArrowDown") {
                e.stopPropagation();
                // handle Add, Delete, or Clean accordingly
              }
            }}
          >
            <MenuItem value="">
              <em style={{ color: "#A9A3AF" }}>Select Department</em>
            </MenuItem>
            {departments.map((department) => (
              <MenuItem
                key={department.department_code}
                value={department.department_code}
              >
                {department.department_code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <RoundTextbox
          className={"text-center"}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          height="40px"
          placeholder="Address"
          inputRef={addressTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              emailTextFieldRef.current?.focus();
            }
          }}
        />
        <RoundTextbox
          className={"text-center"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          height="40px"
          placeholder="Email"
          inputRef={emailTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              tpNumberTextFieldRef.current?.focus();
            }
          }}
        />
        <RoundTextbox
          className={"text-center"}
          value={tpNumber}
          onChange={(e) => setTpNumber(e.target.value)}
          height="40px"
          placeholder="TP Number"
          inputRef={tpNumberTextFieldRef}
        />
      </div>

      <div className="flex flex-row mt-5 space-x-3 ">
        <CustomButton
          onClick={handleSubjectUpsert}
          title="Add"
          backgroundColor="#333333"
          borderRadius={30}
          width="120px"
          height="40px"
        />
        {/* Add similar onClick handlers for the Delete and Clean buttons */}
        <CustomButton
          onClick={handleLecturerDelete}
          title="Delete"
          backgroundColor="#333333"
          borderRadius={30}
          width="100px"
          height="40px"
        />
      </div>
      <div className="mt-3">
        <CustomButton
          onClick={handleCleanTextBox}
          title="Clean"
          backgroundColor="#333333"
          borderRadius={30}
          width="230px"
          height="40px"
        />
      </div>
    </Box>
  );
};

export default AddLecturer;
