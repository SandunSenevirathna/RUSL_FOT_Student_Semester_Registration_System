import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Dialog, IconButton } from "@mui/material";
import CustomButton from "../../../Components/Buttons/CutomButton/CustomButton";
import AddLecturer from "./Add Lecturer/AddLecturer";
import axios from "axios";
import config from "../../../ipAddress";
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded";

const LecturersRegistration = () => {
  const localIp = config.localIp;
  const [isAddLecturerOpen, setIsAddLecturerOpen] = useState(false);
  const [lecturerAllData, setLecturerAllData] = useState([]);
  const [fetchDataTrigger, setFetchDataTrigger] = useState(true);
  const [initialLecturerData, setInitialLecturerData] = useState({});
  const [isNewLecturer, setIsNewLecturer] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${localIp}:8085/api/lecturer/all`);
        
        // Add a unique id to each row
        const dataWithIds = response.data.map((row, index) => ({
          id: index + 1, // You can use a more appropriate id based on your data
          ...row,
        }));
    
        setLecturerAllData(dataWithIds);
      } catch (error) {
        console.error("Error fetching lecturer data:", error);
      } 
    };
    

    // Fetch data when the component mounts
    fetchData();
  }, [localIp, fetchDataTrigger]);

  const handleOpenDialog = () => {
    setIsAddLecturerOpen(true);
    setIsNewLecturer(true);
  };

  const handleCloseDialog = () => {
    setIsAddLecturerOpen(false);
    setFetchDataTrigger((prev) => !prev);
  };
  const handleOpenAddSubject = (rowData) => {
    setIsAddLecturerOpen(true);
    setIsNewLecturer(false);
    setInitialLecturerData(rowData);
  };

  const columns = [
    {
      field: "lecturer_registration_number",
      headerName: "L-REG",
      width: 200,
    },
    { field: "lecturer_name", headerName: "Lecturer Name", width: 200 },
    {
      field: "position",
      headerName: "Position",
      width: 200,
    },
    {
      field: "department",
      headerName: "Departments",
      width: 100,
    },
    { field: "address", headerName: "Address", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "tp_number", headerName: "TP", width: 130 },


    {
      field: "Actions",
      headerName: "Select",
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="warning"
          onClick={() => handleOpenAddSubject(params.row)}
        >
          <FastRewindRoundedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div className={`flex flex-col ${isAddLecturerOpen ? "blur-md" : ""} `}>
      <Box display="flex" justifyContent="flex-end">
        <CustomButton
          onClick={handleOpenDialog}
          title="Add Lecturer"
          backgroundColor="#333333"
          borderRadius={10}
          width={130}
          height={40}
        />
      </Box>

      <div className="mt-2 items-center justify-center h-screen">
        <Box
          style={{ height: "80vh", width: "auto" }}
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
          <DataGrid
            disableRowSelectionOnClick
            rows={lecturerAllData}
            columns={columns}
            autoPageSize
          />
        </Box>
      </div>

      <Dialog
        open={isAddLecturerOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: "15px",
            // Add other custom styles as needed
          },
        }}
      >
        <AddLecturer
          onClose={handleCloseDialog}
          initialLecturerData={initialLecturerData}
          isNewLecturer={isNewLecturer}
        />
      </Dialog>
    </div>
  );
};

export default LecturersRegistration;
