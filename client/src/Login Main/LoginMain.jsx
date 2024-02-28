import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, Box } from "@mui/material";
import RoundTextbox from "../Components/Textboxs/RoundTextbox";
import RoundButton from "../Components/Buttons/RoundButton";
import "./LoginMain.css";
import { setLoginData } from '../LoginData';
import config from "../ipAddress";
import axios from "axios";
import { sha256 } from 'js-sha256';


const LoginMain = () => {
  const localIp = config.localIp;


  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [university_email, setUniversity_email] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Add the style to disable scrolling on component mount
    document.documentElement.style.overflow = "hidden";
    // Remove the style to enable scrolling on component unmount
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    // Function to focus on the email input when the component is mounted
    const focusEmailInput = () => {
      if (emailRef.current) {
        emailRef.current.focus();
      }
    };

    // Call the function on component mount
    focusEmailInput();
  }, []);

  const handleEmailChange = (event) => {
    setUniversity_email(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Function to encrypt the password (replace this with your encryption logic)
  const encryptPassword = (password) => {
    // Example: SHA256 encryption
    return sha256(password);
  };

  const loginEvent = () => {
    // Check if both email and password are filled out
    if (!university_email || !password) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Validate email format
    if (!isValidEmail(university_email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    // Encrypt the password before sending it to the server
    const encryptedPassword = encryptPassword(password);
  
    // Send the login request to the server
    axios
      .post(`http://${localIp}:8085/api/login/main_login`, {
        university_email,
        password: encryptedPassword,
      })
      .then((response) => {
        // Check if the login was successful
        if (response.data.success) {
         const { profile_name, university_email, position } = response.data;
         setLoginData(profile_name, university_email, position);
         
         
          navigate('/Main_Menu');
        } else {
          // Display an error message to the user
          alert("Incorrect email or password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        // Display a generic error message to the user
        alert("Oops! Something went wrong while logging in. Please try again later.");
      });


     // navigate('/Main_Menu');
  };
  
  
  
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
          display: "flex",
          padding: "1rem",
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
                src={"../../assets/LoginBackground.png"} // Replace this with the actual path to your image
                alt="RUSL Logo"
                style={{ width: "500px", height: "auto" }}
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
                  src={"../../assets/RUSL_LOGO.png"} // Replace this with the actual path to your image
                  alt="RUSL Logo"
                  style={{ width: "80px", height: "auto" }}
                />
              </Box>

              <Box mt={2}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    marginBottom: "0px",
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  gutterBottom
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "3px",
                  }}
                >
                  Faculty of Technology
                </Typography>
              </Box>

              <Box mt={5}>
                <Box marginBottom="10px">
                  <RoundTextbox
                    ref={emailRef}
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleEmailChange}
                  />
                </Box>
                <Box marginBottom="20px">
                  <RoundTextbox
                    type="password"
                    placeholder="Enter your password"
                    onChange={handlePasswordChange}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        loginEvent();
                      }
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <RoundButton label="Login" onClick={loginEvent} width="200px" />
              </Box>

              <Box mt={2}>
                <Typography
                  gutterBottom
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "12px",
                    fontWeight: 400,
                    marginTop: "20px",
                  }}
                >
                  Dont't have an account ?{" "}
                  <span style={{ fontWeight: 700 }}>Sign up</span>
                </Typography>
              </Box>

              <Box mt={3}>
                <img
                  src={"../../assets/Miracles Low.png"} // Replace this with the actual path to your image
                  alt="RUSL Logo"
                  style={{ width: "80px", height: "auto" }}
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
