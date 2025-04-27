const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory data store (would be replaced with a database in production)
let users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'staff' }
];

let departments = [
  { id: 1, name: 'IT', description: 'Technical support and infrastructure' },
  { id: 2, name: 'HR', description: 'Human resources and personnel matters' },
  { id: 3, name: 'Facilities', description: 'Building maintenance and workspace issues' }
];

let tickets = [
  { 
    id: 1, 
    message: 'My computer is not turning on', 
    department: 'IT', 
    status: 'pending', 
    date: '2025-04-23T10:30:00'
  },
  { 
    id: 2, 
    message: 'Need to update my home address', 
    department: 'HR', 
    status: 'resolved', 
    date: '2025-04-22T14:15:00'
  }
];

// Helper for generating IDs
const generateId = (collection) => {
  return Math.max(0, ...collection.map(item => item.id)) + 1;
};

// Simulate AI classification of tickets
const classifyTicket = (message) => {
  const keywords = {
    'IT': ['computer', 'laptop', 'password', 'printer', 'software', 'hardware', 'network', 'login', 'email', 'wifi', 'internet', 'connection'],
    'HR': ['salary', 'payroll', 'vacation', 'leave', 'benefit', 'hiring', 'employee', 'onboarding', 'address', 'personal'],
    'Facilities': ['office', 'building', 'desk', 'chair', 'light', 'air', 'heating', 'cooling', 'bathroom', 'kitchen', 'parking']
  };
  
  // Default to unassigned if no match
  let bestMatch = 'Unassigned';
  let maxMatches = 0;
  
  // Count keyword matches for each department
  for (const [dept, words] of Object.entries(keywords)) {
    const matches = words.filter(word => 
      message.toLowerCase().includes(word.toLowerCase())
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = dept;
    }
  }
  
  return bestMatch;
};

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => 
    u.username === username && u.password === password
  );
  
  if (user) {
    // In a real app, generate and return a JWT token
    res.json({ 
      success: true, 
      user: { 
        username: user.username,
        role: user.role
      } 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid username or password' 
    });
  }
});

// Tickets Routes
app.get('/api/tickets', (req, res) => {
  res.json(tickets);
});

app.post('/api/tickets', (req, res) => {
  const { message, departmentHint } = req.body;
  
  if (!message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Message is required'
    });
  }
  
  // Use provided department or classify with AI
  const department = departmentHint || classifyTicket(message);
  
  const newTicket = {
    id: generateId(tickets),
    message: message,
    department: department,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  tickets.push(newTicket);
  
  res.status(201).json({ 
    success: true,
    ticket: newTicket
  });
});

app.patch('/api/tickets/:id/resolve', (req, res) => {
  const ticketId = parseInt(req.params.id);
  
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Ticket not found'
    });
  }
  
  tickets[ticketIndex].status = 'resolved';
  
  res.json({
    success: true,
    ticket: tickets[ticketIndex]
  });
});

// Departments Routes
app.get('/api/departments', (req, res) => {
  res.json(departments);
});

app.post('/api/departments', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ 
      success: false, 
      error: 'Department name is required'
    });
  }
  
  const newDepartment = {
    id: generateId(departments),
    name: name,
    description: description || ''
  };
  
  departments.push(newDepartment);
  
  res.status(201).json({ 
    success: true,
    department: newDepartment
  });
});

app.put('/api/departments/:id', (req, res) => {
  const departmentId = parseInt(req.params.id);
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ 
      success: false, 
      error: 'Department name is required'
    });
  }
  
  const departmentIndex = departments.findIndex(d => d.id === departmentId);
  
  if (departmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Department not found'
    });
  }
  
  departments[departmentIndex] = {
    ...departments[departmentIndex],
    name: name,
    description: description || departments[departmentIndex].description
  };
  
  res.json({
    success: true,
    department: departments[departmentIndex]
  });
});

app.delete('/api/departments/:id', (req, res) => {
  const departmentId = parseInt(req.params.id);
  
  const initialLength = departments.length;
  departments = departments.filter(d => d.id !== departmentId);
  
  if (departments.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: 'Department not found'
    });
  }
  
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`AIRA API server running on port ${PORT}`);
});