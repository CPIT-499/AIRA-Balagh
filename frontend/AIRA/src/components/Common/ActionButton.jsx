import './ActionButton.css';

function ActionButton({ 
  text, 
  type = 'default', 
  size = 'medium', 
  onClick, 
  icon = null,
  isLoading = false,
  disabled = false,
  className = ''
}) {
  const buttonClasses = `action-button ${type} ${size} ${className} ${isLoading ? 'loading' : ''}`;
  
  return (
    <button 
      className={buttonClasses} 
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="loading-spinner"></span>
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          {text}
        </>
      )}
    </button>
  );
}

export default ActionButton;