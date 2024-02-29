// Assuming loginData.js file
let loginData = {};

const setLoginData = (profileName, universityEmail, position, profile_photo) => {
  loginData = {
    profileName,
    universityEmail,
    position,
    profile_photo,
  };
};

const getLoginData = () => loginData;

export { setLoginData, getLoginData };
