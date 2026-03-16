# BLOOM - Smart Maternal Health App

This is a Final Year Project for a Smart Maternal Health Advisory system.

## Project Structure
- **/backend**: FastAPI (Python) source code.
- **/mobile**: Expo (React Native) source code.

## Setup Instructions

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Create a `.env` file (copy from `.env.example`).
4. Run migrations: `alembic upgrade head`.
5. Start server: `uvicorn main:app --reload`.

### Mobile Setup
1. Navigate to `/mobile`.
2. Install dependencies: `npm install`.
3. Start Expo: `npx expo start`.

## Technology Stack
- **Backend**: FastAPI, SQLAlchemy (Async), Alembic, Neon PostgreSQL.
- **Mobile**: React Native, Expo, React Navigation, Axios.
- **Intelligence**: Rule-based expert system for maternal advice.
