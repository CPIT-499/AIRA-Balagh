import { useState } from 'react';
import './TicketsTable.css';
import StatusBadge from '../Common/StatusBadge';
import ActionButton from '../Common/ActionButton';

function TicketsTable({
  tickets = [],
  isLoading,
  departments = [], // Ensure departments prop is received
  onResolve,
  filter,
  onFilterChange
}) {
  const [expandedTicket, setExpandedTicket] = useState(null);

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get department name by ID
  const getDepartmentNameById = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'N/A'; // Return 'N/A' or ID if not found
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  // Handle department filter change
  const handleDepartmentChange = (e) => {
    onFilterChange({ department: e.target.value });
  };

  // Handle view ticket details
  const handleViewTicket = (ticketId) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(ticketId);
    }
  };

  return (
    <div className="tickets-table-container">
      <div className="table-header">
        <h1 className="table-title">
          {filter.department ? `${filter.department} Tickets` : 'All Tickets'}
        </h1>
        <div className="filter-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tickets..."
              value={filter.search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="department-filter">
            <select
              value={filter.department}
              onChange={handleDepartmentChange}
              className="department-select"
            >
              <option value="">All Departments</option>
              {/* Replace hardcoded options with departments from props */}
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Message</th> {/* Changed from Massage to Message for clarity */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className={expandedTicket === ticket.id ? 'expanded' : ''}>
                  <td>{ticket.id}</td>
                  {/* Title cell */}
                  <td>{ticket.title}</td> 
                  
                  <td>{getDepartmentNameById(ticket.assigned_department_id)}</td>
                  
                  <td>{formatDate(ticket.created_at)}</td> 
                  <td>
                    <StatusBadge status={ticket.status} />
                  </td>
                  {/* Message cell for ticket.description */}
                  <td className="message-cell">
                    <div className={`message-content ${expandedTicket === ticket.id ? 'expanded' : ''}`}>
                      {ticket.description} 
                    </div>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <ActionButton
                        text={expandedTicket === ticket.id ? "Hide" : "View"}
                        type="secondary"
                        onClick={() => handleViewTicket(ticket.id)}
                      />
                      {ticket.status === 'pending' && ( // Assuming 'open' tickets might be resolvable
                        <ActionButton
                          text="Resolve"
                          type="primary"
                          onClick={() => onResolve(ticket.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TicketsTable;