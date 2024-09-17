import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserProfile.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://scaleupapp.club/api/users/profiles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // assuming token is stored in local storage
          }
        });
        setProfile(response.data); // Update to expect the full response, not just user
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Check if profile and profile.user exist
  if (!profile || !profile.user) {
    return <div>No profile data available</div>;
  }

  const followersCount = profile.user.followers?.length || 0; // Length of followers array
  const followingCount = profile.user.following?.length || 0; // Length of following array
  const innerCircleCount = profile.user.innerCircle?.length || 0; // Length of inner circle array

  const handleHomepageClick = () => {
    navigate('/homepage');
  };

  const updateprofile = () => {
    navigate('/update-profile');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const handleCreatePost = () => {
    navigate('/create-post');  // Navigate to the Create Post page
  };

  const handleQuizPageClick = () => {
    navigate('/quizzes');
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <img
          src={profile.user.profilePicture || 'default-profile.png'}  // Provide a fallback for profile picture
          alt={`${profile.user.firstname} ${profile.user.lastname}`}
          className="profile-picture"
        />
        <div className="profile-info">
          <h2>{profile.user.firstname} {profile.user.lastname}</h2>
          <p>{profile.user.location}</p>
          <p>{profile.user.role}</p>
        </div>
        <div className="profile-info">
          <p>{profile.user.bio?.bioAbout}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-detail-item">
          <p>{profile.user.streakCount}</p>
          <span>Current Streak</span>
        </div>
        <div className="profile-detail-item">
          <p>{profile.user.badges?.[0]}</p>
          <span>Badge</span>
        </div>
        <div className="profile-detail-item">
          <p>{profile.user.totalRating}</p>
          <span>Rating</span>
        </div>
      </div>

      <div className="profile-social-details">
        <div className="profile-social-item">
          <p>{followersCount}</p>
          <span>Followers</span>
        </div>
        <div className="profile-social-item">
          <p>{followingCount}</p>
          <span>Following</span>
        </div>
        <div className="profile-social-item">
          <p>{innerCircleCount}</p>
          <span>Inner Circle</span>
        </div>
        <div className="sidebar">
        <button className="view-homepage-button" onClick={handleHomepageClick}>View Homepage Content</button>
      </div>
      <div className="sidebar_updateprofile">
        <button className="udpatehomepage-button" onClick={updateprofile}>Update Profile</button>
      </div> 
      <div className="sidebar_notifications">
          <button className="notifications-button" onClick={handleNotificationsClick}>Notifications</button>
        </div>
       
        <div className="sidebar_createpost">
          <button className="createpost-button" onClick={handleCreatePost}>Create Post</button>
        </div>

        <div className="sidebar_quiz">
        <button className="view-quiz-button" onClick={handleQuizPageClick}>View Quizzes</button>
      </div>

      </div>
    </div>
  );
};

export default UserProfile;
