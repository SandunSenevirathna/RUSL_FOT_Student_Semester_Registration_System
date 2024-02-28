import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SemesterRegistration from "./SemesterRegistration";
import axios from "axios";
import config from "../../../ipAddress";
import StartedSemesterRegistrationList from "./StartedSemesterRegistrationList";

const Semester = () => {
  const localIp = config.localIp;

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isSemesterDataOk, setIsSemesterDataOk] = useState(false);
  const [isListOpenOK, setIsListOpenOK] = useState(false);


  useEffect(() => {
    // Fetch all batches from the backend when the component mounts
    const fetchBatches = async () => {
      try {
        const response = await axios.get(
          `http://${localIp}:8085/api/batch/all`
        );
        setBatches(response.data || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

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
    fetchBatches();
  }, [localIp]);

  const fetchSubject = async (selectedSemester) => {
    try {
      if (
        selectedBatch !== "" &&
        selectedDepartment !== "" &&
        selectedSemester !== ""
      ) {
        const response = await axios.get(
          `http://${localIp}:8085/api/subject/selectFromSemester/${selectedSemester}`
        );

        const selectedDepartments = selectedDepartment.split(","); // Splitting selected departments if multiple
        const updatedSubjects = response.data
          .filter((subject) => {
            const compulsoryDepartments =
              subject.compulsory_department.split(",");
            const optionalDepartments = subject.optional_department.split(",");
            return selectedDepartments.some(
              (dep) =>
                compulsoryDepartments.includes(dep) ||
                optionalDepartments.includes(dep)
            );
          })
          .map((subject) => {
            const compulsoryDepartments =
              subject.compulsory_department.split(",");
            const optionalDepartments = subject.optional_department.split(",");
            let subjectType = "";
            selectedDepartments.forEach((dep) => {
              if (compulsoryDepartments.includes(dep)) {
                subjectType = "C"; // Compulsory
              } else if (optionalDepartments.includes(dep)) {
                subjectType = "O"; // Optional
              }
            });
            return {
              ...subject,
              subject_type: subjectType,
              id: subject.subject_code,
            }; // Adding id property
          });
        setSubjects(updatedSubjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      throw error;
    }
  };

  const handleSemesterChange = (event) => {
    const selectedSemesterValue = event.target.value;
    setSelectedSemester(selectedSemesterValue);
  };

  const handleRegistrationStart = () => {
    if (
      selectedBatch !== "" &&
      selectedDepartment !== "" &&
      selectedSemester !== "" &&
      subjects.length > 0
    ) {
      setIsSemesterDataOk(true);

      /*console.log(
        "Current data in data grid:",
        subjects.map(
          ({ subject_code, subject_name, subject_type, credit }) => ({
            subject_code,
            subject_name,
            subject_type,
            credit,
          })
        )
      );*/
    } else {
      setIsSemesterDataOk(false);
    }
  };

  const handelListOpen = () =>{
    setIsListOpenOK(true);
  }

  const handleCloseDialog = () => {
    setIsSemesterDataOk(false);
    setIsListOpenOK(false);
    setSubjects([]);
    setSelectedBatch("");
    setSelectedDepartment("");
    setSelectedSemester("");
  };

  const columns = [
    { field: "subject_code", headerName: "Subject Code", width: 300 },
    { field: "subject_name", headerName: "Subject Name", width: 500 },
    { field: "credit", headerName: "Credit", width: 80 },
    { field: "subject_type", headerName: "Subject Type", width: 100 },
  ];

  return (
    <Box>
      <Box display={"flex"} alignItems="center">
        <Box>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel id="batch-label">Batch</InputLabel>
            <Select
              labelId="batch-label"
              id="batch-select"
              value={selectedBatch}
              onChange={(event) => setSelectedBatch(event.target.value)}
              label="Batch"
              //sx={{ borderRadius: "40px" }}
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
        </Box>

        <Box sx={{ marginLeft: 2 }}>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department-select"
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              label="Department"
              //sx={{ borderRadius: "40px" }}
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
        </Box>
        <Box>
          <FormControl size="small" sx={{ marginLeft: 2, width: 150 }}>
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select
              labelId="semester-label"
              id="semester-select"
              value={selectedSemester}
              onChange={handleSemesterChange} // Update the onChange handler
              //sx={{ borderRadius: "40px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "ArrowDown") {
                  e.stopPropagation();
                  // handleSubjectUpsert();
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
        </Box>

        <Box sx={{ marginLeft: 4 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => fetchSubject(selectedSemester)}
          >
            Find SUbjects
          </Button>
        </Box>

        <Box sx={{ marginLeft: 2 }}>
          <Button
            variant="contained"
            color="warning"
            size="large"
            disabled={isSemesterDataOk}
            onClick={handleRegistrationStart} // Update the onClick event handler
          >
            Registration Start
          </Button>
        </Box>

        <Box sx={{ marginLeft: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handelListOpen} // Update the onClick event handler
          >
             List
          </Button>
        </Box>

      </Box>

      <div className="mt-2 items-center justify-center h-screen">
        <Box
          style={{ height: "70%", width: "100%" }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#333333",
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "white",
            },
          }}
        >
          <DataGrid rows={subjects} columns={columns} autoPageSize />
        </Box>
      </div>

      <Dialog
        open={isSemesterDataOk}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: "15px",
            // Add other custom styles as needed
          },
        }}
      >
        <SemesterRegistration
          onClose={handleCloseDialog}
          batch={selectedBatch}
          department={selectedDepartment}
          semester={selectedSemester}
          filteredSubjects={subjects.map(
            ({ subject_code, subject_name, subject_type, credit }) => ({
              subject_code,
              subject_name,
              subject_type,
              credit,
            })
          )}
        />
      </Dialog>

      <Dialog
        open={isListOpenOK}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: "10px",
            // Add other custom styles as needed
          },
        }}
      >
        <StartedSemesterRegistrationList
          onClose={handleCloseDialog}
          
        />
      </Dialog>
    </Box>
  );
};

export default Semester;
