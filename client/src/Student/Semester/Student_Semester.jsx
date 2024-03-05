import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
  Dialog,
} from "@mui/material";
import React, { useState, useEffect } from "react";
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
  const [totalCredit, setTotalCredit] = useState(0); // State to hold the total credit
  const [isAddBanckReceiptOpen, setIsAddBanckReceiptOpen] = useState(false);
  const [semester, setSemester] = useState("");

  //console.log(`Student Semester Page ${batch} and ${department}`);

  useEffect(() => {
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
  }, [localIp, batch, department]);

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
    // Get current date using moment

    // Extract subject codes and names from compulsory subjects
    const compulsorySubjectsData = compulsorySubjects.map((subject) => ({
      code: subject.subject_code,
      name: subject.subject_name,
    }));

    // Extract subject codes and names from selected optional subjects
    const optionalSubjectsData = optionalSubjects
      .filter((subject) =>
        selectedOptionalSubjects.includes(subject.subject_code)
      )
      .map((subject) => ({
        code: subject.subject_code,
        name: subject.subject_name,
      }));

    // Combine compulsory and optional subjects data
    const subjectsData = [...compulsorySubjectsData, ...optionalSubjectsData];

    // Save data to SelectedSubjectData.js
    setSelectedSubjectData(student_registration_number, subjectsData, semester);

    handleAddBanckReceiptOpen();
  };

  const handleAddBanckReceiptOpen = () => {
    setIsAddBanckReceiptOpen(true);
  };

  const handleAddBanckReceiptClose = () => {
    setIsAddBanckReceiptOpen(false);
    setSelectedOptionalSubjects([]);
  
    // Calculate the total credit for compulsory subjects
    const totalCompulsoryCredit = compulsorySubjects.reduce(
      (acc, subject) => acc + subject.credit,
      0
    );
    
    // Set the total credit state to the sum of compulsory subjects
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
            // Add other custom styles as needed
          },
        }}
      >
        <FinalStep onClose={handleAddBanckReceiptClose} />
      </Dialog>
    </Box>
  );
};

export default Student_Semester;
