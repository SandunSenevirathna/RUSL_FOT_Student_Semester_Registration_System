import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
  Dialog,
} from "@mui/material";
import config from "../../ipAddress";
import axios from "axios";
import { getStudentData } from "../StudentData";
import { DataGrid } from "@mui/x-data-grid";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import FinalStep from "./FinalStep";
import { setSelectedSubjectData } from "./SelectedSubjectData";

const Student_Semester = () => {
  const localIp = config.localIp;
  const { student_registration_number, batch, department } = getStudentData();
  const [compulsorySubjects, setCompulsorySubjects] = useState([]);
  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [selectedOptionalSubjects, setSelectedOptionalSubjects] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [isAddBanckReceiptOpen, setIsAddBanckReceiptOpen] = useState(false);
  const [semester, setSemester] = useState("");
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false); // State to disable Next Button

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `http://${localIp}:8085/api/student/semester_registration/all_subjects`,
          {
            params: {
              batch,
              department,
            },
          }
        )
        .then((response) => {
          const subjects = response.data;
          const semester = subjects.length > 0 ? subjects[0].semester : null;
          const compulsorySubjectsData = subjects.filter(
            (subject) => subject.subject_type === "C"
          );
          const optionalSubjectsData = subjects.filter(
            (subject) => subject.subject_type === "O"
          );
  
          const compulsoryRowsWithId = compulsorySubjectsData.map(
            (row, index) => ({
              id: index + 1,
              ...row,
            })
          );
  
          setCompulsorySubjects(compulsoryRowsWithId);
          setOptionalSubjects(optionalSubjectsData);
          setSemester(semester);
  
          // Calculate total credit when subjects are fetched
          const total = compulsorySubjectsData.reduce(
            (acc, curr) => acc + curr.credit,
            0
          );
          setTotalCredit(total);
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
  
      // Check if data exists in registered_semester_data for the current semester and student registration number
      axios
        .get(
          `http://${localIp}:8085/api/student/semester_registration/check_registered_data`,
          {
            params: {
              student_registration_number,
              semester,
            },
          }
        )
        .then((response) => {
          const hasData = response.data.hasData;
          setIsNextButtonDisabled(hasData); // Disable Next Button if there is data
        })
        .catch((error) => {
          console.error("Error checking registered semester data:", error);
        });
    };
  
    // Call fetchData initially
    fetchData();
  
    // Set interval to fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 10000);
  
    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [localIp, batch, department, student_registration_number, semester]);
  

  const handleOptionalSubjectChange = (event, subjectCode, subjectCredit) => {
    const isChecked = event.target.checked;
    setSelectedOptionalSubjects((prevSelectedSubjects) => {
      const updatedSelectedSubjects = isChecked
        ? [...prevSelectedSubjects, subjectCode]
        : prevSelectedSubjects.filter(
            (selectedSubject) => selectedSubject !== subjectCode
          );
      const newTotalCredit = isChecked
        ? totalCredit + subjectCredit[subjectCode]
        : totalCredit - subjectCredit[subjectCode];
      setTotalCredit(newTotalCredit);
      return updatedSelectedSubjects;
    });
  };

  const handleNextStep = () => {
    const compulsorySubjectsData = compulsorySubjects.map((subject) => ({
      code: subject.subject_code,
      name: subject.subject_name,
    }));

    const optionalSubjectsData = optionalSubjects
      .filter((subject) =>
        selectedOptionalSubjects.includes(subject.subject_code)
      )
      .map((subject) => ({
        code: subject.subject_code,
        name: subject.subject_name,
      }));

    const subjectsData = [...compulsorySubjectsData, ...optionalSubjectsData];

    setSelectedSubjectData(student_registration_number, subjectsData, semester);

    handleAddBanckReceiptOpen();
  };

  const handleAddBanckReceiptOpen = () => {
    setIsAddBanckReceiptOpen(true);
  };

  const handleAddBanckReceiptClose = () => {
    setIsAddBanckReceiptOpen(false);
    setSelectedOptionalSubjects([]);

    const totalCompulsoryCredit = compulsorySubjects.reduce(
      (acc, subject) => acc + subject.credit,
      0
    );
    setTotalCredit(totalCompulsoryCredit);
  };

  const columns = [
    { field: "subject_code", headerName: "Subject Code", width: 100 },
    { field: "subject_name", headerName: "Subject Name", width: 300 },
    { field: "credit", headerName: "Credit", width: 100 },
  ];

  return (
    <Box m={3}>
      <Box>
        <Typography sx={{ fontSize: 30, fontWeight: 500 }}>
          {semester} Semester Registration
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 300 }}>
          Select Subjects and Register for Your Semester
        </Typography>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Box m={1}>
          <Typography sx={{ fontWeight: "500" }}>Compulsory Subject</Typography>
          <Box
            style={{ height: "400px", width: "100%" }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#333333",
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "white",
              },
              "& .MuiDataGrid-columnHeader-Type": {
                display: "none",
              },
            }}
          >
            <DataGrid
              rows={compulsorySubjects}
              columns={columns}
              autoPageSize
            />
          </Box>

          <Box
            ml={1}
            mt={2}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Typography sx={{ fontSize: 20, fontWeight: "700" }}>
              Total Credit: {totalCredit}
            </Typography>
            <Button
              sx={{ mr: 2.5 }}
              variant="contained"
              endIcon={<NavigateNextRoundedIcon />}
              onClick={handleNextStep}
              disabled={isNextButtonDisabled || compulsorySubjects.length === 0}  // Disable the Next Button if there is data
            >
              Next Step
            </Button>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ ml: 0 }} />
        <Box m={1}>
          <Typography sx={{ fontWeight: "500" }}>Optional Subject</Typography>
          <Box display={"flex"} flexDirection={"column"}>
            {optionalSubjects.map((subject) => (
              <FormControlLabel
                key={subject.subject_code}
                control={
                  <Checkbox
                    checked={selectedOptionalSubjects.includes(
                      subject.subject_code
                    )}
                    onChange={(event) =>
                      handleOptionalSubjectChange(
                        event,
                        subject.subject_code,
                        optionalSubjects.reduce((acc, obj) => {
                          acc[obj.subject_code] = obj.credit;
                          return acc;
                        }, {})
                      )
                    }
                  />
                }
                label={`${subject.subject_code} ${subject.subject_name} (${subject.credit} Credit)`}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Dialog
        open={isAddBanckReceiptOpen}
        onClose={handleAddBanckReceiptClose}
        PaperProps={{
          style: {
            borderRadius: "15px",
          },
        }}
      >
        <FinalStep onClose={handleAddBanckReceiptClose} />
      </Dialog>
    </Box>
  );
};

export default Student_Semester;
