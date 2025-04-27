import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Auth Components
import Login from './components/Auth/Login'

// User Components
import MessageForm from './components/User/MessageForm'

// Staff Components
import StaffDashboard from './components/Staff/StaffDashboard'

// Common Components
import Header from './components/Common/Header'

// API Functions
import {
  fetchTickets,
  fetchDepartments,
  login,
  submitMessage,
  resolveTicket,
  addDepartment,
  editDepartment,
  deleteDepartment
} from './api';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  // Loading state for data
  const [isLoadingData, setIsLoadingData] = useState(false)
  
  // Application state
  const [departments, setDepartments] = useState([])
  const [tickets, setTickets] = useState([])
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setIsAuthenticated(true)
      setLoggedInUser(JSON.parse(user))
    }
  }, [])
  
  // Fetch initial data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  // Fetch initial data
  const fetchInitialData = async () => {
    await fetchTicketsData();
    await fetchDepartmentsData();
  }

  // Fetch tickets from API
  const fetchTicketsData = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch departments from API
  const fetchDepartmentsData = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setIsLoadingData(false);
    }
  };
  
  // Login handler
  const handleLogin = async (credentials) => {
    setIsLoadingData(true);
    try {
      const { success, user, error } = await login(credentials);
      
      if (success) {
        setIsAuthenticated(true);
        setLoggedInUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: error || 'Login failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during login. Please try again.'
      };
    } finally {
      setIsLoadingData(false);
    }
  }
  
  // Logout handler
  const handleLogout = async () => {
    // No need for API call for logout in this implementation
    // Just clear the local storage and state
    setIsAuthenticated(false);
    setLoggedInUser(null);
    localStorage.removeItem('user');
  }
  
  // Submit message handler
  const handleMessageSubmit = async (message) => {
    setIsLoadingData(true);
    try {
      const { success, ticket, error } = await submitMessage(message);
      
      if (success) {
        // Only update tickets state if we're in dashboard view
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
  }
  
  // Resolve ticket handler
  const handleResolveTicket = async (ticketId) => {
    setIsLoadingData(true);
    try {
      const { success, error } = await resolveTicket(ticketId);
      
      if (success) {
        // Update the ticket in our local state
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
  }
  
  // Add department handler
  const handleAddDepartment = async (department) => {
    setIsLoadingData(true);
    try {
      const { success, department: newDepartment, error } = await addDepartment(department);
      
      if (success) {
        setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
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
  }
  
  // Edit department handler
  const handleEditDepartment = async (updatedDepartment) => {
    setIsLoadingData(true);
    try {
      const { success, department: editedDepartment, error } = await editDepartment(updatedDepartment);
      
      if (success) {
        setDepartments(prevDepartments =>
          prevDepartments.map(dept =>
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
  }
  
  // Delete department handler
  const handleDeleteDepartment = async (departmentId) => {
    setIsLoadingData(true);
    try {
      const { success, error } = await deleteDepartment(departmentId);
      
      if (success) {
        setDepartments(prevDepartments => 
          prevDepartments.filter(dept => dept.id !== departmentId)
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
  }

  return (
    <Router>
      <div className="app-container">
        <Header 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
          username={loggedInUser?.username}
        />
        
        <Routes>
          {/* Public routes */}
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
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <StaffDashboard 
                  loggedInUser={loggedInUser}
                  tickets={tickets}
                  departments={departments}
                  isLoading={isLoadingData}
                  onResolveTicket={handleResolveTicket}
                  onAddDepartment={handleAddDepartment}
                  onEditDepartment={handleEditDepartment}
                  onDeleteDepartment={handleDeleteDepartment}
                /> : 
                <Navigate to="/login" />
            } 
          />

          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
