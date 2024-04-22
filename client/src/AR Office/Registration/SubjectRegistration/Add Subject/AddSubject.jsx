import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CustomButton from "../../../../Components/Buttons/CutomButton/CustomButton";
import RoundTextbox from "../../../../Components/Textboxs/RoundTextbox";
import axios from "axios";
import config from "../../../../ipAddress";

const AddSubject = ({ onClose, initialSubjectData, isNewSubject }) => {
  const localIp = config.localIp;

  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [credit, setCredit] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCompulsoryDepartments, setSelectedCompulsoryDepartments] =
    useState([]);
  const [selectedOptionalDepartments, setSelectedOptionalDepartments] =
    useState([]);

  const [departments, setDepartments] = useState([]);

  const subjectCodeTextFieldRef = React.useRef(null);
  const subjectNameTextFieldRef = React.useRef(null);
  const subjectCreditTextFieldRef = React.useRef(null);
  const CPTextFieldRef = React.useRef(null);
  const OPTextFieldRef = React.useRef(null);
  const semesterTextFieldRef = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${localIp}:8085/api/departments/all`
        );

        const departmentsWithId = (response.data || []).map((department) => ({
          departments_code: department.department_code,
          departments_name: department.department_name,
        }));

        setDepartments(departmentsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    };

    fetchData();
    subjectNameTextFieldRef.current?.focus();
  }, [localIp]);

  useEffect(() => {
    if (isNewSubject) {
      handleCleanTextBox();
    } else {
      setSubjectCode(initialSubjectData.subject_code || "");
      setSubjectName(initialSubjectData.subject_name || "");
      setCredit(initialSubjectData.credit || "");
      setSelectedSemester(initialSubjectData.semester || "");

      // Check if compulsory_departments is an array with a single element "---"
      setSelectedCompulsoryDepartments(
        Array.isArray(initialSubjectData.compulsory_departments) &&
          initialSubjectData.compulsory_departments.length === 1 &&
          initialSubjectData.compulsory_departments[0] === "---"
          ? []
          : initialSubjectData.compulsory_departments || []
      );

      // Check if optional_departments is an array with a single element "---"
      setSelectedOptionalDepartments(
        Array.isArray(initialSubjectData.optional_departments) &&
          initialSubjectData.optional_departments.length === 1 &&
          initialSubjectData.optional_departments[0] === "---"
          ? []
          : initialSubjectData.optional_departments || []
      );
    }
  }, [initialSubjectData]);

  const handleSelectCompulsoryDepartments = (selectedDepartments) => {
    setSelectedCompulsoryDepartments(selectedDepartments);
  };

  const handleSelectOptionalDepartments = (selectedDepartments) => {
    setSelectedOptionalDepartments(selectedDepartments);
  };

  const handleCleanTextBox = () => {
    setSubjectCode("");
    setSubjectName("");
    setCredit("");
    setSelectedSemester("");
    setSelectedCompulsoryDepartments([]);
    setSelectedOptionalDepartments([]);
    subjectCodeTextFieldRef.current?.focus();
  };

  const handleSubjectUpsert = async () => {
    try {
      // Validate credit value
      const creditValue = parseInt(credit);
      if (isNaN(creditValue) || creditValue < 0 || creditValue > 10) {
        alert("Credit value must be an integer between 0 and 10.");
        return;
      }
      // Validate subject code
      const subjectCodePattern = /^[A-Z]{3}\s\d{4}$/;
      if (!subjectCodePattern.test(subjectCode)) {
        alert(
          "Subject code must contain only uppercase letters (A-Z) and integers."
        );
        return;
      }

      // Validate subject name
      const subjectNamePattern = /^[A-Za-z\s]+$/;
      if (!subjectNamePattern.test(subjectName)) {
        alert("Subject name must contain only alphabetical characters (A-z).");
        return;
      }
      if (!subjectCode || !subjectName || !credit || !selectedSemester) {
        alert("SubjectCode, SubjectName, Credit, and Semester are required.");
        handleCleanTextBox();
        return;
      } else {
        const data = {
          subjectCode,
          subjectName,
          credit,
          compulsoryDepartments: selectedCompulsoryDepartments,
          optionalDepartments: selectedOptionalDepartments,
          semester: selectedSemester,
        };

        // Make a POST request to the new upsert endpoint
        const response = await axios.post(
          `http://${localIp}:8085/api/subject/upsert`,
          data
        );

        // Handle the response accordingly
        if (response.status === 201) {
          alert("Subject inserted successfully");
          handleCleanTextBox();
        } else if (response.status === 200) {
          alert("Subject updated successfully");
          handleCleanTextBox();
        }
      }
      // Construct the data object to be sent to the backend

      // Additional actions if needed
    } catch (error) {
      console.error("Error adding/updating subject:", error);
      // Handle the error as needed
    }
  };

  const handleSubjectDelete = async () => {
    try {
      // Validate subjectCode
      if (!subjectCode) {
        alert("SubjectCode is required for deletion.");
        return;
      }

      // Make a DELETE request to your backend API
      const response = await axios.delete(
        `http://${localIp}:8085/api/subject/delete?subjectCode=${subjectCode}`
      );

      alert(subjectCode, " Subject deleted successfully");
      handleCleanTextBox();
      // You can perform additional actions after a successful deletion
    } catch (error) {
      console.error("Error deleting subject:", error);
      // Handle the error as needed
    }
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
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          height="40px"
          placeholder="Subject Code"
          inputRef={subjectCodeTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              subjectNameTextFieldRef.current?.focus();
            }
          }}
        />

        <RoundTextbox
          className={"text-center"}
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          height="40px"
          placeholder="Subject Name"
          inputRef={subjectNameTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              subjectCreditTextFieldRef.current?.focus();
            }
          }}
        />

        <RoundTextbox
          className={"text-center"}
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          height="40px"
          placeholder="Credit"
          inputRef={subjectCreditTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              CPTextFieldRef.current?.focus();
            }
          }}
        />

        <Select
          multiple
          displayEmpty
          value={selectedCompulsoryDepartments}
          inputRef={CPTextFieldRef}
          onChange={(event) =>
            handleSelectCompulsoryDepartments(event.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              OPTextFieldRef.current?.focus();
            }
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <em style={{ color: "#A9A3AF" }}>Compulsory Departments</em>
              ); // Adjust the color as needed
            }

            return (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} sx={{ m: 0.5 }} />
                ))}
              </Box>
            );
          }}
          sx={{ borderRadius: "40px" }} // Adjust the value as needed
        >
          {/* Menu items for compulsory departments */}
          <MenuItem disabled value="">
            <em style={{ color: "red" }}>Compulsory Departments</em>
          </MenuItem>
          {departments &&
            departments.map((department) => (
              <MenuItem
                key={department.departments_code}
                value={department.departments_code}
              >
                {department.departments_code}
              </MenuItem>
            ))}
        </Select>

        <Select
          multiple
          displayEmpty
          value={selectedOptionalDepartments}
          inputRef={OPTextFieldRef}
          onChange={(event) =>
            handleSelectOptionalDepartments(event.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              e.stopPropagation();
              semesterTextFieldRef.current?.focus();
            }
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em style={{ color: "#A9A3AF" }}>Optional Departments</em>; // Adjust the color as needed
            }

            return (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} sx={{ m: 0.5 }} />
                ))}
              </Box>
            );
          }}
          sx={{ borderRadius: "40px" }} // Adjust the value as needed
        >
          {/* Menu items for optional departments */}
          <MenuItem disabled value="">
            <em style={{ color: "red" }}>Optional Departments</em>
          </MenuItem>
          {departments &&
            departments.map((department) => (
              <MenuItem
                key={department.departments_code}
                value={department.departments_code}
              >
                {department.departments_code}
              </MenuItem>
            ))}
        </Select>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="semester-label">Semester</InputLabel>
          <Select
            labelId="semester-label"
            id="semester-select"
            value={selectedSemester}
            inputRef={semesterTextFieldRef}
            onChange={(event) => setSelectedSemester(event.target.value)}
            label="Semester"
            sx={{ borderRadius: "40px", pl: 10 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "ArrowDown") {
                e.stopPropagation();
                handleSubjectUpsert();
              }
            }}
          >
            <MenuItem value="">
              <em style={{ color: "#A9A3AF" }}>Semester</em>
            </MenuItem>
            {["1.1", "1.2", "2.1", "2.2", "3.1", "3.2", "4.1", "4.2"].map(
              (semesterValue) => (
                <MenuItem key={semesterValue} value={semesterValue}>
                  {semesterValue}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
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
          onClick={() => {
            handleSubjectDelete();
          }}
          title="Delete"
          backgroundColor="#333333"
          borderRadius={30}
          width="100px"
          height="40px"
        />
      </div>
      <div className="mt-3">
        <CustomButton
          onClick={() => {
            handleCleanTextBox();
          }}
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

export default AddSubject;
