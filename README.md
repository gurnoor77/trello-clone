# Trello Clone

A Kanban-style project management web application built as part of the Scaler AI Labs SDE Intern assignment.

## Tech Stack
- **Frontend:** React.js + Vite
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL
- **Drag & Drop:** @hello-pangea/dnd

## Features
- Create and manage boards
- Create, edit, delete lists with drag and drop reordering
- Create, edit, delete cards with drag and drop between lists
- Card details: description, due date, labels, checklists, member assignment
- Sample data seeded on setup

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Database Setup
```bash
psql -U postgres
CREATE DATABASE trello_clone;
\c trello_clone
```
Run the schema from `backend/src/db/migrations/001_schema.sql`
Run the seeds from `backend/src/db/seeds/seed.sql`

### Backend Setup
```bash
cd backend
npm install
```
Create `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trello_clone
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
```
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## Assumptions
- No authentication required — default user is assumed logged in
- Sample members seeded: Rahul Sharma, Priya Singh, Amit Kumar
- Sample board with 3 lists and 3 cards seeded on setup
- Backend is hosted on Render free tier — first load may take 30-50 seconds to wake up the server. Subsequent requests are fast.