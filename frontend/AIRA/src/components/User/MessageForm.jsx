import { useState } from 'react';
import ActionButton from '../Common/ActionButton';
import './MessageForm.css';

function MessageForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      const result = await onSubmit({
        title,
        massage: content,
        name,
        email
      });
      console.log('Message submission result:', result);
      if (result.success) {
        setSubmitSuccess(true);
        setContent('');
        setTitle('');
        setName('');
        setEmail('');
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
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title of your request"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="massage"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your request or issue..."
              required
              className="message-textarea"
              rows={6}
            />
          </div>
          
          <div className="form-actions">
            <ActionButton
              htmlType="submit"
              text={isSubmitting ? "Submitting..." : "Submit Request"}
              type="primary"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageForm;