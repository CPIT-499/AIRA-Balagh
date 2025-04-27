import { useState, useEffect } from 'react';
import ActionButton from '../Common/ActionButton';
import './DepartmentForm.css';

function DepartmentForm({ department = null, onSubmit, onCancel, isSubmitting = false }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  // Initialize form if editing an existing department
  useEffect(() => {
    if (department) {
      setName(department.name || '');
      setDescription(department.description || '');
    }
  }, [department]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Department name is required');
      return;
    }
    
    const departmentData = {
      ...(department && { id: department.id }),
      name: name.trim(),
      description: description.trim()
    };
    
    onSubmit(departmentData);
  };

  return (
    <div className="department-form-modal">
      <div className="department-form-container">
        <div className="department-form-header">
          <h2>{department ? 'Edit Department' : 'Add Department'}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="department-name">Department Name</label>
            <input
              id="department-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter department name"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="department-description">Description</label>
            <textarea
              id="department-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter department description"
              className="form-textarea"
              rows={4}
            />
          </div>
          
          <div className="form-actions">
            <ActionButton
              text="Cancel"
              type="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            />
            <ActionButton
              text={isSubmitting ? "Saving..." : "Save Department"}
              type="primary"
              onClick={() => {}}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default DepartmentForm;