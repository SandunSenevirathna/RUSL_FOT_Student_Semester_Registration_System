import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { getLecturerData } from "../LecturerData";
import axios from "axios";
import config
 from "../../ipAddress";
const Approve = () => {
  const localIp = config.localIp;

  const { position, department } = getLecturerData();

  useEffect(() => {
   
  }, [localIp]);

  return (
    <Box m={3}>
      <Box>
        <Typography sx={{ fontSize: 30, fontWeight: 500 }}>Approve</Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 300 }}>
          See which subjects students are registered for semesters and approve
          them
        </Typography>
        <Divider orientation="horizontal" flexItem sx={{ mt: 1, mb: 1 }} />
      </Box>
    </Box>
  );
};

export default Approve;
