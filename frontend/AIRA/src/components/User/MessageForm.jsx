import { useState } from 'react';
import ActionButton from '../Common/ActionButton';
import './MessageForm.css';

function MessageForm({ departments = [], onSubmit }) {
  const [content, setContent] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await onSubmit({ content, selectedDepartment });
      if (result.success) {
        setSubmitSuccess(true);
        setContent('');
        setSelectedDepartment('');
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setError(result.error || 'Failed to submit message. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Message submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="message-form-container">
      {submitSuccess && (
        <div className="success-notification">
          Your message has been submitted successfully!
        </div>
      )}
      
      <div className="message-form-card">
        <h1 className="form-title">Submit Your Request</h1>
        <p className="form-description">
          Enter your request below and our AI will route it to the appropriate department.
        </p>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your request or issue..."
              required
              className="message-textarea"
              rows={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="department">Department (Optional)</label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-select"
            >
              <option value="">Let AI determine</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            <p className="form-helper-text">
              Leave blank to let our AI determine the appropriate department
            </p>
          </div>
          
          <div className="form-actions">
            <ActionButton
              text={isSubmitting ? "Submitting..." : "Submit Request"}
              type="primary"
              onClick={() => {}}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageForm;