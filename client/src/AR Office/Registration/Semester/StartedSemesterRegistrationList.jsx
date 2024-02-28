import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import config from "../../../ipAddress";
import moment from "moment";

const StartedSemesterRegistrationList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://${config.localIp}:8085/api/Registration_Start_Data/list_started_semester_registration`
      )
      .then((response) => {
        const rowsWithId = response.data.map((row, index) => ({
          ...row,
          id: index,
        }));
        setRows(rowsWithId);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching started semester registrations:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const handleDeleteSemesterRegistration = (row) => {
    setSelectedRow(row);
    setOpenConfirmationDialog(true);
  };

  const confirmDeleteSemesterRegistration = () => {
    if (selectedRow) {
      const { batch_name, department_code, semester } = selectedRow;
      axios
        .post(
          `http://${config.localIp}:8085/api/Registration_Start_Data/delete_started_semester_registration`,
          {
            batch_name,
            department_code,
            semester,
          }
        )
        .then((response) => {
          // Refresh the data after successful deletion
          axios
            .get(
              `http://${config.localIp}:8085/api/Registration_Start_Data/list_started_semester_registration`
            )
            .then((response) => {
              const rowsWithId = response.data.map((row, index) => ({
                ...row,
                id: index,
              }));
              setRows(rowsWithId);
            })
            .catch((error) => {
              console.error(
                "Error fetching started semester registrations after deletion:",
                error
              );
            });
        })
        .catch((error) => {
          console.error("Error deleting started semester registration:", error);
        });
    }
    setOpenConfirmationDialog(false);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const columns = [
    { field: "batch_name", headerName: "Batch Name", width: 150 },
    { field: "department_code", headerName: "Department", width: 120 },
    { field: "semester", headerName: "Semester", width: 100 },
    {
      field: "registration_start_date",
      headerName: "Started Date",
      renderCell: (params) => moment(params.value).format("YYYY-MM-DD"),
      width: 150,
    },
    {
      field: "registration_end_date",
      headerName: "End Date",
      renderCell: (params) => moment(params.value).format("YYYY-MM-DD"),
      width: 150,
    },
    {
      field: "Actions",
      headerName: "Delete",
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteSemesterRegistration(params.row)}
        >
          <DeleteRoundedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      margin={2}
    >
      <Box style={{ height: "70%", width: "100%" }}>
        <Box display="flex" flexDirection={"row"}>
          <Typography
            sx={{ fontWeight: "bold", fontSize: 20, color: "#636363" }}
          >
            List of Started Registration
          </Typography>
        </Box>
        {loading ? ( // Display a loading message while data is being fetched
          <Typography>Loading...</Typography>
        ) : (
          <Box
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#333333",
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "white",
              },
              mt: 2,
            }}
          >
            <DataGrid  rows={rows} columns={columns}  />
          </Box>
        )}
      </Box>
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Typography>
              Are you sure you want to delete {selectedRow.batch_name} {selectedRow.department_code} registration?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>Cancel</Button>
          <Button onClick={confirmDeleteSemesterRegistration} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StartedSemesterRegistrationList;
