import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import axios from "axios";
import config from "../../ipAddress";
import { DataGrid } from "@mui/x-data-grid";
import AttendanceReport from "./AttendanceReport";

const Subject_Register_Student_Report = () => {
  const localIp = config.localIp;

  const [selectedBatch, setSelectedBatch] = useState("");
  const [batches, setBatches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isFindDataButtonDisabled, setIsFindDataButtonDisabled] =
    useState(true);
  const [students, setStudents] = useState([]);
  const [printReport, setPrintReport] = useState(false);
  const [reportDataObject, setReportDataObject] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (selectedDepartment !== "" && selectedSemester !== "") {
          const response = await axios.get(
            `http://${localIp}:8085/api/subject/selectFromSemesterAndDepartment/${selectedSemester}&${selectedDepartment}`
          );
          setSubjects(response.data);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [localIp, selectedSemester, selectedDepartment]);

  const handleFindDataButton = async () => {
    try {
      const response = await axios.get(
        `http://${localIp}:8085/api/students/fetchByRegistrationAndSubject`,
        {
          params: {
            registrationNumber: selectedBatch, // Use selected batch as registration number filter
            subject_code: selectedSubject,
            semester: selectedSemester,
          },
        }
      );

      // Extract student data from the response and update state
      // Add a unique id to each row
      const dataWithIds = response.data.map((student, index) => ({
        id: student.student_registration_number, // Assuming student_registration_number is unique
        ...student,
      }));

      // Update state with the fetched student data
      setStudents(dataWithIds);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handlePrintButton = async () => {
    try {
      // Create the reportDataObject with the selected subject name, subject code, department, and batch
      const reportDataObject = {
        subject_name:
          subjects.find((subject) => subject.subject_code === selectedSubject)
            ?.subject_name || "",
        subject_code: selectedSubject,
        department: selectedDepartment,
        batch: selectedBatch,
        students: students,
      };

      ///console.log("Report Data:", reportDataObject);
      // Set reportDataObject state
      setReportDataObject(reportDataObject);

      // Set printReport state to true to render the AttendanceReport component
      setPrintReport(true);
    } catch (error) {
      console.error("Error while preparing report data:", error);
    }
  };

  const columns = [
    {
      field: "student_registration_number",
      headerName: "Student Registration",
      width: 300,
    },
    { field: "student_index_number", headerName: "Student Index", width: 300 },
    { field: "student_name", headerName: "Student Name", width: 300 },
  ];

  return (
    <Box m={3}>
      <Box>
        <Typography sx={{ fontSize: 30, fontWeight: 500 }}>Reports</Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 300 }}>
          Find and get a report about who is already registered
        </Typography>
        <Divider orientation="horizontal" flexItem sx={{ mt: 1, mb: 1 }} />
      </Box>

      <Box display={"flex"} flexDirection={"row"}>
        <Box>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel id="batch-label">Batch</InputLabel>
            <Select
              labelId="batch-label"
              id="batch-select"
              value={selectedBatch}
              onChange={(event) => setSelectedBatch(event.target.value)}
              label="Batch"
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

        {/* Department Select */}
        <Box sx={{ marginLeft: 3 }}>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department-select"
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              label="Department"
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

        {/* Semester Select */}
        <Box sx={{ marginLeft: 3 }}>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select
              labelId="semester-label"
              id="semester-select"
              value={selectedSemester}
              onChange={(event) => setSelectedSemester(event.target.value)}
              label="Semester"
            >
              <MenuItem value="">
                <em style={{ color: "#A9A3AF" }}>Select Semester</em>
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

        {/* Subject Select */}
        <Box sx={{ marginLeft: 3 }}>
          <FormControl size="small" sx={{ width: 250 }}>
            <InputLabel id="subject-label">Subject</InputLabel>
            <Select
              labelId="subject-label"
              id="subject-select"
              value={selectedSubject}
              onChange={(event) => {
                setSelectedSubject(event.target.value);
                setIsFindDataButtonDisabled(false);
              }}
              label="Subject"
            >
              <MenuItem value="">
                <em style={{ color: "#A9A3AF" }}>Select Subject</em>
              </MenuItem>
              {subjects.map((subject) => (
                <MenuItem
                  key={subject.subject_code}
                  value={subject.subject_code}
                >
                  {subject.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Find Data Button */}
        <Box sx={{ marginLeft: 5 }}>
          <Button
            variant="contained"
            size="large"
            disabled={isFindDataButtonDisabled}
            onClick={handleFindDataButton}
          >
            Find
          </Button>
        </Box>

        <Box sx={{ marginLeft: 2 }}>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={handlePrintButton}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Data Grid */}
      <Box>
        <div className="mt-2 items-center justify-center h-screen">
          <Box
            style={{ height: "70vh", width: "auto" }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#333333",
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "white",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#333333",
              },
            }}
          >
            <DataGrid columns={columns} rows={students} autoPageSize />
          </Box>
        </div>
      </Box>
      {printReport && (
        <div style={{ display: "none" }}>
          {console.log("Report Data:", reportDataObject)}
          <AttendanceReport reportData={reportDataObject} shouldPrint={true} />
        </div>
      )}
    </Box>
  );
};

export default Subject_Register_Student_Report;
