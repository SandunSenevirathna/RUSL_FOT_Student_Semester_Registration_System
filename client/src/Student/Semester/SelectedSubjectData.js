// Assuming SelectedSubjectData.js file
let SelectedSubjectData = {};

const setSelectedSubjectData = (student_registration_number, subjects, semester) => {
  SelectedSubjectData = {
    student_registration_number,
    subjects,
    semester,
  };
};

const getSelectedSubjectData = () => SelectedSubjectData;

export { setSelectedSubjectData, getSelectedSubjectData };
