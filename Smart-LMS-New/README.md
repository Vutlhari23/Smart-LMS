# Smart LMS

A full-stack Smart Learning Management System built with FastAPI, SQLite, SQLAlchemy, JWT authentication, and a React + Vite frontend.

## Features

- Lecturer / Student role-based access
- JWT authentication
- Course management, assignments, quizzes
- Online quiz proctoring with webcam monitoring
- Responsive React UI with Tailwind CSS
- API documentation via Swagger

## Project Structure

- `backend/`: Python FastAPI backend
- `frontend/`: React + Vite frontend

## Setup

### Backend

1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Open Swagger docs at `http://127.0.0.1:8000/docs`

### Frontend

1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the app at the URL shown by Vite (typically `http://localhost:5173`)

## Notes

- Update `backend/app/core/config.py` secret values for production.
- The frontend uses a lightweight webcam proctoring component.
- SQLite is configured for development and local academic projects.
