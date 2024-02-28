// Assuming loginData.js file
let loginData = {};

const setLoginData = (profileName, universityEmail, position) => {
  loginData = {
    profileName,
    universityEmail,
    position,
  };
};

const getLoginData = () => loginData;

export { setLoginData, getLoginData };
