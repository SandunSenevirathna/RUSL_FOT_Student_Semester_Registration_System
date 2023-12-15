import { Box } from "@mui/material";
import React, { useState } from "react";
import CustomButton from "../../../../Components/Buttons/CutomButton/CustomButton";
import RoundTextbox from "../../../../Components/Textboxs/RoundTextbox";

const AddSubject = ({ onClose }) => {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [credit, setCredit] = useState("");
  const [compulsoryDepartments, setCompulsoryDepartments] = useState("");
  const [optionalDepartments, setOptionalDepartments] = useState("");
  const [semester, setSemester] = useState("");

  const handleSubjectAdd = () => {
    // Handle subject add logic here
    // You can access the values using the state variables (subjectCode, subjectName, etc.)
  };

  return (
    <Box
      mt={5}
      ml={5}
      mr={5}
      mb={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      
    >
      <div className="flex flex-col space-y-5">
        <RoundTextbox
          className={"text-center"}
          value={subjectCode}
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value is empty or does not contain special characters
            if (value === '' || /^[a-zA-Z0-9]+$/.test(value)) {
              setSubjectCode(value);
            }
          }}
          height="40px"
          placeholder="Subject Code"
        />
        <RoundTextbox
          className={"text-center"}
          value={subjectName}
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value is empty or does not contain special characters
            if (value === '' || /^[a-zA-Z]+$/.test(value)) {
                setSubjectName(value);
            }
          }}
          height="40px"
          placeholder="Subject Name"
        />
        <RoundTextbox
          className={"text-center"}
          value={credit}
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value is a valid integer before updating the state
            if (/^\d*$/.test(value)) {
              setCredit(value);
            }
          }}
          height="40px"
          placeholder="Credit"
          
        />
        <RoundTextbox
          className={"text-center"}
          value={compulsoryDepartments}
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value is empty or does not contain special characters
            if (value === '' || /^[a-zA-Z]+$/.test(value)) {
                setCompulsoryDepartments(value);
            }
          }}
          height="40px"
          placeholder="Compulsory Departments"
        />
        <RoundTextbox
          className={"text-center"}
          value={optionalDepartments}
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value is empty or does not contain special characters
            if (value === '' || /^[a-zA-Z]+$/.test(value)) {
                setOptionalDepartments(value);
            }
          }}
          height="40px"
          placeholder="Optional Departments"
        />
        <RoundTextbox
          className={"text-center"}
          value={semester}
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value is empty or is a valid numeric input with an optional decimal part
            if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
              setSemester(value);
            }
          }}
          height="40px"
          placeholder="Semester"
        />
      </div>

      <div className="flex flex-row mt-5 space-x-3 ">
        <CustomButton
          onClick={handleSubjectAdd}
          title="Add"
          backgroundColor="#333333"
          borderRadius={30}
          width="120px"
          height="40px"
        />
        {/* Add similar onClick handlers for the Delete and Clean buttons */}
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
          title="Clean"
          backgroundColor="#333333"
          borderRadius={30}
          width="230px"
          height="40px"
        />
      </div>
    </Box>
  );
};

export default AddSubject;
