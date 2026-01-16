# SQL Files - Hackathon Management System

## Overview
This directory contains all SQL scripts for the MariaDB database implementation.

## Execution Order

Execute these files in the following order:

### 1. `01_create_tables.sql`
Creates all database tables based on the updated ER diagram from MS2.

**Key Features:**
- **Weak Entity**: Workshop (with composite key: event_id, workshop_number)
- **IS-A Relationship**: Person → Participant/Judge (total, overlapping)
- **Unary Relationship**: Participant manages Participant (1:N)
- **Relationships with Attributes**: Registration, Evaluates

**Tables Created:**
- Person (base entity)
- Participant, Judge (IS-A subclasses)
- Venue, Sponsor
- HackathonEvent
- Workshop (weak entity)
- Submission
- Registration (relationship with attributes)
- Supports, Creates, Evaluates (relationships)

### 2. `02_insert_initial_data.sql`
Inserts initial sample data BEFORE use case execution.

**Data Includes:**
- 10 Persons (some are both Participants and Judges - overlapping IS-A)
- 8 Participants with hierarchical management structure
- 3 Judges
- 4 Venues
- 4 Sponsors
- 5 HackathonEvents
- 10 Workshops (demonstrating weak entity structure)
- 7 initial Registrations
- 3 Submissions with team members
- Sponsor-Event and Judge-Submission relationships

### 3. `03_usecase_execution.sql`
Simulates Student 2's use case: "Register Participant for Event"

**Scenarios:**
- 5 new participant registrations
- Demonstrates M:N relationship (participants can register for multiple events)
- Shows IS-A overlapping (David is both Participant and Judge)
- Different ticket types and payment statuses

**Purpose:**
Demonstrates that the analytics report changes after use case execution.

### 4. `04_analytics_query.sql`
Student 2's analytics report query.

**Query Requirements:**
- Involves 5 entities: Person, Participant, HackathonEvent, Venue, Registration
- Filter field: event_type
- Shows registration statistics, payment status, capacity utilization
- Results change after executing use case (03_usecase_execution.sql)

**Output Columns:**
- Event details (name, dates, type, capacity)
- Venue information
- Registration statistics (total, percentage, payment status)
- List of registered participants with ticket types

### 5. `05_generate_random_data.sql`
Randomized data generation script (for MS2 requirement 2.2.1).

**Features:**
- Clears all existing data
- Generates 30 persons, 20 participants, 8 judges
- Creates 6 venues, 8 sponsors, 10 events
- Generates 15 workshops (demonstrating weak entity)
- Creates 50+ registrations across multiple events
- Includes 10 submissions with team compositions
- Full relationship data (Supports, Creates, Evaluates)

**Usage:**
Can be triggered via GUI button to regenerate test data.

## Quick Start

```bash
# Connect to MariaDB
docker exec -it hackathon_mariadb mariadb -u hackathon_user -phackathon_pass hackathon_db

# Execute all scripts in order
SOURCE /docker-entrypoint-initdb.d/01_create_tables.sql;
SOURCE /docker-entrypoint-initdb.d/02_insert_initial_data.sql;
SOURCE /docker-entrypoint-initdb.d/03_usecase_execution.sql;

# Run analytics query
SOURCE /docker-entrypoint-initdb.d/04_analytics_query.sql;

# Or regenerate random data (replaces existing data)
SOURCE /docker-entrypoint-initdb.d/05_generate_random_data.sql;
```

## Automatic Initialization

When using Docker Compose, the files are automatically executed on first startup:
- Docker mounts this directory to `/docker-entrypoint-initdb.d/`
- MariaDB executes all `.sql` files in alphabetical order
- Files 01-03 are executed automatically on container creation

## Verification Queries

```sql
-- Check Workshop weak entity structure
SELECT event_id, workshop_number, title
FROM Workshop
ORDER BY event_id, workshop_number;

-- Verify IS-A overlapping (people who are both Participant and Judge)
SELECT p.person_id, p.first_name, p.last_name,
       CASE WHEN pt.person_id IS NOT NULL THEN 'Yes' ELSE 'No' END AS is_participant,
       CASE WHEN j.person_id IS NOT NULL THEN 'Yes' ELSE 'No' END AS is_judge
FROM Person p
LEFT JOIN Participant pt ON p.person_id = pt.person_id
LEFT JOIN Judge j ON p.person_id = j.person_id
WHERE pt.person_id IS NOT NULL OR j.person_id IS NOT NULL;

-- Check registration counts per event
SELECT e.name, COUNT(r.person_id) AS registrations
FROM HackathonEvent e
LEFT JOIN Registration r ON e.event_id = r.event_id
GROUP BY e.event_id, e.name
ORDER BY registrations DESC;
```

## Changes from MS1

### Workshop Entity
**Before:** Regular entity with `workshop_id` as primary key
```sql
CREATE TABLE Workshop (
    workshop_id INT PRIMARY KEY AUTO_INCREMENT,
    ...
);
```

**After:** Weak entity with composite key
```sql
CREATE TABLE Workshop (
    event_id INT NOT NULL,
    workshop_number INT NOT NULL,  -- Partial key
    PRIMARY KEY (event_id, workshop_number),
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE,
    ...
);
```

### Registration Entity
**Before/After:** Remains the same - it's a relationship with attributes, not a weak entity
```sql
CREATE TABLE Registration (
    person_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (person_id, event_id),
    ...
);
```

### Cardinality Corrections
- "manages" (Participant → Participant): Fixed to 1:N
- "creates" (Participant → Submission): Fixed to M:N

## Notes

- All tables use InnoDB engine for transaction support
- Proper indexes added for query performance
- Foreign key constraints with appropriate ON DELETE actions
- CHECK constraints for data validation
- Default values for timestamps and status fields

---

**Student:** Baur, Lennard (12018378)
**Course:** IMSE 2025W
**Last Updated:** January 2026
