# AIRA Components Structure

## 1. Flow of Application

- **User Flow**: 
  - Homepage → Submit message → AI analyzes content → Routes to department → Success confirmation
  - No authentication required for message submission
  - Message stored with pending status until processed

- **Staff Flow**: 
  - Login (admin/admin123) → Dashboard shows department-specific tickets
  - Open tab: View pending tickets → Resolve when completed
  - Resolved tab: Review past tickets → Filter/search if needed
  - Departments tab: Create/edit/remove departments

## 2. Component Relationships

- **Auth Components**
  - `Login.jsx`: Staff authentication

- **User Components**
  - `MessageForm.jsx`: Entry point for ticket creation

- **Staff Components**
  - `StaffDashboard.jsx`: Container component
  - `Sidebar.jsx`: Navigation between views
  - `TicketsTable.jsx`: Displays ticket data

- **Department Components**
  - `DepartmentManager.jsx`: Container for department management
  - `DepartmentForm.jsx`: Add/edit departments

- **Common Components**
  - `StatusBadge.jsx`: Used in `TicketsTable` for status display
  - `ActionButton.jsx`: Reusable buttons for all actions

## 3. UI Layout

- **Header**: 
  - Appears on all pages with "AIRA - AI Routing Assistant" title in blue (#2196F3)
  - Navigation links to right side (User Form, Staff Dashboard, Departments)
  - Auth-aware navigation shows Login or Logout based on auth state

- **Login View**: 
  - Centered white card with drop shadow, max-width 400px
  - Blue header "Login to AIRA"
  - Username and password fields with labels
  - Blue login button
  - Red error message appears on failed login
  - Credentials: admin/admin123

- **User View**: 
  - Simple, focused form with clean background
  - Large text area for message input
  - Department selection dropdown
  - Submit button with clear call-to-action
  - Success notification appears after submission
  - Mobile-friendly layout

- **Staff View**: 
  - Two-column layout (20% sidebar, 80% content)
  - Left sidebar with tab navigation:
    - Blue highlight for active tab
    - Tabs for: Open Tickets, Resolved Tickets, Departments
  - Main content area with:
    - Ticket table with striped rows for readability
    - Columns: ID, Message (truncated with ellipsis), Department, Date, Status, Actions
    - "View" and "Resolve" action buttons
    - Status badges (orange for open, green for resolved)

- **Department View**:
  - Clean table listing all departments
  - Columns: Department Name, Description, Actions
  - Action buttons for Edit/Delete operations
  - "Add New Department" button above table
  - Form slides in/appears when adding/editing

- **Responsive Behavior**:
  - Desktop: Full two-column layout for staff views
  - Tablet: Adjusted column widths, maintained layout
  - Mobile: Collapsing sidebar into dropdown menu

Color scheme: Blue primary (#2196F3), Green for success (#4CAF50), Orange for pending (#FF9800), Red for errors/delete (#F44336), Light gray backgrounds (#F5F7F9)