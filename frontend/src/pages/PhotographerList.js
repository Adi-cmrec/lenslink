// pages/PhotographerList.js - Browse photographers with filters
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

function PhotographerList({ onViewDetail }) {
  const [photographers, setPhotographers] = useState([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPhotographers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cityFilter, typeFilter, photographers]);

  const loadPhotographers = async () => {
    try {
      const response = await fetch(`${API_URL}/photographers`);
      if (response.ok) {
        const data = await response.json();
        setPhotographers(data);
        setFilteredPhotographers(data);
      } else {
        setError('Failed to load photographers');
      }
    } catch (err) {
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = photographers;

    if (cityFilter) {
      filtered = filtered.filter(p =>
        p.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(p =>
        p.photography_type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredPhotographers(filtered);
  };

  if (loading) return <div className="loading">Loading photographers...</div>;

  return (
    <div className="container">
      <h2>Discover Photographers</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        <h3>Filter</h3>
        <div className="filter-inputs">
          <input
            type="text"
            placeholder="Search by city..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by photography type..."
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <button
            onClick={() => { setCityFilter(''); setTypeFilter(''); }}
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Results */}
      {filteredPhotographers.length === 0 ? (
        <div className="empty-state">
          <h3>No photographers found</h3>
          <p>Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
            Showing {filteredPhotographers.length} photographer(s)
          </p>
          <div className="grid">
            {filteredPhotographers.map((photographer) => (
              <div
                key={photographer.id}
                className="card photographer-card"
                onClick={() => onViewDetail(photographer.id)}
              >
                <h3>{photographer.name}</h3>
                <p><strong>{photographer.photography_type}</strong></p>
                <p>📍 {photographer.city}</p>
                <p>💼 {photographer.experience_years} years experience</p>
                <p style={{ color: photographer.available ? '#27ae60' : '#e74c3c' }}>
                  {photographer.available ? '✓ Available' : '✗ Not Available'}
                </p>
                <div className="skills-list">
                  {photographer.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                  {photographer.skills.length > 3 && (
                    <span className="skill-tag">+{photographer.skills.length - 3} more</span>
                  )}
                </div>
                {photographer.work_photos.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={`${API_URL}${photographer.work_photos[0]}`}
                      alt={photographer.name}
                      className="image-preview"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PhotographerList;

