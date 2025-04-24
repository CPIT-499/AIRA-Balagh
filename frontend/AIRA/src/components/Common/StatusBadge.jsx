import './StatusBadge.css';

function StatusBadge({ status }) {
  // Component logic will be implemented later
  return (
    <span className={`status-badge ${status}`}>
      {status}
    </span>
  );
}

export default StatusBadge;