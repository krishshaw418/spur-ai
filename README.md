# Spur AI

A full-stack AI-powered application built with modern web technologies and Google's Gemini 2.5 Flash API.

## Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built with Radix UI and Tailwind

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe server-side code
- **PostgreSQL** - Relational database
- **Express.js** - Web application framework (assumed based on standard Node.js setup)

### AI Integration
- **Google Gemini 2.5 Flash** - Free LLM API for AI capabilities

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (installed and running locally)
- **Git** (for cloning the repository)

## Local Setup Guide

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/krishshaw418/spur-ai.git
cd spur-ai
```

### 2. Database Setup

#### Start PostgreSQL
Ensure PostgreSQL is running on your machine. You can check this with:

#### Create Database
Connect to PostgreSQL and create a new database:

```bash
# Connect to PostgreSQL CLI
psql -U postgres

# Inside psql shell
CREATE DATABASE spur_ai;
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # or create manually
```

#### Configure Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/spur_ai
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spur_ai
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** Replace `your_password` with your PostgreSQL password and `your_gemini_api_key_here` with your actual Gemini API key.

#### Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key and paste it in your `.env` file

#### Run Database Migrations

```bash
# Run migrations to set up database schema
npm run migrate
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # or create manually
```

#### Configure Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_BASE_URL=http://localhost:3000/api
```

### 5. Running the Application

#### Start Backend Server

```bash
# From the backend directory
cd backend
npm run dev
```

The backend server should now be running on `http://localhost:3000` (or your configured PORT).

#### Build and Start Frontend

**Important:** The frontend must be built before running in preview mode.

```bash
# From the frontend directory
cd frontend

# Build the production bundle
npm run build

# Run the preview server
npm run preview
```

The frontend should now be accessible at `http://localhost:4173` (default Vite preview port).

## Project Architecture

### Architecture Layers

The backend follows a layered architecture pattern:

1. **Routes Layer** - Defines API endpoints and maps them to controllers
2. **Controller Layer** - Handles HTTP requests/responses and input validation
3. **Service Layer** - Contains business logic and orchestrates data operations
4. **Model Layer** - Defines database schemas and data access patterns
5. **Middleware Layer** - Handles cross-cutting concerns (authentication, logging, error handling)

## Known Limitations & Trade-offs

### Current Limitations

#### 1. Redis Integration (Incomplete)
- **Status:** Redis setup exists but is not fully integrated
- **Impact:** No caching layer, which may affect performance under high load
- **Reason:** Time constraints during development phase

#### 2. Error Handling
- **Current State:** Basic error handling implemented
- **Improvement Needed:** More comprehensive error boundaries and user-friendly error messages

### Trade-offs Made

1. **Gemini over OpenAI/Anthropic**
   - **Pro:** Free tier, good performance
   - **Con:** Less mature ecosystem, fewer community resources

## If I Had More Time...

### Strategic Improvements Required

1. **Complete Redis Integration**
   - Implement caching for LLM responses
   - Cache frequently accessed database queries

2. **Comprehensive Testing**
   - Unit tests for services and utilities
   - Integration tests for API endpoints

3. **Enhanced Error Handling**
   - Global error boundary in React
   - Detailed error logging and monitoring
   - User-friendly error messages with retry mechanisms

4. **Performance Optimizations**
   - Implement request debouncing/throttling
   - Add database query optimization and indexing
   - Enable response compression
   - Implement lazy loading for frontend routes

5. **Advanced Features**
   - File upload and processing capabilities for proofs of damage
   - Export functionality (PDF, PNG etc.)
   - Dark mode support

6. **DevOps & Deployment**
   - Docker containerization
   - CI/CD pipeline setup
   - Environment-specific configurations
   - Monitoring and logging infrastructure (e.g., Sentry, LogRocket)

7. **User Experience**
    - Loading states and skeletons
    - Optimistic UI updates
    - Offline support with service workers
    - Progressive Web App (PWA) capabilities

## Author

**Krish Shaw**
- GitHub: [@krishshaw418](https://github.com/krishshaw418)

---

**Note:** This project was built under time constraints, and some features (particularly Redis integration) are not yet complete. See the "If I Had More Time" section for planned improvements.
