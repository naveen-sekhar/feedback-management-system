import React, { useState, useEffect } from 'react';

const FeedbackForm = ({ initialData, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    description: '',
    rating: 5
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'general',
        description: initialData.description || '',
        rating: initialData.rating || 5
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter feedback title"
          maxLength={100}
        />
        {errors.title && <span className="alert alert-error" style={{ padding: '5px 10px', marginTop: '5px', display: 'block' }}>{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="general">General</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="improvement">Improvement</option>
        </select>
        {errors.category && <span className="alert alert-error" style={{ padding: '5px 10px', marginTop: '5px', display: 'block' }}>{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your feedback in detail..."
          maxLength={1000}
        />
        <small style={{ color: '#888' }}>
          {formData.description.length}/1000 characters
        </small>
        {errors.description && <span className="alert alert-error" style={{ padding: '5px 10px', marginTop: '5px', display: 'block' }}>{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Rating *</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <label
              key={num}
              style={{
                cursor: 'pointer',
                fontSize: '2rem',
                color: num <= formData.rating ? '#ffc107' : '#ddd'
              }}
            >
              <input
                type="radio"
                name="rating"
                value={num}
                checked={formData.rating === num}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              ★
            </label>
          ))}
        </div>
        {errors.rating && <span className="alert alert-error" style={{ padding: '5px 10px', marginTop: '5px', display: 'block' }}>{errors.rating}</span>}
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : (isEditing ? 'Update Feedback' : 'Submit Feedback')}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default FeedbackForm;
