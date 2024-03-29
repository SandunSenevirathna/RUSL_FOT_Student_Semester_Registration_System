import {
  Box,
  Button,
  Divider,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../ipAddress";
import moment from "moment";

const ViewMore = ({ registrationNumber,lecUniEmail, semester, onClose }) => {
  const localIp = config.localIp;
  const date = moment().format("YYYY-MM-DD");


  const [studentData, setStudentData] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Function to fetch student data including profile photo and subject data
    const fetchData = async () => {
      try {
        // Fetch student data
        const studentResponse = await axios.get(
          `http://${localIp}:8085/api/approve/view_more/getstudentData`,
          {
            params: {
              registrationNumber: registrationNumber,
            },
          }
        );
        setStudentData(studentResponse.data);

        // Fetch subject data
        const subjectResponse = await axios.get(
          `http://${localIp}:8085/api/approve/view_more/getSubjectData`,
          {
            params: {
              registrationNumber: registrationNumber,
            },
          }
        );
        setSubjectData(subjectResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [registrationNumber]);

  const handleApprove = async () => {
    setConfirmApproveOpen(true);
  };

  const handleReject = () => {
    setConfirmRejectOpen(true);
  };

  const handleConfirmApprove = async () => {
    try {
      await axios.post(`http://${localIp}:8085/api/approve/view_more/approveRegistration`, { registrationNumber });
      logApproval("YES", "");
      onClose();
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };

  const handleConfirmReject = async () => {
    try {
      if (comment) {
        await axios.post(`http://${localIp}:8085/api/approve/view_more/rejectRegistration`, { registrationNumber, comment, semester });
        logApproval("Rejected", comment);
      } else {
        console.log("No comment provided");
      }
      onClose();
    } catch (error) {
      console.error("Error rejecting registration:", error);
    }
  };

  const logApproval = async (approvalType, comment) => {
    try {
      await axios.post(`http://${localIp}:8085/api/approve/view_more/logApproval`, { registrationNumber,semester, lecUniEmail, approvalType, comment, date });
    } catch (error) {
      console.error("Error logging approval:", error);
    }
  };

  return (
    <Box m={3}>
      <Box>
        {studentData ? (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                border: "2px dotted #ccc",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {studentData.profile_photo ? (
                <img
                  src={`data:image/png;base64,${studentData.profile_photo}`}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
              ) : (
                <Typography variant="body2" color="#AAAAAA">
                  {registrationNumber}
                </Typography>
              )}
            </Box>
            <Box textAlign={"center"} mt={2}>
              <Typography variant="body1">
                {studentData.student_name}
              </Typography>
              <Typography variant="body1">{registrationNumber}</Typography>
              <Typography variant="body1">{studentData.batch}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
      <Divider orientation="horizontal" flexItem sx={{ mt: 1, mb: 1 }} />

      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb={2}>
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }} mb={1}>
            Subject Data in {semester}
          </Typography>
          {subjectData.length > 0 ? (
            <ul>
              {subjectData.map((subject, index) => (
                <li key={index} style={{}}>
                  • {subject.subject_code} {subject.subject_name}
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No subject data available.</Typography>
          )}
        </Box>
        <Box>
          <Button
            sx={{ marginRight: "20px" }}
            variant="contained"
            color="success"
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button variant="contained" color="error" onClick={handleReject}>
            Reject
          </Button>
        </Box>
      </Box>

      {/* Confirmation Dialog for Approve */}
      <Dialog
        open={confirmApproveOpen}
        onClose={() => setConfirmApproveOpen(false)}
        BackdropProps={{
          sx: { backdropFilter: "blur(2px)" },
        }}
      >
        <DialogTitle>Confirm Approve</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this registration?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmApprove} color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Reject */}
      <Dialog
        open={confirmRejectOpen}
        onClose={() => setConfirmRejectOpen(false)}
        BackdropProps={{
          sx: { backdropFilter: "blur(2px)" },
        }}
      >
        <DialogTitle>Confirm Reject</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this registration?
          </DialogContentText>
          <Box display="flex" alignItems="center">
            <TextField
              label="Comment (required)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRejectOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmReject} color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewMore;
