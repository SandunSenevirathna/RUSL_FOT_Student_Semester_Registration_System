import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CustomButton from "../../../Components/Buttons/CutomButton/CustomButton";
import RoundTextbox from "../../../Components/Textboxs/RoundTextbox";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";
import config from "../../../ipAddress";

const Batches = () => {
  const localIp = config.localIp;
  const [batchName, setBatchName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatchRow, setSelectedBatchRow] = useState(null);
  const batchNameTextFieldRef = React.useRef(null);
  const enrollmentDateTextFieldRef = React.useRef(null);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
    batchNameTextFieldRef.current?.focus();

    // Add event listener for the Escape key press
    const handleEscapeKeyPress = (event) => {
      if (event.key === "Escape") {
        handleCleanTextBox();
      }
    };

    // Attach the event listener to the document
    document.addEventListener("keydown", handleEscapeKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://${localIp}:8085/api/batch/all`);

      // Add a unique identifier and format the date for each row
      const batchesWithId = response.data.map((batch, index) => ({
        id: index + 1, // You can use another logic to generate a unique identifier
        batch_name: batch.batch_name,
        enrollment_date: batch.enrollment_date.split("T")[0], // Extract the date portion
      }));

      setBatches(batchesWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function save() {
    try {
      // Check if batchName and enrollmentDate are not null and enrollmentDate is in the "yyyy-MM-dd" format
      if (
        batchName &&
        enrollmentDate &&
        /^[0-9]{4}\/[0-9]{4}$/.test(batchName) &&
        /^[0-9/-]+$/.test(enrollmentDate)
      ) {
        await axios.post(`http://${localIp}:8085/api/batch/insert`, {
          batch_name: batchName,
          enrollment_date: enrollmentDate,
        });

        // Alert and clean-up
        alert(`${batchName} Registration Successfully..✔`);
        handleCleanTextBox();

        // Fetch data after successful insertion
        fetchData();
      } else {
        alert("Invalid input. Please check batchName and enrollmentDate.");
        handleCleanTextBox();

      }
    } catch (err) {
      console.error("Error during batch insertion:", err);
      alert(`${batchName} Registration Failed`);
      handleCleanTextBox();

    }
  }

  const handleDeleteRow = async () => {
    console.log("handleDeleteRow function called");
    if (selectedBatchRow) {
      const { batch_name } = selectedBatchRow;

      try {
        await axios.delete(`http://${localIp}:8085/api/batch/deleteBatch`, {
          params: { batch_name },
        });
        console.log("Successfully deleted", batch_name, "batch");
        fetchData();
      } catch (error) {
        console.error("Error deleting:", error);
      } finally {
        setOpenDialog(false);
      }
    }
  };

  const handleBatchName = (event) => {
    const value = event.target.value;
    // Check if the value is empty or does not contain special characters
    if (value === "" || /^[0-9/-]+$/.test(value)) {
      setBatchName(value);
    }
  };

  const handleEnrollmentDate = (event) => {
    const value = event.target.value;
    // Check if the value is empty or does not contain special characters
    if (value === "" || /^[0-9/-]+$/.test(value)) {
      setEnrollmentDate(value);
    }
  };

  const handleCleanTextBox = () => {
    setBatchName("");
    setEnrollmentDate("");
    batchNameTextFieldRef.current?.focus();
  };

  const columns = [
    { field: "batch_name", headerName: "Batch Name", width: 150 },
    { field: "enrollment_date", headerName: "Enrollment Date", width: 150 },
    {
      field: "Actions_BillDelete",
      headerName: "Delete",
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => {
            console.log("Delete button clicked");
            setSelectedBatchRow(params.row);
            setOpenDialog(true);
          }}
        >
          <DeleteRoundedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div className={`flex flex-row space-x-32 ml-20 mr-20`}>
      <Box
        style={{ height: 500, width: "50%" }}
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
        <DataGrid disableRowSelectionOnClick rows={batches} columns={columns} />
      </Box>

      <Box
        ml={100}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <div className="flex flex-col space-y-5">
          <RoundTextbox
            className={"text-center"}
            value={batchName || ""}
            onChange={handleBatchName}
            height="40px"
            placeholder="Batch Name"
            inputRef={batchNameTextFieldRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                enrollmentDateTextFieldRef.current?.focus();
              }
              else if (e.key === "Escape") {
                e.stopPropagation();
               handleCleanTextBox();
              }
              else if (e.key === "ArrowDown") {
                e.stopPropagation();
                enrollmentDateTextFieldRef.current?.focus();
              }
            }}
          />
          <RoundTextbox
            className={"text-center"}
            value={enrollmentDate || ""}
            onChange={handleEnrollmentDate}
            height="40px"
            placeholder="Enrollment Date"
            inputRef={enrollmentDateTextFieldRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                save();
              }
              else if (e.key === "Esc") {
                e.stopPropagation();
               handleCleanTextBox();
              }
              else if (e.key === "ArrowUp") {
                e.stopPropagation();
                batchNameTextFieldRef.current?.focus();
              }
            }}
          />
        </div>

        <div className="flex flex-row mt-5 space-x-3 ">
          <CustomButton
            onClick={save}
            title="Add"
            backgroundColor="#333333"
            borderRadius={30}
            width="120px"
            height="40px"
          />
          <CustomButton
            onClick={handleCleanTextBox}
            title="clean"
            backgroundColor="#333333"
            borderRadius={30}
            width="120px"
            height="40px"
          />
        </div>
      </Box>

      {/* Step 3: Render the confirmation dialog box */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {selectedBatchRow && (
            <DialogContentText>
              Are you sure to delete :{" "}
              {selectedBatchRow ? selectedBatchRow.batch_name : ""}?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRow} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Batches;
