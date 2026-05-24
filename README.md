Co-Working Space Reservation System
 
# CoWorkHub – Co-Working Space Reservation System

A full-stack workspace reservation platform that allows members to reserve desks and meeting rooms while providing staff and administrators with dashboard and management tools.

---

## Features

### Authentication & Roles
- JWT Authentication
- Role-based access
- Admin
- Staff
- Member

### Workspace Reservation
- View workspaces
- Reserve desks
- Reserve meeting rooms
- Reservation history
- Reservation status tracking

### Staff Dashboard
- View reservations
- Manage reservation status
- Occupancy overview

### Admin Dashboard
- Create workspace
- Create desk
- Create meeting room
- Delete workspace
- Delete desk
- Delete room
- Analytics dashboard

### Analytics
- Reservation statistics
- Pie chart
- Occupancy metrics
- Member overview

---

## Tech Stack

Frontend:
- ReactJS
- React Router
- Axios
- Recharts
- CSS

Backend:
- NodeJS
- ExpressJS
- SQLite
- JWT
- bcrypt

---

## Project Structure

backend/
frontend/

---

## Setup

### Backend  

cd backend
npm install
npm run dev

### Frontend 
cd frontend
npm install
npm start

---

##  Demo Credentials

### Admin
admin@test.com
admin123

### Staff
staff@test.com
staff123

### Member:   
member@test.com
member123


---

##  API Summary

### Authentication:

POST /api/auth/login

### Reservations:

POST /api/reservations
GET /api/reservations
PUT /api/reservations/:id/status

### Workspaces:

GET /api/workspaces
POST /api/workspaces
POST /api/workspaces/desk
POST /api/workspaces/room

### Dashboard:

GET /api/dashboard/workspace



----------------------------------           