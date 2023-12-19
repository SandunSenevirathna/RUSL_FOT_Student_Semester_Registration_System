import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Dialog, IconButton } from "@mui/material";
import CustomButton from "../../../Components/Buttons/CutomButton/CustomButton";
import AddSubject from "./Add Subject/AddSubject";
import axios from "axios";
import config from "../../../ipAddress";
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded";

const SubjectRegistration = () => {
  const localIp = config.localIp;
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [subjectsAllData, setSubjectsAllData] = useState([]);
  const [fetchDataTrigger, setFetchDataTrigger] = useState(true);
  const [initialSubjectData, setInitialSubjectData] = useState({});
  const [isNewSubject, setIsNewSubject] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${localIp}:8085/api/subject/all`
        );

        const subjectsWithId = response.data.map((subject, index) => {
          // Split the comma-separated values into arrays
          const compulsoryDepartments = subject.compulsory_department
            ? subject.compulsory_department.split(",")
            : [];
          const optionalDepartments = subject.optional_department
            ? subject.optional_department.split(",")
            : [];

          // Check if arrays are empty or null and set "---" accordingly
          const compulsoryDepartmentsToShow =
            compulsoryDepartments.length > 0 ? compulsoryDepartments : ["---"];
          const optionalDepartmentsToShow =
            optionalDepartments.length > 0 ? optionalDepartments : ["---"];

          return {
            id: index + 1,
            subject_code: subject.subject_code,
            subject_name: subject.subject_name,
            credit: subject.credit,
            compulsory_departments: compulsoryDepartmentsToShow,
            optional_departments: optionalDepartmentsToShow,
            semester: subject.semester,
          };
        });

        setSubjectsAllData(subjectsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data when the component mounts
    fetchData();
  }, [localIp, fetchDataTrigger]);

  const handleOpenDialog = () => {
    setIsAddSubjectOpen(true);
    setIsNewSubject(true);
  };

  const handleCloseDialog = () => {
    setIsAddSubjectOpen(false);
    setFetchDataTrigger((prev) => !prev);
  };
  const handleOpenAddSubject = (rowData) => {
    setIsAddSubjectOpen(true);
    setIsNewSubject(false);
    setInitialSubjectData(rowData);

  };

  const columns = [
    { field: "subject_code", headerName: "Subject Code", width: 170 },
    { field: "subject_name", headerName: "Subject Name", width: 250 },
    { field: "credit", headerName: "Credit", width: 80 },
    {
      field: "compulsory_departments",
      headerName: "Compulsory Departments",
      width: 250,
    },
    {
      field: "optional_departments",
      headerName: "Optional Departments",
      width: 250,
    },
    { field: "semester", headerName: "Semester", width: 100 },

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
    <div className={`flex flex-col ${isAddSubjectOpen ? "blur-md" : ""} `}>
      <Box display="flex" justifyContent="flex-end">
        <CustomButton
          onClick={handleOpenDialog}
          title="Add Subject"
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
            rows={subjectsAllData}
            columns={columns}
            autoPageSize
          />
        </Box>
      </div>

      <Dialog
        open={isAddSubjectOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: "15px",
            // Add other custom styles as needed
          },
        }}
      >
        <AddSubject
          onClose={handleCloseDialog}
          initialSubjectData={initialSubjectData}
          isNewSubject= {isNewSubject}
        />
      </Dialog>
    </div>
  );
};

export default SubjectRegistration;
