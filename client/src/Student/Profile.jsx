import React from 'react';

const Profile = () => {
  const user = {
    name: 'John Doe',
    age: 30,
    occupation: 'Web Developer',
    location: 'New York, USA',
    bio: 'I am a passionate web developer with a love for coding and creating awesome websites!',
    profilePic: 'https://example.com/profile-pic.jpg', // Replace with the actual URL of your profile picture
    socialLinks: {
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://www.linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <h1>{user.name}</h1>
        <p>{user.occupation}</p>
        <p>{user.location}</p>
      </div>
      <div className="profile-bio">
        <h2>About Me</h2>
        <p>{user.bio}</p>
      </div>
      <div className="profile-social">
        <h2>Connect with Me</h2>
        <ul>
          <li>
            <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </li>
          <li>
            <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
