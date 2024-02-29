import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import config from "../../ipAddress";
import axios from "axios";
import { getStudentData } from "../StudentData";
import { DataGrid } from "@mui/x-data-grid";

const Student_Semester = () => {
  const localIp = config.localIp;
  const {
    student_registration_number,
    student_index_number,
    batch,
    department,
  } = getStudentData();
  const [compulsorySubjects, setCompulsorySubjects] = useState([]);
  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [selectedOptionalSubjects, setSelectedOptionalSubjects] = useState([]);

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
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, [localIp, batch, department]);

  const handleOptionalSubjectChange = (event, subjectCode) => {
    const isChecked = event.target.checked;
    setSelectedOptionalSubjects((prevSelectedSubjects) =>
      isChecked
        ? [...prevSelectedSubjects, subjectCode]
        : prevSelectedSubjects.filter(
            (selectedSubject) => selectedSubject !== subjectCode
          )
    );
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
          Semester Registration
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
          <Typography>Compulsory Subject</Typography>
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
        </Box>
        <Box m={1}>
          <Typography>Optional Subject</Typography>
          <Box>
            {optionalSubjects.map((subject) => (
              <FormControlLabel
                key={subject.subject_code}
                control={
                  <Checkbox
                    checked={selectedOptionalSubjects.includes(subject.subject_code)}
                    onChange={(event) =>
                      handleOptionalSubjectChange(event, subject.subject_code)
                    }
                  />
                }
                label={`${subject.subject_code} ${subject.subject_name} (${subject.credit} Credit)`}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Student_Semester;
