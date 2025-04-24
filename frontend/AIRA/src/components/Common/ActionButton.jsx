import './ActionButton.css';

function ActionButton({ text, type, onClick }) {
  // Component logic will be implemented later
  return (
    <button 
      className={`action-button ${type || 'default'}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default ActionButton;