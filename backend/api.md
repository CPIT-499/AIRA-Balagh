# AIRA API Server Overview

The `server.js` file is the main entry point for the AIRA backend API, built with **Express.js**. It provides endpoints for:

1. **Authentication**: `/api/auth/login` - Basic user login.
2. **Ticket Management**: `/api/tickets` - Create, view, and resolve tickets.
3. **Department Management**: `/api/departments` - Add, edit, and delete departments.
4. **AI Classification**: Automatically assigns tickets to departments based on keywords.
5. **Health Check**: `/api/health` - Verifies server status.

### Key Features
- **In-Memory Data Store**: Temporary storage for users, tickets, and departments.
- **AI Ticket Classification**: Uses keyword matching for department assignment.

Run the server with `node server.js` and access it on `http://localhost:4000`.