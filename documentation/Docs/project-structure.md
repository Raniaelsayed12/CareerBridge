# Project Structure

CareerBridge is separated into a frontend and a backend.

## Backend

The backend is built with Node.js and Express.

Main files:

- `backend/server.js`: contains the API routes
- `backend/local-db.json`: local JSON database used for demo data

The backend provides API endpoints for:

- users
- login
- skills
- projects
- certificates
- documentation files

## Frontend

The frontend is built with Vue.js and Vite.

Main folders:

- `src/components`: reusable components such as the navigation bar
- `src/views`: application pages
- `src/router`: route configuration
- `src/stores`: Pinia user store
- `src/services`: API connection with Axios

## Important Pages

- Home
- Login
- Dashboard
- Skills
- Projects
- Certificates
- Profile
- Resume
- Admin
- Docs

## Data Flow

Users log in with an email and password.  
After login, the frontend stores the current user in the Pinia store.  
The dashboard and management pages load only the data that belongs to the current user.  
The admin page can access and manage all user data.
