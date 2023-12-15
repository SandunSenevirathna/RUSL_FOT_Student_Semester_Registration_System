import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Dialog, DialogTitle } from "@mui/material";
import CustomButton from "../../../Components/Buttons/CutomButton/CustomButton";
import AddSubject from "./Add Subject/AddSubject";

const SubjectRegistration = () => {
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsAddSubjectOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddSubjectOpen(false);
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
    { field: "semester", headerName: "Semester", width: 200 },
  ];

  const rows = [];

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
          <DataGrid rows={rows} columns={columns} autoPageSize />
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
        <DialogTitle>Add Subject</DialogTitle>
        <AddSubject onClose={handleCloseDialog} />
      </Dialog>
    </div>
  );
};

export default SubjectRegistration;
