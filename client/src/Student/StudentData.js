// Assuming StudentData.js file
let StudentData = {};

const setStudentData = (student_registration_number, student_index_number, batch, department) => {
    StudentData = {
    student_registration_number,
    student_index_number,
    batch,
    department,     
  };
};

const getStudentData = () => StudentData;

export { setStudentData, getStudentData };
