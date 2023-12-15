import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import Batches from '../Batches/Batches';
import DepartmentsRegistration from '../Departments/DepartmentsRegistration';
import SubjectRegistration from '../SubjectRegistration/SubjectRegistration';
import StudentsRegistration from '../Students/StudentsRegistration';


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const RegisterMenu = () => { // ========================<<< Start

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Batch " {...a11yProps(0)} />
                    <Tab label="Departments " {...a11yProps(1)} />
                    <Tab label="Subjects " {...a11yProps(2)} />
                    <Tab label="Students " {...a11yProps(3)} />
                    <Tab label="Lecturers " {...a11yProps(4)} />
                    <Tab label="Admin " {...a11yProps(5)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Batches />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <DepartmentsRegistration />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <SubjectRegistration />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <StudentsRegistration />
            </CustomTabPanel>
        </Box>
    );
}
export default RegisterMenu;