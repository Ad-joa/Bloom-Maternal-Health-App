# 🌸 Bloom Maternal Health App

**Bloom Maternal Health App** is a modern, comprehensive maternal and prenatal care mobile platform designed to empower expectant mothers with personalized health tracking, clinical guidance, real-time community support, and emergency locator services.

---

## 🚀 Key Features

- **Personalized Maternal Dashboard**: Daily insights, trimester-specific guidance, pregnancy progress, and key health indicators.
- **Symptom & Vital Logging**: Track symptoms, blood pressure, and weight with automated risk assessment and health alerts.
- **Antenatal Care (ANC) Tracker**: Schedule, manage, and receive reminders for upcoming hospital and clinic visits.
- **Interactive Maternal Tools**:
  - 👶 **Kick Counter**: Session-based fetal movement monitoring.
  - ⏱️ **Contraction Timer**: Real-time labor contraction tracking and frequency calculation.
  - 🧘 **Guided Breathing Exercises**: Visual and animated relaxation tools for stress reduction.
- **Educational Library**: Rich articles, audio podcasts, videos, and books curated for each trimester.
- **Emergency Locator**: Find nearby hospitals, emergency contacts, and medical facilities instantly.
- **Real-Time Community Forum**: Connect with other mothers via real-time websockets (Socket.io).
- **Offline Sync Engine**: Robust offline log storage with automatic background synchronization when online.

---

## 🛠️ Technology Stack

### **Frontend Mobile App**
- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 57)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **UI & Animation**: Expo Blur, Expo Linear Gradient, React Native Reanimated, Lucide Icons
- **Real-Time Communication**: Socket.io Client
- **Local Storage**: AsyncStorage & Expo SQLite

### **Backend API Server**
- **Runtime & Framework**: Node.js + Express.js (TypeScript)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Real-Time WebSockets**: Socket.io
- **Security & Validation**: JWT Authentication, bcryptjs, Helmet headers, Rate Limiting, Zod schema validation

---

## 📁 Project Structure

```
Bloom-Maternal-Health-App/
├── frontend/                   # React Native (Expo) Mobile Application
│   ├── src/
│   │   ├── api/                # Modularized API clients (auth, logs, anc, etc.)
│   │   ├── components/         # Reusable UI components (Typography, Buttons, Cards)
│   │   ├── context/            # Auth and global application state
│   │   ├── screens/            # Application screens (Home, Profile, Community, etc.)
│   │   ├── theme/              # Theme provider, light/dark mode color tokens
│   │   ├── utils/              # Sync engine, notifications, database utilities
│   │   └── i18n/               # Internationalization & translation support
│   ├── App.tsx                 # App entrypoint and Navigation setup
│   └── package.json
│
├── backend-node/               # Express + Prisma Backend API
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.ts             # Initial database seed script
│   ├── src/
│   │   ├── controllers/        # Request controllers
│   │   ├── middleware/         # Auth, validation, & error handling middlewares
│   │   ├── routes/             # Express API routes
│   │   ├── sockets/            # Socket.io real-time chat gateway
│   │   └── index.ts            # Server entry point
│   └── package.json
│
├── docker-compose.yml          # Containerized setup
├── README.md                   # Project documentation
└── package.json                # Root workspace configuration
```

---

## ⚙️ Getting Started

### **Prerequisites**
- Node.js `v18.x` or later
- npm or yarn
- Expo Go app on iOS/Android or an emulator

---

### **1. Environment Configuration**

Create a `.env` file inside `backend-node/`:

```env
PORT=8000
DATABASE_URL="postgresql://username:password@localhost:5432/bloom_db?sslmode=require"
JWT_SECRET="your_secure_jwt_secret_key"
ALLOWED_ORIGIN="*"
```

Create a `.env` file inside `frontend/`:

```env
EXPO_PUBLIC_API_URL="http://localhost:8000"
```

---

### **2. Installation & Setup**

Run the following from the root workspace directory:

```bash
# Install root dependencies
npm install

# Setup Backend
cd backend-node
npm install
npx prisma generate
npx prisma db push

# Setup Frontend
cd ../frontend
npm install
```

---

### **3. Running Development Servers**

From the project root directory:

```bash
# Run both Backend API and Frontend Expo concurrently:
npm run dev:all

# Or run individually:
npm run dev:backend   # Starts Node.js backend on http://localhost:8000
npm run dev:frontend  # Starts Expo development server
```

---

## 📡 API Endpoints Overview

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/register` | `POST` | User registration |
| **Auth** | `/auth/login` | `POST` | User login & JWT token issuance |
| **Logs** | `/logs` | `GET` / `POST` | Symptom & vital logs management |
| **ANC** | `/anc` | `GET` / `POST` | Antenatal care visit scheduling |
| **Education** | `/educational` | `GET` | Filtered articles, podcasts, and videos |
| **Hospitals** | `/hospitals` | `GET` | Emergency locator & facility listings |
| **Kicks** | `/kicks` | `GET` / `POST` | Fetal movement session recording |
| **Contractions** | `/contractions` | `GET` / `POST` | Labor contraction logging |

---

## 🛡️ Security & Performance Enhancements

- **Rate Limiting**: Protects authentication and critical API endpoints against brute force attempts.
- **Static Asset Caching**: Optimized headers for smooth loading of assets and avatars.
- **Prisma Indexing**: Indexed queries on `user_id`, `created_at`, and `category` for low-latency responses.
- **Cross-Origin Protection**: Configured Helmet and CORS parameters for secure client-server communication.

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
