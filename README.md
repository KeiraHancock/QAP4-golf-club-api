# Golf Club Tournament & Membership API
## Author: Keira Hancock

## Overview

This project is a simple Golf Club REST API that models **Members** and **Tournaments**, and demonstrates:

- Object Relational Mapping (ORM) using **Sequelize**
- REST API built with **Express.js**
- Many-to-many relationship between Members and Tournaments
- Search and filter endpoints for both members and tournaments
- Running locally using **SQLite** (no external DB required)
- Docker and AWS RDS deployment steps attempted (documented below)

This QAP is focused on showing understanding of design, ORM, and API patterns rather than a perfect production deployment.

---

## Data Model

### Member

Fields:

- `id` – auto-generated integer primary key
- `name` – Member Name
- `address` – Member Address
- `email` – Member Email Address (unique, validated)
- `phone` – Member Phone Number
- `membershipType` – e.g. "Gold", "Silver", "Student"
- `membershipStartDate` – start date of membership
- `membershipDurationMonths` – duration of membership in months

### Tournament

Fields:

- `id` – auto-generated integer primary key
- `startDate` – tournament start date
- `endDate` – tournament end date
- `location` – location of the tournament
- `entryFee` – entry fee for the tournament
- `cashPrize` – cash prize amount

### Relationships

- A **Member** can participate in many **Tournaments**
- A **Tournament** can have many **Members**
- Implemented as a many-to-many relationship via a join table `MemberTournament` in Sequelize.

---

## Technology Stack

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **SQLite** (for local development and testing)
- **Postman** for API testing
- **(Attempted)** Docker / docker-compose
- **(Attempted)** AWS RDS PostgreSQL

---

## Running the Project Locally (SQLite)

### Prerequisites

- Node.js installed
- npm installed

### Steps

1. Clone or download the repository.
2. In a terminal, go to the project folder:

   ```bash
   cd golf-club-api
   ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the server in development mode:
    ```bash
    npm run dev
    ```
5. You should see logs similar to:
    ```bash
    Connecting to DB (SQLite)...
    Database connection established.
    Database models synchronized.
    Server listening on port 3000
    ```
6. The API will be available at:
    ```bash
    http://localhost:3000
    ```

### Database Choice

For this QAP, I used SQLite with Sequelize for local development:
- Connection is configured in src/models/sqlite.js.
- The models are initialized using that connection in src/models/index.js.
- This avoids the need to run a separate Postgres server or Docker on my local machine, which currently does not support Docker.
The code structure still allows switching to Postgres (e.g. AWS RDS) by changing the Sequelize initialization if needed.

### API Endpoints

Base URL (local):
```bash
http://localhost:3000
```

Health Check
```bash
GET /
```
- Returns ``` { "message": "Golf Club API is running" } when the API is up. ```

Members
Create Member
POST ``` /api/members ```
Body (JSON):
```bash
{
"name": "Keira Hancock",
"address": "123 Test Street",
"email": "keira@example.com",
"phone": "555-1234",
"membershipType": "Gold",
"membershipStartDate": "2025-01-01",
"membershipDurationMonths": 12
}
```
- Description: Adds a new member to the system.

Get / Search Members
- GET ``` /api/members ```
Supports multiple optional query parameters:
name: partial, case-insensitive match on member name
Example: /api/members?name=keira
membershipType: exact match
Example: /api/members?membershipType=Gold
phone: partial phone match
Example: /api/members?phone=555
membershipStartDate: exact date (YYYY-MM-DD)
Example: /api/members?membershipStartDate=2025-01-01
tournamentStartDate: find members that are participating in tournaments starting on this date
Example: /api/members?tournamentStartDate=2025-07-01

Get Single Member
GET ``` /api/members/:id ```
Returns a single member by ID, including the tournaments they are participating in.

Get Tournaments for a Member
GET ``` /api/members/:id/tournaments ```
Returns all tournaments that the given member is registered for.


#### Tournaments
Create Tournament
POST ``` /api/tournaments ```
Body (JSON):
```bash
{
  "startDate": "2025-07-01",
  "endDate": "2025-07-03",
  "location": "St. John’s Golf Club",
  "entryFee": 100.0,
  "cashPrize": 5000.0
}
```
- Description: Creates a new tournament.

Get / Search Tournaments
- GET ``` /api/tournaments ```
Optional query parameters:
- startDate: filter tournaments by start date
Example: /api/tournaments?startDate=2025-07-01
- location: partial, case-insensitive search on location
Example: /api/tournaments?location=John
Returns tournaments along with their participating members.

Add Member to Tournament
POST ``` /api/tournaments/:id/members ```
Body (JSON):
```bash
{
  "memberId": 1
}
```
Description: Adds the specified member to the given tournament.

Get Members in a Tournament
GET ``` /api/tournaments/:id/members ```
Returns all members participating in the specified tournament. This satisfies the requirement to "find all members in a tournament".


### Postman Testing
I tested the API using Postman with the following requests:

- ``` POST /api/members ``` – create a member
- ``` POST /api/tournaments ``` – create a tournament
- ``` POST /api/tournaments/1/members ``` – add member with id = 1 to tournament with id = 1
- ``` GET /api/members ``` – list all members
- ``` GET /api/members?name=keira ``` – search members by name
- ``` GET /api/members?membershipType=Gold ``` – search members by membership type
- ``` GET /api/members?phone=555 ``` – search members by phone
- ``` GET /api/members?tournamentStartDate=2025-07-01 ``` – search members by tournament start date
- ``` GET /api/tournaments ``` – list tournaments
- ``` GET /api/tournaments?startDate=2025-07-01 ``` – search tournaments by start date
- ``` GET /api/tournaments?location=John ``` – search tournaments by location
- ``` GET /api/tournaments/1/members ``` – list all members in a specific tournament
Screenshots of these Postman requests and responses are included as part of the submission.


### Docker Attempt

I created a Dockerfile and docker-compose.yml to containerize the API and database.
However, on my local machine Docker is not available. Running the commands:
docker compose up --build
docker --version
results in:
zsh: command not found: docker
Because Docker Desktop could not be installed or run on this system, I was not able to fully run the project in containers. I have included these configuration files and screenshots of the failed attempts to demonstrate the deployment steps I tried to take.


### AWS RDS Attempt
As a step towards deployment on AWS:
I attempted to create a PostgreSQL RDS instance in AWS.
I went through the RDS creation wizard and reviewed the endpoint, port, database name, and credentials.
Due to time and environment constraints (and no working Docker / Postgres on my laptop), I did not fully switch the running API over to RDS, but the codebase is structured so that switching from SQLite to Postgres would involve only changing the Sequelize initialization.


### Notes for the QAP
All required features for the API (members, tournaments, member–tournament relationship, and search endpoints) are implemented and tested.
Docker and AWS RDS were attempted; limitations and issues are documented instead of ignored.
API behavior and all search endpoints are clearly described in this README for the marker. This QAP took longer than usual due to the failed Docker and RDS attempts.

