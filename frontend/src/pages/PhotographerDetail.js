// pages/PhotographerDetail.js - Detailed photographer view
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

function PhotographerDetail({ photographerId, onBack }) {
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPhotographer();
  }, [photographerId]);

  const loadPhotographer = async () => {
    try {
      const response = await fetch(`${API_URL}/photographer/${photographerId}`);
      if (response.ok) {
        const data = await response.json();
        setPhotographer(data);
      } else {
        setError('Photographer not found');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!photographer) return null;

  return (
    <div className="container">
      <button onClick={onBack} className="back-button">
        ← Back to List
      </button>

      <div className="detail-container">
        <h2>{photographer.name}</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>{photographer.email}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3>Professional Details</h3>
            <p><strong>Photography Type:</strong> {photographer.photography_type}</p>
            <p><strong>Location:</strong> {photographer.city}</p>
            <p><strong>Experience:</strong> {photographer.experience_years} years</p>
            <p><strong>Status:</strong>{' '}
              <span style={{ color: photographer.available ? '#27ae60' : '#e74c3c' }}>
                {photographer.available ? 'Available for work' : 'Not available'}
              </span>
            </p>
          </div>

          <div>
            <h3>Skills</h3>
            <div className="skills-list">
              {photographer.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="contact-info">
          <h3>Contact Information</h3>
          <p><strong>Phone:</strong> {photographer.contact_number}</p>
          <p><strong>Email:</strong> {photographer.email}</p>
        </div>

        {photographer.work_photos.length > 0 && (
          <>
            <h3 style={{ marginTop: '2rem' }}>Portfolio</h3>
            <div className="work-photos">
              {photographer.work_photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={`${API_URL}${photo}`}
                  alt={`Work ${idx + 1}`}
                  className="work-photo"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PhotographerDetail;

