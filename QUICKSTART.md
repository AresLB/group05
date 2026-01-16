# Quick Start Guide

**Student 2:** Baur, Lennard (12018378)

## Start the Application

```bash
# From the Milestone2 directory
docker compose up --build
```

Wait for all services to start. You'll see:
```
✅ MariaDB connected successfully
✅ MongoDB connected successfully
🚀 Server running on port 3000
```

## Access the Application

Open your browser and navigate to:
- **Frontend:** https://localhost (or http://localhost - will redirect)
- **API:** https://localhost/api/health

**Note:** Accept the self-signed SSL certificate warning.

## Step-by-Step Testing

### 1. Home Page
- View system overview
- See MariaDB and MongoDB features
- Access data management buttons

### 2. Initialize Data (MariaDB)

Click **"Import Random Data (MariaDB)"** on the home page.

This will:
- Generate 30 persons, 20 participants, 8 judges
- Create 10 events, 15 workshops, 50+ registrations
- Populate all tables with realistic test data

### 3. View Events

Click **"Events"** in the navigation.

- See all hackathon events with registration statistics
- Toggle between **MariaDB** and **MongoDB** views
- Note: MongoDB will be empty until you migrate data

### 4. Migrate to MongoDB

Return to **"Home"** and click **"Migrate to MongoDB"**.

This will:
- Copy all data from MariaDB to MongoDB
- Transform relational data to NoSQL document structure
- Embed related data for performance
- Switch view to MongoDB automatically

### 5. Register Participant for Event (Your Use Case!)

Click **"Register"** in the navigation.

**Test Registration:**
1. Select a participant (e.g., "Lisa Wagner")
2. Select an event (e.g., "AI Innovation Hackathon 2025")
3. Choose ticket type (Standard/VIP/Student)
4. Click **"Register"**

**Success:** You'll see a confirmation with registration number.

**Test with both databases:**
- Switch between MariaDB and MongoDB using the toggle
- Register different participants to compare implementations

### 6. View Analytics Report (Your Analytics Report!)

Click **"Analytics"** in the navigation.

**Test Analytics:**
1. Optionally select a filter (e.g., "Hackathon")
2. Click **"Load Analytics Report"**

You'll see:
- Total registrations per event
- Capacity percentage
- Payment status breakdown (Paid vs Pending)
- Ticket type distribution (Standard, VIP, Student)
- List of registered participants

**Compare Databases:**
- Toggle between MariaDB and MongoDB
- Note: Results should be identical (different implementations, same data)

## Verify Your Use Case Works

### Before Registration
1. Go to Analytics
2. Load report (filter by "Hackathon")
3. Note the registration count for "AI Innovation Hackathon 2025"

### Register a New Participant
1. Go to Register
2. Select an unregistered participant
3. Select "AI Innovation Hackathon 2025"
4. Complete registration

### After Registration
1. Go back to Analytics
2. Reload the report
3. **The registration count should increase by 1**
4. **The new participant should appear in the list**

✅ This proves your analytics report changes after use case execution!

## API Testing (Optional)

### Test MariaDB Endpoints

```bash
# Get all events
curl https://localhost/api/mariadb/events -k

# Register participant
curl -X POST https://localhost/api/mariadb/register -k \
  -H "Content-Type: application/json" \
  -d '{
    "personId": 5,
    "eventId": 1,
    "ticketType": "Standard"
  }'

# Get analytics report
curl https://localhost/api/mariadb/report?eventType=Hackathon -k
```

### Test MongoDB Endpoints

```bash
# Migrate data
curl -X POST https://localhost/api/mongodb/migrate -k

# Get events (NoSQL)
curl https://localhost/api/mongodb/events -k

# Register participant (NoSQL)
curl -X POST https://localhost/api/mongodb/register -k \
  -H "Content-Type: application/json" \
  -d '{
    "personId": 7,
    "eventId": 2,
    "ticketType": "VIP"
  }'

# Get analytics report (NoSQL)
curl https://localhost/api/mongodb/report -k
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3000

# Stop conflicting services or change ports in docker-compose.yml
```

