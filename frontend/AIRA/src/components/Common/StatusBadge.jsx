import './StatusBadge.css';

function StatusBadge({ status, className = '' }) {
  return (
    <span className={`status-badge ${status} ${className}`}>
      {status}
    </span>
  );
}

export default StatusBadge;