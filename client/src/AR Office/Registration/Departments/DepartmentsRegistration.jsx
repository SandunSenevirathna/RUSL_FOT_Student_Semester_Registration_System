import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import RoundTextbox from '../../../Components/Textboxs/RoundTextbox';
import CustomButton from '../../../Components/Buttons/CutomButton/CustomButton';

const DepartmentsRegistration = () => {

    const [departmentsCode, setDepartmentsCode] = useState(null);
    const [departmentsName, setDepartmentsName] = useState(null);

    const handleBatchName = () => {

    };
    const handleEnrollmentDate = () => {

    };

    const handleCleanTextBox = () => {

    };


    const columns = [
        { field: 'departments_code', headerName: 'D-C', width: 100 },
        { field: 'departments_name', headerName: 'Departments Name', width: 250 },
    ];

    const rows = [
        { id: 1, departments_code: 'BPT', departments_name: 'Bioprocess Technology' },
        { id: 2, departments_code: 'FDT', departments_name: 'Food Technology' },
        { id: 3, departments_code: 'EET', departments_name: 'Electrical & Electronic Technology' },
        { id: 4, departments_code: 'MTT', departments_name: 'Materials Technology' },
        { id: 5, departments_code: 'ITT', departments_name: 'Information and Telecommunication Technology' },
    ];

    return (
        <div className={`flex flex-row space-x-32 ml-20 mr-20`}>
            <Box style={{ height: 500, width: '45%' }}
                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#333333",
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        color: "white",
                    },

                }}>
                <DataGrid rows={rows} columns={columns} />
            </Box>

            <Box ml={100} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <div className="flex flex-col space-y-5">
                    <RoundTextbox className={'text-center'} value={departmentsCode || ''} onChange={handleBatchName} height="40px" placeholder="Department Code (D-C)" />
                    <RoundTextbox className={'text-center'} value={departmentsName || ''} onChange={handleEnrollmentDate} height="40px" placeholder="Department Name" />
                </div>

                <div className="flex flex-row mt-5 space-x-3 ">
                    <CustomButton
                        onClick={() => { }}
                        title="Add"
                        backgroundColor="#333333"
                        borderRadius={30}
                        width="120px"
                        height="40px"
                    />
                    <CustomButton
                        onClick={() => { }}
                        title="Delete"
                        backgroundColor="#333333"
                        borderRadius={30}
                        width="100px"
                        height="40px"
                    />
                </div>
                <div className="mt-3">
                    <CustomButton
                        onClick={() => { }}
                        title="clean"
                        backgroundColor="#333333"
                        borderRadius={30}
                        width="230px"
                        height="40px"
                    />
                </div>
            </Box>

        </div>
    );
};

export default DepartmentsRegistration;
