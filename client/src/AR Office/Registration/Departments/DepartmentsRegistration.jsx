import React, { useState, useEffect } from "react";
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
import RoundTextbox from "../../../Components/Textboxs/RoundTextbox";
import CustomButton from "../../../Components/Buttons/CutomButton/CustomButton";
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded";
import axios from "axios";
import config from "../../../ipAddress";

const DepartmentsRegistration = () => {
  const localIp = config.localIp;
  const [departments, setDepartments] = useState([]);
  const [departmentsCode, setDepartmentsCode] = useState("");
  const [departmentsName, setDepartmentsName] = useState("");
  const [selectedDeparmentRow, setSelectedDeparmentRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const departmentCodeTextFieldRef = React.useRef(null);
  const departmentNameTextFieldRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
    departmentCodeTextFieldRef.current?.focus();

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
      setLoading(true);
      const response = await axios.get(
        `http://${localIp}:8085/api/departments/all`
      );

      // Check if response.data is null or undefined, and provide an empty array in that case
      const departmentsWithId = (response.data || []).map(
        (department, index) => ({
          id: index + 1,
          departments_code: department.department_code,
          departments_name: department.department_name,
        })
      );

      setDepartments(departmentsWithId);
      handleCleanTextBox();
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error gracefully, display a user-friendly message, or log to analytics
    } finally {
      setLoading(false);
    }
  };

  async function save() {
    try {
      // Check if departmentsCode contains numbers or symbols
      const containsNumbersOrSymbols = /[0-9!@#$%^&*(),.?":{}|<>]/.test(
        departmentsCode
      );
      if (containsNumbersOrSymbols) {
        alert("Department code should only contain letters.");
        return;
      }

      if (departmentsCode && departmentsName) {
        await axios.post(`http://${localIp}:8085/api/departments/upsert`, {
          department_code: departmentsCode,
          department_name: departmentsName,
        });

        // Alert and clean-up
        alert(`${departmentsName} Registration Successfully..✔`);

        // Fetch data after successful insertion or update
        fetchData();
      } else {
        alert("Invalid input. Please check department code and name.");
      }
    } catch (err) {
      console.error("Error during department upsert:", err);
      alert(`${departmentsName} Registration Failed`);
    }
  }

  const handleDelete = async () => {
    console.log("handleDelete function called");
    if (selectedDeparmentRow && selectedDeparmentRow.departments_code) {
      const { departments_code } = selectedDeparmentRow;

      try {
        await axios.delete(`http://${localIp}:8085/api/departments/delete`, {
          params: { department_code: departments_code },
        });
        console.log(
          `Successfully deleted department with code: ${departments_code}`
        );
        fetchData();
      } catch (error) {
        console.error("Error deleting department:", error);
      } finally {
        setOpenDialog(false);
      }
    }
  };

  const handleCleanTextBox = () => {
    setDepartmentsCode("");
    setDepartmentsName("");
    setSelectedDeparmentRow("");
    departmentCodeTextFieldRef.current?.focus();
  };

  const columns = [
    { field: "departments_code", headerName: "D-C", width: 100 },
    { field: "departments_name", headerName: "Departments Name", width: 250 },
    {
      field: "Actions_BillDelete",
      headerName: "Select",
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="warning"
          onClick={() => {
            console.log("Select button clicked");
            setSelectedDeparmentRow(params.row);
            setDepartmentsCode(params.row.departments_code);
            setDepartmentsName(params.row.departments_name);
            departmentNameTextFieldRef.current?.focus();
            departmentNameTextFieldRef.current?.select();
          }}
        >
          <FastRewindRoundedIcon />
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
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataGrid
            disableRowSelectionOnClick
            rows={departments}
            columns={columns}
          />
        )}
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
            value={departmentsCode}
            onChange={(e) => setDepartmentsCode(e.target.value)}
            height="40px"
            placeholder="Department Code (D-C)"
            inputRef={departmentCodeTextFieldRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "ArrowDown") {
                departmentNameTextFieldRef.current?.focus();
              } else if (e.key === "Escape") {
                handleCleanTextBox();
              } else if (e.key === "Delete") {
                setOpenDialog(true);
              }
            }}
          />
          <RoundTextbox
            className={"text-center"}
            value={departmentsName}
            onChange={(e) => setDepartmentsName(e.target.value)}
            height="40px"
            placeholder="Department Name"
            inputRef={departmentNameTextFieldRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                save();
              } else if (e.key === "Delete") {
                setOpenDialog(true);
              } else if (e.key === "ArrowUp") {
                departmentCodeTextFieldRef.current?.focus();
              } else if (e.key === "Escape") {
                handleCleanTextBox();
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
            onClick={() => setOpenDialog(true)}
            title="Delete"
            backgroundColor="#333333"
            borderRadius={30}
            width="100px"
            height="40px"
          />
        </div>
        <div className="mt-3">
          <CustomButton
            onClick={handleCleanTextBox}
            title="Clean"
            backgroundColor="#333333"
            borderRadius={30}
            width="230px"
            height="40px"
          />
        </div>
      </Box>

      {/* Step 3: Render the confirmation dialog box */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {selectedDeparmentRow && (
            <DialogContentText>
              Are you sure to delete :{" "}
              {selectedDeparmentRow
                ? selectedDeparmentRow.departments_name
                : ""}
              ?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DepartmentsRegistration;
