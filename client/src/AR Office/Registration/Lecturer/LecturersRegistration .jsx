import React from 'react';
import RoundTextbox from '../../../Components/Textboxs/RoundTextbox';
import './LecturersRegistration.css'; // You can create this CSS file if needed
import CustomButton from '../../../Components/Buttons/CutomButton/CustomButton';

const LecturersRegistration = ({ onClose, isLecturersRegistrationVisible }) => {

    const closeEvent = () => {
        setTimeout(() => {
            onClose();
        }, 100);
    }

    return (
        <div className={`popup ${isLecturersRegistrationVisible ? 'active' : ''}`}>
            <div className={`popup-content p-5 flex justify-center items-center`}>
                <div className="flex flex-col space-y-5">

                    <RoundTextbox height="40px" placeholder="Lecturer Name" />
                    <RoundTextbox height="40px" placeholder="Department Name" />
                    <RoundTextbox height="40px" placeholder="Lecturer Type" />
                    <RoundTextbox height="40px" placeholder="Email" />
                    <RoundTextbox height="40px" placeholder="Username" />
                    <RoundTextbox height="40px" placeholder="Password" type={'password'} />


                    {/* Add more input fields if necessary */}
                </div>

                <div className="flex flex-row mt-5 space-x-3">
                    <CustomButton
                        onClick={() => { /* Implement logic to add lecturer */ }}
                        title="Add Lecturer"
                        backgroundColor="#333333"
                        borderRadius={30}
                        width="120px"
                        height="40px"
                    />
                    <CustomButton
                        onClick={closeEvent}
                        title="Close"
                        backgroundColor="#333333"
                        borderRadius={30}
                        width="100px"
                        height="40px"
                    />
                </div>
            </div>
        </div>
    );
};

export default LecturersRegistration;
