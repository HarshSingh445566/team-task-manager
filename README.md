# TaskFlow - Team Task Manager

A full-stack project management app with role-based access control.

## 🌐 Live Demo
- Frontend: https://team-task-manager-sooty-nu.vercel.app
- Backend: https://team-task-manager-production-bf6a.up.railway.app

## 🚀 Tech Stack
- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Deployment:** Vercel (frontend) + Railway (backend)

## ✨ Features
- Authentication (Signup/Login)
- Role-based access (Admin/Member)
- Project & team management
- Task creation, assignment & status tracking
- Dashboard with stats (total, overdue, completed)

## ⚙️ Setup
1. Clone the repo
   git clone https://github.com/HarshSingh445566/team-task-manager.git

2. Setup Backend
   cd backend
   npm install
   Create .env file with DB credentials
   npm run dev

3. Setup Frontend
   cd frontend
   npm install
   npm run dev

## 📁 Project Structure
team-task-manager/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        └── context/