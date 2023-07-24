import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import RoundTextbox from '../Components/Textboxs/RoundTextbox';
import RoundButton from '../Components/Buttons/RoundButton';
import './LoginMain.css';

const LoginMain = () => {
  useEffect(() => {
    // Add the style to disable scrolling on component mount
    document.documentElement.style.overflow = 'hidden';
    // Remove the style to enable scrolling on component unmount
    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const loginEvent = () => {};

  return (
    <Box
      height="100vh" // Take up the full height of the viewport
      display="flex" // Use flexbox layout
      justifyContent="center" // Center horizontally
      alignItems="center" // Center vertically
    >
      <Paper
        elevation={3}
        className="login-paper"
        sx={{
            width: 900,
            height: 520,
            display: 'flex',
            padding: '1rem',
          }}
      >
        <Grid container>
          <Grid item xs={12} sm={7} className="left-grid">
            {/* Left Grid Content */}
            <Box
              height="100%" // Cover full height of the left section
              width="100%" // Cover full width of the left section
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <img
                src={'../../assets/LoginBackground.png'} // Replace this with the actual path to your image
                alt="RUSL Logo"
                style={{ width: '500px', height: 'auto' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} className="right-grid">
            {/* Right Grid Content */}
            <Box
              height="100%" // Cover full height of the right section
              width="100%" // Cover full width of the right section
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <Box>
                <img
                  src={'../../assets/RUSL_LOGO.png'} // Replace this with the actual path to your image
                  alt="RUSL Logo"
                  style={{ width: '80px', height: 'auto' }}
                />
              </Box>

              <Box mt={2}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '24px',
                    fontWeight: 700,
                    marginBottom: '0px',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  gutterBottom
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    letterSpacing: '3px',
                  }}
                >
                  Faculty of Technology
                </Typography>
              </Box>

              <Box mt={5}>
                <Box marginBottom="10px">
                  <RoundTextbox type="email" placeholder="Enter your email" />
                </Box>
                <Box marginBottom="20px">
                  <RoundTextbox type="password" placeholder="Enter your password" />
                </Box>
              </Box>

              <Box>
                <RoundButton label="Login" onClick={loginEvent} width="200px" />
              </Box>

              <Box mt={2}>
                <Typography
                  gutterBottom
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    marginTop: '20px',
                  }}
                >
                  Dont't have an account ? <span style={{ fontWeight: 700 }}>Sign up</span>
                </Typography>
              </Box>

              <Box mt={3}>
                <img
                  src={'../../assets/Miracles Low.png'} // Replace this with the actual path to your image
                  alt="RUSL Logo"
                  style={{ width: '80px', height: 'auto' }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LoginMain;
