# AIRA Components

## Application Flow

**User Flow**: Submit message → AI routes to department → Confirmation  
**Staff Flow**: Login → View/resolve tickets → Manage departments

## Components & Props

### Auth
- **Login**: `onLogin`, `isLoading`, `error`

### User
- **MessageForm**: `departments`, `onSubmit`, `isSubmitting`, `submitSuccess`, `error`

### Staff
- **StaffDashboard**: `loggedInUser`, `tickets`, `departments`, `onResolveTicket`, `onAddDepartment`, `onEditDepartment`, `onDeleteDepartment`, `onLogout`
- **Sidebar**: `activeTab`, `onTabChange`, `pendingCount`
- **TicketsTable**: `tickets`, `isLoading`, `onResolve`, `filter`, `onFilterChange`

### Department
- **DepartmentManager**: `departments`, `onAdd`, `onEdit`, `onDelete`
- **DepartmentForm**: `department`, `onSubmit`, `onCancel`, `isSubmitting`, `error`

### Common
- **Header**: `isAuthenticated`, `onLogout`, `username`
- **StatusBadge**: `status`, `className`
- **ActionButton**: `onClick`, `text`, `type`, `size`, `icon`, `isLoading`, `disabled`, `className`

## Layout Summary

- **Header**: Full-width navigation bar with authentication-conditional controls
- **User View**: Centered form with message input and department selection
- **Staff View**: Two-column layout (sidebar + main content)
- **Dashboard**: Tabbed interface for open tickets, resolved tickets, department management
- **Tables**: Responsive design with filter controls and action buttons

## Color Scheme

- **Primary**: Blue #2196F3
- **Success**: Green #4CAF50
- **Warning**: Orange #FF9800
- **Error**: Red #F44336
- **Neutral**: Light bg #F5F7F9, Border #E0E0E0, Text #333333/#757575