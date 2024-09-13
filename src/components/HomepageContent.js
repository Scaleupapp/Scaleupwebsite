import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/HomepageContent.css';
import { FaHeart, FaComment, FaSave, FaEye } from 'react-icons/fa';

const HomepageContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreContent = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/content/homepage?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const newContent = response.data.content;

      setContent((prevContent) => [...prevContent, ...newContent]);
      setHasMore(response.data.pagination.totalPages > page);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch content');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreContent();
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  const handleLike = async (contentId) => {
    // Implement the like functionality
    await axios.put(`http://localhost:3000/api/content/like/${contentId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    // You can fetch updated likes here or update UI directly
  };

  const handleSave = async (contentId) => {
    await axios.put(`http://localhost:3000/api/content/save/${contentId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  };

  if (loading && content.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="homepage-content">
      {content.map((item) => (
        <div key={item._id} className="content-item">
          <div className="content-header">
            <img src={item.userId.profilePicture} alt={item.userId.username} className="profile-picture" />
            <div>
              <h3>{item.userId.username}</h3>
              <p>{new Date(item.postdate).toLocaleDateString()}</p>
            </div>
          </div>

          <h4>{item.heading}</h4>
          <p>{item.captions}</p>

          {item.contentType === 'video' && (
            <video src={item.contentURL} controls className="content-video" poster={item.thumbnailURL} />
          )}

          <div className="social-icons">
            <span onClick={() => handleLike(item._id)}>
              <FaHeart /> {item.likeCount}
            </span>
            <span>
              <FaComment /> {item.CommentCount}
            </span>
            <span>
              <FaEye /> {item.viewCount}
            </span>
            <span onClick={() => handleSave(item._id)}>
              <FaSave /> Save
            </span>
          </div>

          <button onClick={() => alert('Open comment modal')}>Comment</button>
        </div>
      ))}

      {loading && <div>Loading more content...</div>}
      {!hasMore && <div>No more content to load</div>}
    </div>
  );
};

export default HomepageContent;
