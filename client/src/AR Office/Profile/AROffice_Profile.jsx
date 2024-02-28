import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import config from "../../ipAddress";
import axios from "axios";
import AddProfile from "./AddProfile";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import React, { useEffect, useState } from "react";
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

const AROffice_Profile = () => {
  const localIp = config.localIp;

  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`http://${localIp}:8085/api/ar_office_profile/all_profile_date`)
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
    };

    // Fetch data when the component mounts
    fetchData();
  }, [localIp, isAddProfileOpen]);

  const handelAddProfileOpen = () => {
    setIsAddProfileOpen(true);
  };
  const handelAddProfileClose = () => {
    setIsAddProfileOpen(false);
    setSelectedRow(null);
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
    setIsAddProfileOpen(true);
  };

  const columns = [
    { field: "profile_name", headerName: "Profile Name", width: 150 },
    { field: "university_email", headerName: "University Email", width: 250 },
    { field: "position", headerName: "Position", width: 180 },
    {
      field: "last_update_date",
      headerName: "Last Update Date",
      width: 150,
      renderCell: (params) => moment(params.value).format("YYYY-MM-DD"),
    },
    {
      field: "last_pdate_time",
      headerName: "Last Update Time",
      width: 150,
    },
    {
      flex: 0.5,
      headerName: "Select",
      renderCell: (params) => (
        <IconButton color="warning" onClick={() => handleSelectRow(params.row)} >
          <FastRewindRoundedIcon fontSize="large" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m={3}>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Box>
          <Typography sx={{ fontSize: 25, fontWeight: 600 }} gutterBottom>
            User Credentials & Profile Customization
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 3, mt: -1 }} gutterBottom>
            "Empower Your Experience with Personalized Settings"
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            endIcon={<PersonAddAlt1RoundedIcon />}
            onClick={handelAddProfileOpen}
          >
            Add Profile
          </Button>
        </Box>
      </Box>
      <Box>
        <div className="mt-2 items-center justify-center h-screen">
          <Box
            style={{ height: "75%", width: "auto" }}
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
            <DataGrid
              rows={rows}
              columns={columns}
              components={{
                Toolbar: () => (
                  <div>
                    <GridToolbar />
                  </div>
                ),
              }}
            />
          </Box>
        </div>
      </Box>
      <Dialog
        open={isAddProfileOpen}
        onClose={handelAddProfileClose}
        BackdropProps={{ sx: { backdropFilter: "blur(2px)" } }}
        PaperProps={{
          style: {
            borderRadius: "5px",
            // Add other custom styles as needed
          },
        }}
      >
        <AddProfile onClose={handelAddProfileClose} selectedRow={selectedRow} />
      </Dialog>
    </Box>
  );
};

export default AROffice_Profile;
