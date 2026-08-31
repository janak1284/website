
# Resonance 1.0 - Project Setup Guide

This guide explains how to set up both the frontend and backend of the Resonance 1.0 hackathon landing page and portal from scratch.

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **Python** (3.9 or higher recommended)
- **PostgreSQL Database** (e.g., Neon DB)
- **Google OAuth Client ID** (for Google Sign-In)

## 1. Environment Variables Setup

Ensure you have a `.env` file in the root of your project directory (`new-era-landing`). It should contain the following variables:

```env
# Backend Database Configuration (PostgreSQL with asyncpg driver)
DATABASE_URL=postgresql+asyncpg://user:password@host/dbname

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_string

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

*(Note: If your frontend Vite application needs the Google Client ID, you may also need a `VITE_GOOGLE_CLIENT_ID` variable depending on how your frontend is configured.)*

## 2. Backend Setup (FastAPI)

The backend is built with FastAPI, SQLAlchemy, and PostgreSQL.

1. **Create and activate a virtual environment** (optional but highly recommended):
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate on Windows:
   venv\Scripts\activate
   
   # Activate on macOS/Linux:
   source venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize the Database**:
   The application uses SQLAlchemy to manage tables. If the tables are not created in your Neon DB, you can initialize them by running a quick Python script:
   ```bash
   python -c "import asyncio; from database import init_db; asyncio.run(init_db())"
   ```

4. **Run the FastAPI Development Server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - The API will be available at `http://localhost:8000`
   - The interactive API documentation (Swagger UI) will be available at `http://localhost:8000/docs`

## 3. Frontend Setup (React + Vite)

The frontend is a React application built with Vite, Tailwind CSS, Three.js, and Framer Motion.

1. **Install Node dependencies**:
   ```bash
   npm install
   ```

2. **Run the Vite Development Server**:
   ```bash
   npm run dev
   ```
   - The frontend development server will start, typically available at `http://localhost:5173` (check your terminal output for the exact URL).

## 4. Building for Production

If you need to build the project for a production deployment:

**Frontend**:
```bash
npm run build
```
This will generate optimized static files in the `dist` folder.

**Backend**:
Run the Uvicorn server without the `--reload` flag and consider using Gunicorn with Uvicorn workers for better performance.
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
