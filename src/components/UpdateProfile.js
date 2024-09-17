import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UpdateProfile.css';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    profilePicture: '',
    location: '',
    dob: '',
    interests: '',
    about: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current profile data when the component loads
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://ec2-44-220-156-213.compute-1.amazonaws.com/api/users/profiles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const { user } = response.data;
        setFormData({
          profilePicture: user.profilePicture || '',
          location: user.location || '',
          dob: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
          interests: user.bio?.bioInterests ? user.bio.bioInterests.join(', ') : '',
          about: user.bio?.bioAbout || '',
        });
        setPreviewImage(user.profilePicture); // Show the existing profile picture
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const profileData = new FormData();
    profileData.append('profilePicture', formData.profilePicture);
    profileData.append('location', formData.location);
    profileData.append('dob', formData.dob);
    profileData.append('interests', formData.interests);
    profileData.append('about', formData.about);

    try {
      await axios.post('https://ec2-44-220-156-213.compute-1.amazonaws.com/api/users/profile', profileData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Profile updated successfully!');
      navigate('/profile');

    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-profile-container">
      <h2>Update Your Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="form-group">
          <label>Profile Picture</label>
          <div className="profile-picture-container">
            <label htmlFor="file-upload">
              <div className="profile-picture-circle">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="profile-picture" />
                ) : (
                  <span>Upload</span>
                )}
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter your location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Interests</label>
          <input
            type="text"
            placeholder="Enter interests (comma separated)"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>About</label>
          <textarea
            placeholder="Tell us about yourself"
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
          ></textarea>
        </div>

        <button type="submit" className="btn-submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
