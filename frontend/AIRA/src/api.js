// API logic for the AIRA frontend

const API_BASE_URL = 'http://localhost:4000/api';

// Fetch tickets
export const fetchTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch tickets');
    }
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Fetch departments
export const fetchDepartments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch departments');
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Login
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Submit message
export const submitMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to submit message');
    }
  } catch (error) {
    console.error('Submit message error:', error);
    throw error;
  }
};

// Resolve ticket
export const resolveTicket = async (ticketId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to resolve ticket');
    }
  } catch (error) {
    console.error('Resolve ticket error:', error);
    throw error;
  }
};

// Add department
export const addDepartment = async (department) => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(department),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to add department');
    }
  } catch (error) {
    console.error('Add department error:', error);
    throw error;
  }
};

// Edit department
export const editDepartment = async (department) => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/${department.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(department),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to edit department');
    }
  } catch (error) {
    console.error('Edit department error:', error);
    throw error;
  }
};

// Delete department
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to delete department');
    }
  } catch (error) {
    console.error('Delete department error:', error);
    throw error;
  }
};