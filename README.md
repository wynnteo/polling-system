# Real-Time Polling System

A real-time polling system built with **Spring Boot** (backend) and **React** (frontend). This application allows users to create polls, vote on options, and view real-time updates using WebSocket communication. It also includes features like rate limiting and Docker deployment for production readiness.

---

## Features

- **Backend**:
  - REST API for creating polls and voting.
  - Real-time updates using WebSocket.
  - Rate limiting with Resilience4j (3 votes per minute per user).
  - PostgreSQL for production and H2 for development.

- **Frontend**:
  - Create polls with dynamic options.
  - Vote on polls and view real-time results.
  - Visualize poll results using charts (react-chartjs-2).

- **Deployment**:
  - Dockerized backend and frontend.
  - Docker Compose for easy setup with PostgreSQL.

---

## Technologies Used

- **Backend**:
  - Spring Boot
  - Spring WebSocket
  - Spring Data JPA
  - Resilience4j
  - H2 Database (development)
  - PostgreSQL (production)

- **Frontend**:
  - React (TypeScript)
  - Axios (HTTP requests)
  - react-chartjs-2 (charts)
  - @stomp/stompjs (WebSocket client)

- **Deployment**:
  - Docker
  - Docker Compose

---

## Prerequisites

- Java 17
- Node.js 16+
- Docker and Docker Compose
- PostgreSQL (for production)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/polling-system.git
cd polling-system
```
### 2. Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the Spring Boot application:
```bash
mvn clean install
```

3.Build the Docker image:
```bash
docker build -t polling-backend .
```
### 3. Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3.Build the Docker image:
```bash
docker build -t polling-frontend .
```
### 4. Run with Docker Compose
Start the application:
```bash
docker-compose up
```

#### Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Detailed Steps

For a step-by-step guide on how to build and deploy this project, check out my blog post:  
👉 [Real-Time Polling System: Step-by-Step Guide](https://your-blog-link.com)

