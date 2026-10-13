# Movie App — Full-Stack Web Application

A full-stack movie application built with React, Node.js/Express, and PostgreSQL, containerized using Docker Compose. The application integrates with The Movie Database (TMDB) API to allow users to search for movies, manage personal watchlists and favorites, write reviews, and collaborate in custom movie groups.

```text
Browser
   │
   ▼
Frontend :5173
   │
   ▼
Backend :3000
   │
   ▼
PostgreSQL :5432
```

---

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express, JWT Authentication
- **Database:** PostgreSQL
- **Containerization:** Docker Compose
- **Testing:** Vitest, Supertest

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/group8-movieapp/movie-app.git
cd movie-app
```

### 2. Configure Environment Variables

Create your local `.env` configuration file from the provided template:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux / macOS / Git Bash
cp .env.example .env
```

> **Note:** Fill in your required secrets in `.env` (such as `JWT_SECRET` and your `TMDB_API_KEY`).

### 3. Start the Application

Build and run all services with Docker Compose:

```bash
docker compose up --build
```

Once all containers are healthy, access the services:

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)

---

## Running Automated Tests

The backend test suite is executed in the containerized environment against an isolated test database:

```bash
npm test
```

Or directly via Docker Compose:

```bash
docker compose exec backend npm test
```

The test suite covers:

- **Authentication & User Management:** Registration, login, logout, account deletion.
- **Reviews:** Public review browsing, adding authenticated reviews, owner-only deletion.
- **Movies & API:** TMDB integration and endpoint error handling.

---

## Stopping the Application

Stop all running containers:

```bash
docker compose down
```

To stop containers and reset database volumes completely:

```bash
docker compose down -v
```
