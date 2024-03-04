import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Dialog, IconButton } from "@mui/material";
import CustomButton from "../../../Components/Buttons/CutomButton/CustomButton";
import AddStudent from "./Add Student/AddStudent";
import axios from "axios";
import config from "../../../ipAddress";
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded";

const StudentsRegistration = () => {
  const localIp = config.localIp;
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentAllData, setStudentAllData] = useState([]);
  const [fetchDataTrigger, setFetchDataTrigger] = useState(true);
  const [initialStudentData, setInitialStudentData] = useState({});
  const [isNewStudent, setIsNewStudent] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${localIp}:8085/api/student/all`);
        
        // Add a unique id to each row
        const dataWithIds = response.data.map((row, index) => ({
          id: index + 1, // You can use a more appropriate id based on your data
          ...row,
        }));
    
        setStudentAllData(dataWithIds);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } 
    };
    

    // Fetch data when the component mounts
    fetchData();
  }, [localIp, fetchDataTrigger]);

  const handleOpenDialog = () => {
    setIsAddStudentOpen(true);
    setIsNewStudent(true);
  };

  const handleCloseDialog = () => {
    setIsAddStudentOpen(false);
    setFetchDataTrigger((prev) => !prev);
  };
  const handleOpenAddSubject = (rowData) => {
    setIsAddStudentOpen(true);
    setIsNewStudent(false);
    setInitialStudentData(rowData);
  };

  const columns = [
    {
      field: "student_registration_number",
      headerName: "S-REG",
      width: 150,
    },
    { field: "student_index_number", headerName: "S-Index", width: 100 },
    { field: "student_name", headerName: "Student Name", width: 200 },
    {
      field: "batch",
      headerName: "Batch",
      width: 100,
    },
    {
      field: "department",
      headerName: "Departments",
      width: 70,
    },
    { field: "address", headerName: "Address", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "tp_number", headerName: "TP", width: 130 },


    {
      field: "Actions_BillDelete",
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
    <div className={`flex flex-col ${isAddStudentOpen ? "blur-md" : ""} `}>
      <Box display="flex" justifyContent="flex-end">
        <CustomButton
          onClick={handleOpenDialog}
          title="Add Student"
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: "#333333",
            },
          }}
        >
          <DataGrid
            disableRowSelectionOnClick
            rows={studentAllData}
            columns={columns}
            autoPageSize
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </div>

      <Dialog
        open={isAddStudentOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: "15px",
            // Add other custom styles as needed
          },
        }}
      >
        <AddStudent
          onClose={handleCloseDialog}
          initialStudentData={initialStudentData}
          isNewStudent={isNewStudent}
        />
      </Dialog>
    </div>
  );
};

export default StudentsRegistration;
