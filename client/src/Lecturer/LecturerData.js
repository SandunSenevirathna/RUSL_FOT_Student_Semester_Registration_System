// Assuming LecturerData.js file SELECT `position`, `department` FROM `lecturer` WHERE `email`
let LecturerData = {};

const setLecturerData = (position, department) => {
  LecturerData = {
    position,
    department,
  };
};

const getLecturerData = () => LecturerData;

export { setLecturerData, getLecturerData };
