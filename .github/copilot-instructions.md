# EduNeeds - AI Coding Agent Instructions

This document provides essential context for AI agents working in the EduNeeds codebase - a student file sharing platform.

## Architecture Overview

- **Backend (`/backend`)**: Express.js REST API with MongoDB
  - Entry: `server.js` - Server setup, middleware configuration, route mounting
  - Authentication: JWT-based (`/middleware/authMiddleware.js`)
  - Role-based access: Student/Admin roles (`/middleware/roleMiddleware.js`)
  - Models: `User.js`, `File.js` in `/models`

- **Frontend (`/frontend`)**: React SPA
  - Authentication state: Context API (`/context/AuthContext.js`)
  - Protected routes: HOC pattern (`/components/ProtectedRoute.js`)
  - API integration: Centralized in `/utils/api.js`

## Key Integration Points

1. **API Communication**
   - Base URL: `http://localhost:5000/api`
   - Authentication: Bearer token in Authorization header
   - Example from `frontend/src/utils/api.js`:
   ```javascript
   const authRequest = async (url, options = {}) => {
     const token = getAuthToken();
     const headers = {
       'Content-Type': 'application/json',
       ...options.headers,
     };
     if (token) {
       headers.Authorization = `Bearer ${token}`;
     }
     return fetch(`${API_BASE_URL}${url}`, { ...options, headers });
   };
   ```

2. **Authentication Flow**
   - Login/Register endpoints: `/api/auth/*`
   - Token storage: LocalStorage
   - Protected routes require valid JWT

## Development Workflow

1. **Setup**
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev  # Runs nodemon

   # Frontend
   cd frontend
   npm install
   npm start    # Runs on port 3000
   ```

2. **Environment Configuration**
   - Backend config in `backend/config.js`
   - MongoDB connection string required
   - JWT secret key needed for auth

## Project-Specific Patterns

1. **Error Handling**
   - Centralized error middleware (`errorMiddleware.js`)
   - Frontend error states managed in API utility functions

2. **File Operations**
   - Upload directory: `backend/uploads/`
   - File metadata stored in MongoDB
   - Access control through role middleware

3. **Route Protection**
   - Admin routes: `/api/admin/*`
   - File routes: `/api/files/*`
   - Frontend protected routes wrapper component

## Key Files for Common Tasks

- User Authentication: `backend/routes/auth.js`
- File Management: `backend/routes/files.js`
- Admin Operations: `backend/routes/admin.js`
- Frontend Routing: `frontend/src/App.js`
- API Integration: `frontend/src/utils/api.js`