-- Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,          -- Unique identifier for the department
    name VARCHAR(100) NOT NULL UNIQUE, -- Name of the department (e.g., IT, HR)
    description TEXT,               -- Optional description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (linking Firebase Auth users to application data)
CREATE TABLE users (
    firebase_uid VARCHAR(128) PRIMARY KEY, -- Firebase User ID
    email VARCHAR(255) UNIQUE,          -- User's email (can be useful for display)
    display_name VARCHAR(100),          -- User's display name
    role VARCHAR(50) DEFAULT 'user',    -- Application-specific role (e.g., user, admin, agent)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -- Add any other app-specific user fields here
);

-- Tickets Table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,              -- Unique identifier for the ticket
    title VARCHAR(255) NOT NULL,        -- Subject or title of the ticket
    description TEXT NOT NULL,          -- Detailed description of the issue
    status VARCHAR(50) DEFAULT 'open',  -- Status (e.g., open, in_progress, resolved, closed)
    priority VARCHAR(50) DEFAULT 'medium', -- Priority (e.g., low, medium, high)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE, -- When the ticket was resolved
    reporter_uid VARCHAR(128) REFERENCES users(firebase_uid), -- User who reported the ticket
    assigned_department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL, -- Department assigned to handle the ticket
    assigned_agent_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE SET NULL -- Optional: Specific agent assigned
);