### Containers Not Starting
```bash
# View logs
docker compose logs

# Restart services
docker compose restart

# Rebuild from scratch
docker compose down -v
docker compose up --build
```

### Database Connection Issues
```bash
# Check database health
docker compose ps

# Restart databases
docker compose restart mariadb mongodb
```

### Frontend Not Loading
```bash
# Check Nginx logs
docker compose logs frontend

# Verify backend is running
curl http://localhost:3000/api/health
```

## Database Access (Advanced)

### MariaDB Shell
```bash
docker exec -it hackathon_mariadb mariadb -u hackathon_user -phackathon_pass hackathon_db
```

```sql
-- View tables
SHOW TABLES;

-- Check registrations
SELECT * FROM Registration ORDER BY registration_timestamp DESC LIMIT 10;

-- Run your analytics query
SELECT
  he.name AS event_name,
  COUNT(r.person_id) AS total_registrations,
  ROUND((COUNT(r.person_id) / he.max_participants) * 100, 2) AS capacity_percentage
FROM HackathonEvent he
LEFT JOIN Registration r ON he.event_id = r.event_id
WHERE he.event_type = 'Hackathon'
GROUP BY he.event_id, he.name, he.max_participants;
```

### MongoDB Shell
```bash
docker exec -it hackathon_mongodb mongosh -u admin -p adminpass --authenticationDatabase admin
```

```javascript
// Switch to database
use hackathon_nosql

// View collections
show collections

// Check events
db.events.find().pretty()

// Check registrations in events
db.events.findOne({ name: /Hackathon/ }, { name: 1, registrations: 1 })

// Count participants
db.participants.countDocuments()
```

## Stop the Application

```bash
# Stop all services
docker compose down

# Stop and remove all data
docker compose down -v
```

## Features Implemented

### ✅ Student 2 Use Case: Register Participant for Event
- Works with both MariaDB and MongoDB
- Validates participant and event existence
- Checks for duplicate registrations
- Verifies event capacity
- Generates unique registration numbers

### ✅ Student 2 Analytics Report: Event Registration Statistics
- Implemented in SQL (MariaDB) and NoSQL (MongoDB)
- Filter by event type (Hackathon, Conference, Workshop)
- Shows registration counts, capacity percentage
- Payment status breakdown (completed vs pending)
- Ticket type distribution (Standard, VIP, Student)
- List of all registered participants
- Results change after registration (use case execution)

### ✅ Data Migration (MS2 2.3.2)
- One-way migration: MariaDB → MongoDB
- No data recreation (reads from MariaDB, writes to MongoDB)
- Transforms relational to document structure
- Embeds related data for performance
- Creates indexes for query optimization

### ✅ NoSQL Design
- Uses MongoDB `_id` as identifier (no redundant IDs)
- Embedded documents (venues, registrations, workshops)
- Denormalized data (event history, registration counts)
- References for M:N relationships (sponsors)

## Project Structure

```
Milestone2/
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── config/          # Database connections
│   │   ├── services/        # Business logic
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API endpoints
│   │   └── app.js           # Express server
│   ├── sql/                 # SQL scripts
│   └── package.json         # Dependencies
│
├── frontend/                # HTML/CSS/JS
│   ├── public/
│   │   ├── css/style.css   # Styling
│   │   ├── js/api.js       # API calls
│   │   ├── js/app.js       # Main logic
│   │   └── index.html      # UI
│   ├── nginx/
│   │   └── nginx.conf      # Web server config
│   └── Dockerfile          # Frontend container
│
├── docker-compose.yml       # Orchestration
└── README.md                # Documentation
```

---

**Last Updated:** January 2026
**Student:** Baur, Lennard (12018378)
**Course:** IMSE 2025W
