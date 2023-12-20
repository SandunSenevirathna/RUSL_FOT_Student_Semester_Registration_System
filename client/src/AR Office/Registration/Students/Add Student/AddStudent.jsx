import React, { useState, useEffect } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CustomButton from "../../../../Components/Buttons/CutomButton/CustomButton";
import RoundTextbox from "../../../../Components/Textboxs/RoundTextbox";
import axios from "axios";
import config from "../../../../ipAddress";

const AddStudent = ({ onClose, initialStudentData, isNewStudent }) => {
  const localIp = config.localIp;

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [tpNumber, setTpNumber] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const registrationNumberTextFieldRef = React.useRef(null);
  const indexNumberTextFieldRef = React.useRef(null);
  const nameTextFieldRef = React.useRef(null);
  const addressTextFieldRef = React.useRef(null);
  const emailTextFieldRef = React.useRef(null);
  const tpNumberTextFieldRef = React.useRef(null);

  useEffect(() => {
    // Fetch all batches from the backend when the component mounts
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`http://${localIp}:8085/api/batch/all`);
        setBatches(response.data || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    // Fetch all departments from the backend when the component mounts
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`http://${localIp}:8085/api/departments/all`);
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchBatches();
    fetchDepartments();
  }, [localIp]);

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
          placeholder="S-REG {ITT-1819-079}"
          inputRef={registrationNumberTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              indexNumberTextFieldRef.current?.focus();
            }
          }}
        />

        <RoundTextbox
          className={"text-center"}
          value={indexNumber}
          onChange={(e) => setIndexNumber(e.target.value)}
          height="40px"
          placeholder="S-Index {1036}"
          inputRef={indexNumberTextFieldRef}
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
          placeholder="Student Name"
          inputRef={nameTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              addressTextFieldRef.current?.focus();
            }
          }}
        />
        <FormControl size="small">
          <InputLabel id="batch-label" sx={{ textAlign: "center", mb: 1 }}>
            Batch
          </InputLabel>
          <Select
            labelId="batch-label"
            id="batch-select"
            value={selectedBatch}
            onChange={(event) => setSelectedBatch(event.target.value)}
            label="Batch"
            sx={{ borderRadius: "40px", pl: 10 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "ArrowDown") {
                e.stopPropagation();
                // handle Add, Delete, or Clean accordingly
              }
            }}
          >
            <MenuItem value="">
              <em style={{ color: "#A9A3AF" }}>Select Batch</em>
            </MenuItem>
            {batches.map((batch) => (
              <MenuItem key={batch.batch_name} value={batch.batch_name}>
                {batch.batch_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel
            id="department-label"
            sx={{ textAlign: "center", mb: 1 }}
          >
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
              <MenuItem key={department.department_code} value={department.department_code}>
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
          onClick={() => {}}
          title="Add"
          backgroundColor="#333333"
          borderRadius={30}
          width="120px"
          height="40px"
        />
        {/* Add similar onClick handlers for the Delete and Clean buttons */}
        <CustomButton
          onClick={() => {}}
          title="Delete"
          backgroundColor="#333333"
          borderRadius={30}
          width="100px"
          height="40px"
        />
      </div>
      <div className="mt-3">
        <CustomButton
          onClick={() => {}}
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

export default AddStudent;
