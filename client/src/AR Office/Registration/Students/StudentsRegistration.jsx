import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import RoundTextbox from "../../../Components/Textboxs/RoundTextbox";
import CustomButton from "../../../Components/Buttons/CutomButton/CustomButton";

const StudentsRegistration = () => {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentBatch, setStudentBatch] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("");

  const columns = [
    { field: "student_id", headerName: "S-ID", width: 200 },
    { field: "student_name", headerName: "Student Name", width: 250 },
    { field: "student_batch", headerName: "Batch", width: 70 },
    { field: "student_department", headerName: "Department", width: 100 },
    { field: "student_address", headerName: "Address", width: 200 },
    { field: "student_tp", headerName: "TP Number", width: 100 },
  ];

  const rows = [
    {
      id:1,
      student_id: "ITT-1819-079",
      student_name: "W.A.M.S.S.Senevirathna",
      student_batch: "18/19",
      student_department: "ITT",
      student_address: "Konaragama, Ehetuwewa, Galgamuwa",
      student_tp: '0774941002',
    },
    {
      id:2,
      student_id: "ITT-1819-078",
      student_name: "W.A.M.S.S.Senevirathna",
      student_batch: "18/19",
      student_department: "ITT",
      student_address: "Konaragama, Ehetuwewa, Galgamuwa",
      student_tp: '0774941002',
    },
    {
      id:3,
      student_id: "ITT-1819-072",
      student_name: "W.A.M.S.S.Senevirathna",
      student_batch: "18/19",
      student_department: "ITT",
      student_address: "Konaragama, Ehetuwewa, Galgamuwa",
      student_tp: '0774941002',
    },
    {
      id:4,
      student_id: "ITT-1819-074",
      student_name: "W.A.M.S.S.Senevirathna",
      student_batch: "18/19",
      student_department: "ITT",
      student_address: "Konaragama, Ehetuwewa, Galgamuwa",
      student_tp: '0774941002',
    },
    {
      id:5,
      student_id: "ITT-1819-073",
      student_name: "W.A.M.S.S.Senevirathna",
      student_batch: "18/19",
      student_department: "ITT",
      student_address: "Konaragama, Ehetuwewa, Galgamuwa",
      student_tp: '0774941002',
    },
  ];

  return (
    <div className={`flex flex-row space-x-32 ml-5 mr-5`}>
      <Box
        style={{ height: 500, width: "60%" }}
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
        <DataGrid rows={rows} columns={columns} />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <div className="flex flex-col space-y-5">
          <RoundTextbox
            className={"text-center"}
            value={studentId || ""}
            onChange={() => {}}
            height="40px"
            placeholder="Student ID"
          />
          <RoundTextbox
            className={"text-center"}
            value={studentName || ""}
            onChange={() => {}}
            height="40px"
            placeholder="Student Name"
          />
          <RoundTextbox
            className={"text-center"}
            value={studentBatch || ""}
            onChange={() => {}}
            height="40px"
            placeholder="Batch"
          />
          <RoundTextbox
            className={"text-center"}
            value={studentDepartment || ""}
            onChange={() => {}}
            height="40px"
            placeholder="Department"
          />
        </div>

        <div className="flex flex-row mt-5 space-x-3 ">
          <CustomButton
            onClick={() => {}}
            title="Add"
            backgroundColor="#333333"
            borderRadius={30}
            width="120px"
            height="40px"
          />
          <CustomButton
            onClick={() => {}}
            title="Delete"
            backgroundColor="#333333"
            borderRadius={30}
            width="100px"
            height="40px"
          />
        </div>
        <div className="mt-3">
          <CustomButton
            onClick={() => {}}
            title="clean"
            backgroundColor="#333333"
            borderRadius={30}
            width="230px"
            height="40px"
          />
        </div>
      </Box>
    </div>
  );
};

export default StudentsRegistration;
