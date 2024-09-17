import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    captions: '',
    hashtags: '',
    heading: '',
    relatedTopics: '',
    contentType: 'video',
    verify: 'No',
    isDraft: false,
  });
  const [media, setMedia] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'media') {
      setMedia(e.target.files[0]);
    } else {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!media) {
      setError('Content file is required');
      return;
    }

    const postData = new FormData();
    postData.append('media', media);
    if (thumbnail) {
      postData.append('thumbnail', thumbnail);
    }
    postData.append('captions', formData.captions);
    postData.append('hashtags', formData.hashtags);
    postData.append('heading', formData.heading);
    postData.append('relatedTopics', formData.relatedTopics);
    postData.append('contentType', formData.contentType);
    postData.append('verify', formData.verify);
    postData.append('isDraft', formData.isDraft);

    try {
      const response = await axios.post('https://ec2-54-211-127-150.compute-1.amazonaws.com/api/content/create', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess(response.data.message);
    } catch (err) {
      setError('Failed to create post');
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Heading</label>
          <input type="text" name="heading" value={formData.heading} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Captions</label>
          <textarea name="captions" value={formData.captions} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Hashtags (comma-separated)</label>
          <input type="text" name="hashtags" value={formData.hashtags} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Related Topics (comma-separated)</label>
          <input type="text" name="relatedTopics" value={formData.relatedTopics} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Content File (Media)</label>
          <input type="file" name="media" accept="video/*" onChange={handleFileChange} required />
        </div>

        <div className="form-group">
          <label>Thumbnail (Optional)</label>
          <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Is this a Draft?</label>
          <input
            type="checkbox"
            name="isDraft"
            checked={formData.isDraft}
            onChange={() => setFormData({ ...formData, isDraft: !formData.isDraft })}
          />
        </div>

        <button type="submit" className="btn-submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
