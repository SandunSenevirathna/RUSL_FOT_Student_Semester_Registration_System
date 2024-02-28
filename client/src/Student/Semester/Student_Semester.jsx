import { Box, Typography } from "@mui/material";
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

  useEffect(() => {
  axios
    .get(`http://${localIp}:8085/api/student/semester_registration/compulsory_subjects`, {
      params: {
        batch,
        department,
      },
    })
    .then((response) => {
      // Add a unique id to each row
      const rowsWithId = response.data.map((row, index) => ({
        id: index + 1, // Assuming index + 1 is unique, you can use any other unique identifier
        ...row,
      }));
      setCompulsorySubjects(rowsWithId);
      console.log(compulsorySubjects)
    })
    .catch((error) => {
      console.error("Error fetching compulsory subjects:", error);
    });
}, [localIp, batch, department]);

  

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

      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
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
            }}
          >
            <DataGrid rows={compulsorySubjects} columns={columns} autoPageSize />
          </Box>
        </Box>
        <Box m={1}>
          <Typography>Optional Subject</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Student_Semester;
