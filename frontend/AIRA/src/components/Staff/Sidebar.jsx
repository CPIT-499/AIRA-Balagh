import './Sidebar.css';

function Sidebar({ activeTab, onTabChange, pendingCount = 0 }) {
  const tabs = [
    { id: 'open', label: 'Open Tickets' },
    { id: 'resolved', label: 'Resolved Tickets' },
    { id: 'departments', label: 'Departments' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">Staff Dashboard</div>
      <nav className="sidebar-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {tab.id === 'open' && pendingCount > 0 && (
              <span className="tab-badge">{pendingCount}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;