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
- **Express.js** - Web application framework
- **Redis** - In-memory caching layer for improved performance

### AI Integration
- **Google Gemini 2.5 Flash** - Free LLM API for AI capabilities

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (installed and running locally)
- **Redis** (installed and running locally, or via Docker)
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

```bash
# Check if PostgreSQL is running
pg_isready
```

#### Create Database
Connect to PostgreSQL and create a new database:

```bash
# Connect to PostgreSQL CLI
psql -U postgres

# Inside psql shell
CREATE DATABASE spur_ai;
\q
```

### 3. Redis Setup

Redis is now integrated for caching LLM responses and database queries. Choose one of the following methods:

#### Using Docker (Recommended)

```bash
# Pull and run Redis container
docker pull redis:latest
docker run -d --name spur-redis -p 6379:6379 redis:latest
```

#### Verify Redis is Running

```bash
redis-cli ping
# Should return: PONG
```

### 4. Backend Setup

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

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

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

### 5. Frontend Setup

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

### 6. Running the Application

#### Quick Start (After Initial Setup)

```bash
# 1. Start Redis (if not already running)
# Using Docker:
docker start spur-redis
# Or using local Redis:
redis-server

# 2. Start Backend (from backend directory)
cd backend
npm run dev

# 3. Build and Start Frontend (from frontend directory)
cd ../frontend
npm run build
npm run preview
```

The application should now be running:
- **Backend API:** `http://localhost:3000`
- **Frontend:** `http://localhost:4173`

## Project Architecture

### Architecture Layers

The backend follows a layered architecture pattern:

1. **Routes Layer** - Defines API endpoints and maps them to controllers
2. **Controller Layer** - Handles HTTP requests/responses and input validation
3. **Service Layer** - Contains business logic and orchestrates data operations
4. **Model Layer** - Defines database schemas and data access patterns
5. **Middleware Layer** - Handles cross-cutting concerns (authentication, logging, error handling)
6. **Caching Layer** - Redis-based caching for improved performance and reduce db calls saving cost

## Known Limitations & Trade-offs

### Current Limitations

#### 1. Error Handling
- **Current State:** Basic error handling implemented
- **Improvement Needed:** More comprehensive error boundaries and user-friendly error messages

### Trade-offs Made

1. **Gemini over OpenAI/Anthropic**
   - **Pro:** Free tier, good performance
   - **Con:** Less mature ecosystem, fewer community resources

2. **Redis Local Setup**
   - **Pro:** Improved performance, reduced API costs
   - **Con:** Additional service to manage during development

## If I Had More Time...

### Strategic Improvements Required

1. **Comprehensive Testing**
   - Unit tests for services and utilities
   - Integration tests for API endpoints
   - Redis cache testing

2. **Enhanced Error Handling**
   - Global error boundary in React
   - Detailed error logging and monitoring
   - User-friendly error messages with retry mechanisms
   - Redis connection fallback handling

3. **Performance Optimizations**
   - Implement request debouncing/throttling
   - Add database query optimization and indexing
   - Enable response compression
   - Implement lazy loading for frontend routes
   - Advanced Redis caching strategies (cache warming, predictive caching)

4. **Advanced Features**
   - File upload and processing capabilities for proofs of damage
   - Export functionality (PDF, PNG etc.)
   - Dark mode support

5. **DevOps & Deployment**
   - Docker Compose for multi-container setup
   - CI/CD pipeline setup

6. **User Experience**
   - Loading states and skeletons
   - Optimistic UI updates

7. **Security Enhancements**
   - Rate limiting per user/IP

## Author

**Krish Shaw**
- GitHub: [@krishshaw418](https://github.com/krishshaw418)

---

**Note:** This project includes Redis caching for improved performance. Ensure Redis is running before starting the backend server.
