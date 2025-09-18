# cse341-adylansd-project1
Fitness Tracker API

CRUD API for tracking users and their workouts. Built with Node.js + Express + MongoDB (Atlas), documented with Swagger, deployed on Render.

Collections: users (7+ fields), workouts

Features (Week 3): Full CRUD, validation (Joi), error handling (400/404/500), Swagger docs, Render deploy

Live Links

API Base (Render): https://YOUR-APP.onrender.com/

Docs (Swagger): https://YOUR-APP.onrender.com/api-docs

Video (YouTube): https://youtu.be/YOUR_VIDEO_ID

GitHub: https://github.com/YOUR_USER/YOUR_REPO

Replace the placeholders above with your real URLs.

Tech Stack

Runtime: Node.js (ESM import/export)

Framework: Express

DB: MongoDB (Atlas)

Validation: Joi

Docs: swagger-ui-express + swagger-jsdoc

Security/Middlewares: helmet, cors, morgan

Deploy: Render

Requirements

Node.js 18+

MongoDB Atlas cluster (or local MongoDB)

A database user with read/write permissions

Whitelisted IP or 0.0.0.0/0 for dev (Atlas → Network Access)

Getting Started (Local)

Clone & install

git clone https://github.com/YOUR_USER/YOUR_REPO.git
cd YOUR_REPO
npm install


Environment variables

Create .env (never commit credentials):

PORT=3000
MONGODB_URI=mongodb+srv://<USER>:<PASS>@<HOST>.mongodb.net/?retryWrites=true&w=majority&authSource=admin
DB_NAME=fitness_tracker


Optional .env.example (no secrets):

PORT=3000
MONGODB_URI=your-mongodb-connection-string
DB_NAME=fitness_tracker


Run

npm run dev   # nodemon
# or
npm start     # node


Open

API base: http://localhost:3000/

Health: http://localhost:3000/health

Swagger: http://localhost:3000/api-docs

NPM Scripts
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "lint": "eslint .",
    "fmt": "prettier --write ."
  }
}

Project Structure
.
├── server.js
├── /data
│   └── database.js
├── /routes
│   ├── index.js
│   ├── users.js
│   └── workouts.js
├── /controllers
│   ├── usersController.js
│   └── workoutsController.js
├── /validators
│   ├── validate.js
│   ├── usersValidator.js
│   └── workoutsValidator.js
├── /middleware
│   ├── errorHandler.js
│   └── notFound.js
└── /docs
    └── swagger.js

API Overview
Users

GET /api/users — list users

GET /api/users/{id} — get by id

POST /api/users — create

PUT /api/users/{id} — update

DELETE /api/users/{id} — delete

User fields (example):

{
  "name": "Alice Johnson",
  "email": "alice@test.com",
  "age": 25,
  "gender": "female",
  "heightCm": 165,
  "weightKg": 60,
  "goal": "maintenance",
  "activityLevel": "medium",
  "createdAt": "2025-09-17T12:00:00.000Z"
}

Workouts

GET /api/workouts — list (+ optional filters: userId, from, to)

GET /api/workouts/{id} — get by id

POST /api/workouts — create

PUT /api/workouts/{id} — update

DELETE /api/workouts/{id} — delete

Workout fields (example):

{
  "userId": "665c0d7f2b39f0d6b0a0b111",
  "date": "2025-09-18T18:30:00.000Z",
  "type": "run",
  "durationMin": 30,
  "calories": 300,
  "distanceKm": 5,
  "notes": "Morning jog"
}

Validation & Error Handling

Validation (Joi): applied to POST and PUT on Users and Workouts

400 on invalid payload (e.g., negative age/durationMin, bad email, invalid enums, malformed userId)

ID checks: 400 on invalid ObjectId format, 404 if not found

Global errors: notFound → 404; errorHandler → 400/500 with JSON payload

Status codes: 201 (create), 200 (ok), 204 (delete), 400/404/500 (errors)

Swagger (OpenAPI)

Docs: /api-docs

Servers config: set to "/" so it auto-targets the current host (works both local and on Render)

Add your Render URL to the servers array if you want a named option.

Quick Demo Flow (Swagger)

Users:

POST /api/users (201) → copy _id

GET /api/users (200)

GET /api/users/{id} (200)

PUT /api/users/{id} (200)

DELETE /api/users/{id} (204)

Workouts:

POST /api/workouts (201) with a valid userId

GET /api/workouts (200)

GET /api/workouts?userId=...&from=...&to=... (200)

GET /api/workouts/{id} (200), PUT (200), DELETE (204)

Errors:

400 (validation): POST invalid user/workout (e.g., age:-1, durationMin:-10, userId:"abc")

400 (id format): GET /api/users/12345

404 (not found): GET /api/users/000000000000000000000000

Seed (REST Client .http)

Create seed.http and run with VS Code REST Client extension:

@host = http://localhost:3000
# @host = https://YOUR-APP.onrender.com

###
POST {{host}}/api/users
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@test.com",
  "age": 25,
  "gender": "female",
  "heightCm": 165,
  "weightKg": 60,
  "goal": "maintenance",
  "activityLevel": "medium"
}

###
POST {{host}}/api/users
Content-Type: application/json

{
  "name": "Bruno Diaz",
  "email": "bruno@test.com",
  "age": 31,
  "gender": "male",
  "heightCm": 178,
  "weightKg": 80,
  "goal": "lose_weight",
  "activityLevel": "low"
}

###
POST {{host}}/api/users
Content-Type: application/json

{
  "name": "Casey Lee",
  "email": "casey@test.com",
  "age": 28,
  "gender": "other",
  "heightCm": 172,
  "weightKg": 68,
  "goal": "gain_muscle",
  "activityLevel": "high"
}

###
# Replace these with returned ids:
@USER1_ID = 000000000000000000000000

###
POST {{host}}/api/workouts
Content-Type: application/json

{
  "userId": "{{USER1_ID}}",
  "date": "2025-09-17T12:00:00.000Z",
  "type": "run",
  "durationMin": 30,
  "calories": 300,
  "distanceKm": 5
}

Deployment (Render)

Push to GitHub

Render → New Web Service → select repo

Start command: npm start

Environment Variables:

MONGODB_URI (SRV or non-SRV)

DB_NAME=fitness_tracker

PORT (Render sets it; server must use process.env.PORT)

Open https://YOUR-APP.onrender.com/api-docs

Troubleshooting

“Failed to fetch” in Swagger on Render: ensure servers: [{ "url": "/" }] (or pick the Render URL in Servers dropdown).

ENOTFOUND _mongodb._tcp...: wrong SRV host or DNS blocked; copy exact Atlas URI or use non-SRV string.

Authentication failed: wrong DB user/pass; URL-encode special chars; add authSource=admin.

Empty arrays in Render: Render env points to a different DB/cluster than local. Align MONGODB_URI/DB_NAME.

Week 3 Rubric Mapping (Quick)

Endpoints (2 collections, CRUD, status codes):

Validation (POST & PUT, both collections): (Joi)

Error Handling (try/catch + 400/500): (notFound, errorHandler)

Deployment (Render, no secrets in GitHub):