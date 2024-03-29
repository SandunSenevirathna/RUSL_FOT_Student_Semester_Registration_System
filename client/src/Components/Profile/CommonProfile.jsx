import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Divider, Button, TextField } from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import AvatarEditor from "react-avatar-editor";
import { getLoginData } from "../../LoginData";
import { sha256 } from "js-sha256";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import config from "../../ipAddress";

const CommonProfile = () => {
  const localIp = config.localIp;

  const { universityEmail, position } = getLoginData();
  const [profileName, setProfileName] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [address, setAddress] = useState("");
  const [tpNumber, setTpNumber] = useState("");
  const [password, setPassword] = useState("");

  const [profilePicture, setProfilePicture] = useState(null);
  const editorRef = useRef();

  const navigate = useNavigate(); // Add the useNavigate hook to access the navigation function

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://${localIp}:8085/api/profile/get_profileData?universityEmail=${universityEmail}&position=${position}`
        );

        if (response.status === 200) {
          const {
            profileName,
            address,
            tpNumber,
            studentName,
            profilePhoto,
            lecturerName,
          } = response.data;

          // Set the profileName, address, tpNumber, and profilePicture based on the fetched data
          setProfileName(profileName);
          setAddress(address);
          setTpNumber(tpNumber);

          // If the position is "Student", use studentName; otherwise, use lecturerName
          if (position === "Student") {
            setUserFullName(studentName);
          } else {
            setUserFullName(lecturerName);
          }

          setProfilePicture(profilePhoto);
        } else {
          console.error("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error while fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [localIp, universityEmail, position]); // Include position as a dependency

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfilePhoto = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const croppedImage = canvas.toDataURL(); // Convert cropped image to Base64-encoded string
      try {
        // Send the Base64-encoded image string to the backend
        const response = await axios.post(
          `http://${localIp}:8085/api/profile/save_profile_photo`,
          {
            university_email: universityEmail,
            cropped_image: croppedImage,
          }
        );

        if (response.status === 200) {
          // Handle successful response
          console.log("Profile photo saved successfully.");
        } else {
          // Handle error response
          console.error("Failed to save profile photo.");
        }
      } catch (error) {
        // Handle fetch error
        console.error("Error while saving profile photo:", error);
      }
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSaveProfileData = async () => {
    const encryptedPassword = password ? sha256(password) : null;

    // Validation checks
    if (
      !profileName ||
      !address ||
      !tpNumber ||
      tpNumber.length !== 10 ||
      !position
    ) {
      console.error("Profile data is incomplete or invalid.");
      return; // Exit the function if data is incomplete or invalid
    }

    // Validate profile name
    const profileNamePattern = /^[A-Za-z]+\s[A-Za-z]+$/;
    if (!profileNamePattern.test(profileName)) {
      alert(
        "Profile name must consist of a first name followed by a space and then a last name."
      );
      return;
    }

    try {
      const updatedData = {
        university_email: universityEmail,
        profile_name: profileName,
        address: address,
        tp_number: tpNumber,
        password: encryptedPassword ? encryptedPassword : null,
        position: position, // Assuming position is obtained from somewhere else
      };

      const response = await axios.post(
        `http://${localIp}:8085/api/profile/update_profile_data`,
        updatedData
      );

      if (response.status === 200) {
        alert("Profile data updated successfully. Please Login again");
        setPassword("");
        navigate("/");
      } else {
        console.error("Failed to update profile data.");
      }
    } catch (error) {
      console.error("Error while updating profile data:", error);
    }
  };

  const handleClaer = () => {
    setProfileName("");
    setPassword("");
    setAddress("");
    setTpNumber("");
  };

  return (
    <Box m={3}>
      <Box>
        <Typography sx={{ fontSize: 30, fontWeight: 500 }}>Profile</Typography>
        <Typography>Tailor Your Profile: Customize with Ease</Typography>
      </Box>
      <Box mt={6} display="flex" flexDirection="row">
        <Box
          ml={6}
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {profilePicture ? (
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
              <AvatarEditor
                ref={editorRef}
                image={profilePicture}
                width={200}
                height={200}
                border={50}
                borderRadius={100}
                color={[255, 255, 255, 1]} // RGBA
                scale={1}
                rotate={0}
              />
            </Box>
          ) : (
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
              <Typography variant="body2" color="#AAAAAA">
                Nothing to Show
              </Typography>
            </Box>
          )}
          <Box mt={5} display="flex" alignItems="center">
            <input
              type="file"
              accept="image/*"
              id="upload-photo"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-photo">
              <Button
                sx={{ mr: 2.5 }}
                variant="contained"
                component="span"
                endIcon={<AddPhotoAlternateRoundedIcon />}
                color="warning"
              >
                Select
              </Button>
            </label>
            <Button
              onClick={handleSaveProfilePhoto}
              sx={{ ml: 2.5 }}
              variant="contained"
              endIcon={<SaveRoundedIcon />}
              color="success"
            >
              Save
            </Button>
          </Box>
          <Box sx={{ textAlign: "justify", mt: 5, maxWidth: "200px" }}>
            <Typography variant="body2" color="#AAAAAA">
              <span style={{ fontWeight: "bold" }}>
                Key Points for Profile Picture:{" "}
              </span>
              Image must be less than 2MB and clear. Use a single color
              background. Ensure you are wearing formal attire. Make sure the
              image includes enough of the top of your body.
            </Typography>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ ml: 10 }} />
        <Box ml={20} display="flex" flexDirection="column">
          <Box display="flex" flexDirection="column">
            <TextField
              id="profile-name"
              label="Profile Name"
              variant="outlined"
              style={{ marginBottom: "10px" }}
              value={profileName} // Bind profileName state variable
              onChange={(e) => setProfileName(e.target.value)} // Update profileName state on change
            />
            <TextField
              id="full-name"
              label="Full Name"
              variant="outlined"
              style={{ marginBottom: "10px" }}
              value={userFullName} // Bind universityEmail from login data
              disabled
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              style={{ marginBottom: "10px" }}
              value={universityEmail} // Bind universityEmail from login data
              disabled
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              style={{ marginBottom: "10px" }}
              type="password"
              value={password} // Bind address state variable
              onChange={handlePasswordChange}
              // Add password handling logic here if needed
            />
            <TextField
              id="address"
              label="Address"
              variant="outlined"
              style={{ marginBottom: "10px" }}
              value={address} // Bind address state variable
              onChange={(e) => setAddress(e.target.value)} // Update address state on change
            />
            <TextField
              id="tp-number"
              label="TP Number"
              variant="outlined"
              style={{ marginBottom: "10px" }}
              value={tpNumber} // Bind tpNumber state variable
              onChange={(e) => setTpNumber(e.target.value)} // Update tpNumber state on change
            />
          </Box>

          <Box mt={3} display="flex" alignItems="center">
            <Button
              sx={{ mr: 2.5 }}
              variant="contained"
              endIcon={<CleaningServicesRoundedIcon />}
              color="warning"
              onClick={handleClaer}
            >
              Clear
            </Button>
            <Button
              sx={{ ml: 2.5 }}
              variant="contained"
              endIcon={<SaveRoundedIcon />}
              color="success"
              onClick={handleSaveProfileData}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommonProfile;
