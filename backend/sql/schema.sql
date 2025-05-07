-- Organizations Table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (organization_id, name) -- Ensure department names are unique within an organization
);

-- Users Table (linking Firebase Auth users to application data)
CREATE TABLE users (
    firebase_uid VARCHAR(128) PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    display_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -- Add any other app-specific user fields here
);

-- Tickets Table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    reporter_uid VARCHAR(128) REFERENCES users(firebase_uid),
    assigned_department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    assigned_agent_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL
);


-- Insert a new organization
INSERT INTO organizations (name, description) VALUES ('Demo', 'Description for Demo organization');

-- Insert a new user
INSERT INTO users (firebase_uid, organization_id, email, display_name)
VALUES (
    'some_firebase_uid',  -- Replace with the actual Firebase UID
    (SELECT id FROM organizations WHERE name = 'Demo'), -- Subquery to get the organization ID
    'demo@demo.com',
    'Demo User'
);

-- Insert departments for the Demo organization
INSERT INTO departments (organization_id, name, description)
VALUES
    ((SELECT id FROM organizations WHERE name = 'Demo'), 'IT', 'Information Technology Department'),
    ((SELECT id FROM organizations WHERE name = 'Demo'), 'Support', 'Customer Support Department'),
    ((SELECT id FROM organizations WHERE name = 'Demo'), 'Sales', 'Sales Department'),
    ((SELECT id FROM organizations WHERE name = 'Demo'), 'Marketing', 'Marketing Department'),
    ((SELECT id FROM organizations WHERE name = 'Demo'), 'HR', 'Human Resources Department'),
    ((SELECT id FROM organizations WHERE name = 'Demo'), 'Finance', 'Finance Department');