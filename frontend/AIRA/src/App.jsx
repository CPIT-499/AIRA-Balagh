import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth
import { useAuth } from './components/Auth/AuthContext';
import Login from './components/Auth/Login';

// User
import MessageForm from './components/User/MessageForm';

// Staff
import StaffDashboard from './components/Staff/StaffDashboard';

// Common
import Header from './components/Common/Header';

// API
import {
  fetchTickets,
  fetchDepartments,
  submitMessage,
  resolveTicket,
  addDepartment,
  editDepartment,
  deleteDepartment
} from './api';

function App() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const [departments, setDepartments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    await fetchTicketsData();
    await fetchDepartmentsData();
  };

  const fetchTicketsData = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchTickets();
      setTickets(Array.isArray(data) ? data : data ? [data] : []);
      console.log('Fetched tickets:', data);
      console.log('Tickets:', tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchDepartmentsData = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchDepartments();
      console.log('Fetched departments:', data);
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    console.log('Tickets updated:', tickets);
  }, [tickets]);

  const handleMessageSubmit = async (message) => {
    setIsLoadingData(true);
    try {
      const { success, ticket, error } = await submitMessage(message);

      if (success) {
        if (isAuthenticated) {
          setTickets(prevTickets => [...prevTickets, ticket]);
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: error || 'Failed to submit message. Please try again.'
        };
      }
    } catch (error) {
      console.error('Submit message error:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again.'
      };
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleResolveTicket = async (ticketId) => {
    setIsLoadingData(true);
    try {
      const { success, error } = await resolveTicket(ticketId);

      if (success) {
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === ticketId ? { ...ticket, status: 'resolved' } : ticket
          )
        );
        return { success: true };
      } else {
        return {
          success: false,
          error: error || 'Failed to resolve ticket. Please try again.'
        };
      }
    } catch (error) {
      console.error('Resolve ticket error:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again.'
      };
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAddDepartment = async (department) => {
    setIsLoadingData(true);
    try {
      const { success, department: newDepartment, error } = await addDepartment(department);

      if (success) {
        setDepartments(prev => [...prev, newDepartment]);
        return { success: true };
      } else {
        return {
          success: false,
          error: error || 'Failed to add department. Please try again.'
        };
      }
    } catch (error) {
      console.error('Add department error:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again.'
      };
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleEditDepartment = async (updatedDepartment) => {
    setIsLoadingData(true);
    try {
      const { success, department: editedDepartment, error } = await editDepartment(updatedDepartment);

      if (success) {
        setDepartments(prev =>
          prev.map(dept =>
            dept.id === updatedDepartment.id ? editedDepartment : dept
          )
        );
        return { success: true };
      } else {
        return {
          success: false,
          error: error || 'Failed to update department. Please try again.'
        };
      }
    } catch (error) {
      console.error('Edit department error:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again.'
      };
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    setIsLoadingData(true);
    try {
      const { success, error } = await deleteDepartment(departmentId);

      if (success) {
        setDepartments(prev =>
          prev.filter(dept => dept.id !== departmentId)
        );
        return { success: true };
      } else {
        return {
          success: false,
          error: error || 'Failed to delete department. Please try again.'
        };
      }
    } catch (error) {
      console.error('Delete department error:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again.'
      };
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={logout}
          username={user?.email}
        />

        <Routes>
          <Route
            path="/"
            element={
              <MessageForm
                departments={departments}
                onSubmit={handleMessageSubmit}
              />
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <StaffDashboard
                  loggedInUser={user}
                  tickets={tickets}
                  departments={departments}
                  isLoading={isLoadingData}
                  onResolveTicket={handleResolveTicket}
                  onAddDepartment={handleAddDepartment}
                  onEditDepartment={handleEditDepartment}
                  onDeleteDepartment={handleDeleteDepartment}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
