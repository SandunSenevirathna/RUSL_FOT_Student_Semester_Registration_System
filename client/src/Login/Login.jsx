import React,{useEffect} from 'react';
import { Box, Paper, Typography } from '@mui/material';
import RoundTextbox from '../Components/Textboxs/RoundTextbox';
import RoundButton from '../Components/Buttons/RoundButton';
import './Login.css'; // Import the CSS file

const Login = () => {


    useEffect(() => {
        // Add the style to disable scrolling on component mount
        document.documentElement.style.overflow = 'hidden';
        // Remove the style to enable scrolling on component unmount
        return () => {
          document.documentElement.style.overflow = 'auto';
        };
      }, []);


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="90vh"
    >
      <Paper elevation={3} className='login-paper' >

        <Box>
            <img
                src={'../../assets/RUSL_LOGO.png'}  // Replace this with the actual path to your image
                alt="RUSL Logo"
                style={{ width: '100px', height: 'auto' }}
            />
        </Box>

        <Box mt={2}>
            <Typography 
            variant='h6' 
            gutterBottom 
            style={{ fontFamily: 'Roboto, sans-serif', fontSize: '24px', fontWeight: 700, marginBottom: '0px'}}
            > 
                Welcome Back
            </Typography>
            <Typography 
            gutterBottom 
            style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 400, letterSpacing: '3px'}}
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
            <RoundButton label="Login" onClick={""} width="200px" />
        </Box>

        <Box mt={2}>
        <Typography 
            gutterBottom 
            style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', fontWeight: 400, marginTop:'20px'}}
            > 
                Dont't have an account ? <span style={{ fontWeight: 700}}>Sign up</span>
            </Typography>
        </Box>
        
        <Box mt={3}>
            <img
                src={'../../assets/Miracles Low.png'}  // Replace this with the actual path to your image
                alt="RUSL Logo"
                style={{ width: '80px', height: 'auto', margin: '10px 0 10px 0' }}
            />
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
