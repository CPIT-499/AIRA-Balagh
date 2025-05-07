import { useState } from 'react';
import './StaffDashboard.css';
import Sidebar from './Sidebar';
import TicketsTable from './TicketsTable';
import DepartmentManager from '../Department/DepartmentManager';

function StaffDashboard({
  loggedInUser,
  tickets = [],
  departments = [],
  isLoading, // Receive isLoading prop
  onResolveTicket,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment
}) {
  const [activeTab, setActiveTab] = useState('open');
  const [filter, setFilter] = useState({
    search: '',
    department: '',
    dateRange: { start: null, end: null }
  });

  // Filter tickets based on active tab and filter criteria
  const filteredTickets = tickets.filter(ticket => {
    // Filter by status based on active tab
    if (activeTab === 'open' && ticket.status !== 'open') return false;
    if (activeTab === 'resolved' && ticket.status !== 'resolved') return false;

    // Apply search filter if present
    if (filter.search && !ticket.message.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }

    // Apply department filter if selected
    if (filter.department && ticket.department !== filter.department) {
      return false;
    }

    // Apply date range filter if present
    if (filter.dateRange.start && filter.dateRange.end) {
      const ticketDate = new Date(ticket.date);
      const startDate = new Date(filter.dateRange.start);
      const endDate = new Date(filter.dateRange.end);
      if (ticketDate < startDate || ticketDate > endDate) {
        return false;
      }
    }

    return true;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={tickets.filter(t => t.status === 'pending').length}
      />

      <main className="dashboard-content">
        {activeTab === 'departments' ? (
          <DepartmentManager
            departments={departments}
            onAdd={onAddDepartment}
            onEdit={onEditDepartment}
            onDelete={onDeleteDepartment}
          />
        ) : (
          <TicketsTable
            tickets={filteredTickets}
            isLoading={isLoading} // Pass isLoading down
            departments={departments} // Pass departments down for filter
            onResolve={onResolveTicket}
            filter={filter}
            onFilterChange={handleFilterChange}
          />
        )}
      </main>
    </div>
  );
}

export default StaffDashboard;