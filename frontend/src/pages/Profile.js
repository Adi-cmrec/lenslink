// pages/Profile.js - Photographer profile management
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

function Profile({ token, user }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [photographyType, setPhotographyType] = useState('');
  const [city, setCity] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [skills, setSkills] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [available, setAvailable] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setPhotographyType(data.photography_type);
        setCity(data.city);
        setExperienceYears(data.experience_years);
        setSkills(data.skills.join(', '));
        setContactNumber(data.contact_number);
        setAvailable(data.available);
      } else if (response.status === 404) {
        // No profile yet, show create form
        setIsEditing(true);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);

    const profileData = {
      photography_type: photographyType,
      city,
      experience_years: parseInt(experienceYears),
      skills: skillsArray,
      contact_number: contactNumber,
      available
    };

    try {
      const url = profile ? `${API_URL}/profile` : `${API_URL}/profile`;
      const method = profile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setSuccess(profile ? 'Profile updated!' : 'Profile created!');
        setIsEditing(false);
        loadProfile();
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to save profile');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (profile && profile.work_photos.length + files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setError('');
    setSuccess('');

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_URL}/profile/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setSuccess('Photos uploaded!');
        setSelectedFiles([]);
        loadProfile();
      } else {
        const data = await response.json();
        setError(data.detail || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="container">
      <h2>My Profile</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!isEditing && profile ? (
        <div className="card">
          <h3>{user.name}</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Photography Type:</strong> {profile.photography_type}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>Experience:</strong> {profile.experience_years} years</p>
          <p><strong>Contact:</strong> {profile.contact_number}</p>
          <p><strong>Status:</strong> {profile.available ? 'Available' : 'Not Available'}</p>
          <div className="skills-list">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}</span>
            ))}
          </div>

          <h4 style={{ marginTop: '2rem' }}>Work Photos ({profile.work_photos.length}/5)</h4>
          <div className="work-photos">
            {profile.work_photos.map((photo, idx) => (
              <img key={idx} src={`${API_URL}${photo}`} alt={`Work ${idx + 1}`} className="work-photo" />
            ))}
          </div>

          {profile.work_photos.length < 5 && (
            <div style={{ marginTop: '2rem' }}>
              <input type="file" multiple accept="image/*" onChange={handleFileSelect} />
              {selectedFiles.length > 0 && (
                <button onClick={handleUpload} className="btn" style={{ marginTop: '1rem' }}>
                  Upload {selectedFiles.length} photo(s)
                </button>
              )}
            </div>
          )}

          <button onClick={() => setIsEditing(true)} className="btn" style={{ marginTop: '2rem' }}>
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="form-container">
          <h3>{profile ? 'Edit Profile' : 'Create Your Profile'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Photography Type</label>
              <input
                type="text"
                value={photographyType}
                onChange={(e) => setPhotographyType(e.target.value)}
                required
                placeholder="e.g., Wedding, Portrait, Landscape"
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="e.g., New York"
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                required
                min="0"
                placeholder="e.g., 5"
              />
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
                placeholder="e.g., Portrait, Event, Editing"
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                placeholder="e.g., +1234567890"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
                {' '}Available for work
              </label>
            </div>
            <button type="submit" className="btn">
              {profile ? 'Update Profile' : 'Create Profile'}
            </button>
            {profile && (
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default Profile;

