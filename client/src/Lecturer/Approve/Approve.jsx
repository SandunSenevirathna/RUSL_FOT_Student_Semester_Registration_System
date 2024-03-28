import { Box, Button, Dialog, Divider, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getLecturerData } from "../LecturerData";
import { getLoginData } from "../../LoginData";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import config from "../../ipAddress";
import ViewMore from "./ViewMore";

const Approve = () => {
  const localIp = config.localIp;
  const [registrationData, setRegistrationData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState();
  const { position, department } = getLecturerData();
  const { universityEmail } = getLoginData();
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);
  const [selectedRegistrationNumber, setSelectedRegistrationNumber] =
    useState("");

  // Define custom styles
  const styles = {
    customCell: {
      fontSize: "16px", // Custom font size for cell
    },
  };

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const department = getLecturerData().department;

        const response = await axios.get(
          `http://${localIp}:8085/api/api/lecturerData/list_data_for_approve`,
          {
            params: {
              department: department,
            },
          }
        );

        console.log(response.data.comment);
        // Filter out the rows with comments
        const filteredData = response.data.filter((row) => !row.comment);

        const dataWithIds = filteredData.map((row, index) => ({
          id: index + 1,
          ...row,
        }));

        setRegistrationData(dataWithIds);
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchRegistrationData();
  }, [isViewMoreOpen, localIp]);

  const handleOpenViewMore = (registrationNumber, semester) => {
    setSelectedRegistrationNumber(registrationNumber);
    setSelectedSemester(semester); // This line sets the selected semester
    setIsViewMoreOpen(true);
  };

  const handleCloseViewMore = () => {
    setIsViewMoreOpen(false);
  };

  const columns = [
    {
      field: "student_registration_number",
      headerName: "Student Registration Number",
      width: 300,
    },
    { field: "student_index_number", headerName: "Index Number", width: 200 },
    { field: "semester", headerName: "Semester", width: 200 },
    {
      field: "Actions",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() =>
            handleOpenViewMore(
              params.row.student_registration_number,
              params.row.semester
            )
          }
        >
          View More
        </Button>
      ),
    },
  ];

  return (
    <Box m={3}>
      <Box>
        <Typography sx={{ fontSize: 30, fontWeight: 500 }}>Approve</Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 300 }}>
          See which subjects students are registered for semesters and approve
          them
        </Typography>
        <Divider orientation="horizontal" flexItem sx={{ mt: 1, mb: 1 }} />
      </Box>
      <Box
        style={{ height: "75vh", width: "auto" }}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#333333",
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "white",
            fontSize: "16px",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "#333333",
          },
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={registrationData}
          columns={columns.map((column) => ({
            ...column,
            cellClassName: "custom-cell", // Apply custom cell styles
          }))}
          autoPageSize
          slots={{ toolbar: GridToolbar }}
          sx={{
            "& .custom-cell": styles.customCell, // Apply custom cell styles
          }}
        />
      </Box>

      <Dialog
        open={isViewMoreOpen}
        onClose={handleCloseViewMore}
        BackdropProps={{
          sx: { backdropFilter: "blur(2px)" },
        }}
        PaperProps={{
          style: {
            borderRadius: "15px",
            // Add other custom styles as needed
          },
        }}
      >
        <ViewMore
          registrationNumber={selectedRegistrationNumber}
          semester={selectedSemester} // Passes the selected semester to ViewMore
          lecUniEmail={universityEmail}
          onClose={handleCloseViewMore}
        />
      </Dialog>
    </Box>
  );
};

export default Approve;
