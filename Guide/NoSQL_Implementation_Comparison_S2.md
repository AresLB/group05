# NoSQL Implementation - Student 2 (Lennard Baur)

## 2.3.3 NoSQL Use Case and Analytics Report - Summary

### Use Case: Manage Workshops

The Workshop CRUD operations were implemented using MongoDB. Workshops are embedded as an array within event documents in the `events` collection:

```json
{
  "_id": 1,
  "name": "AI Hackathon 2025",
  "venue": { "venue_id": 1, "name": "Tech Hub", "capacity": 500 },
  "workshops": [
    { "workshop_number": 1, "title": "Intro to ML", "skill_level": "Beginner", "duration": 90 }
  ]
}
```

**Operations:**
- **Create:** `$push` adds workshop to the `workshops` array
- **Read:** `$unwind` + `$project` extracts workshops with event/venue data
- **Update:** `$set` with positional operator (`workshops.$`) modifies specific workshop
- **Delete:** `$pull` removes workshop from array

### Analytics Report

The report aggregates workshop data using MongoDB's aggregation pipeline, filtering by `skill_level` and including data from Workshop, HackathonEvent, and Venue.

### Comparison with SQL (2.2)

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| Data retrieval | 3 JOINs required | Single collection, embedded data |
| Workshop creation | INSERT statement | $push to array |
| Weak entity enforcement | Foreign key constraint | Physical embedding in parent |
| **Results/Output** | **Identical** | **Identical** |

Both implementations produce the same output: workshop list, summary statistics (total, average duration, skill distribution), and support filtering by skill level.

---

## 2.3.4 NoSQL Analytics Report Statement

### MongoShell Query Syntax

The analytics report query in MongoShell syntax:

```javascript
db.events.aggregate([
  // Stage 1: Unwind the embedded workshops array
  { $unwind: { path: "$workshops", preserveNullAndEmptyArrays: false } },

  // Stage 2: Filter by skill level (optional)
  { $match: { "workshops.skill_level": "Beginner" } },

  // Stage 3: Project required fields from all three entities
  { $project: {
      // Workshop data (weak entity)
      workshop_number: "$workshops.workshop_number",
      workshop_title: "$workshops.title",
      workshop_description: "$workshops.description",
      duration: "$workshops.duration",
      skill_level: "$workshops.skill_level",
      max_attendees: "$workshops.max_attendees",

      // HackathonEvent data (owner entity)
      event_id: "$_id",
      event_name: "$name",
      event_type: "$event_type",
      start_date: "$start_date",
      end_date: "$end_date",

      // Venue data (related entity)
      venue_name: "$venue.name",
      venue_address: "$venue.address",
      venue_capacity: "$venue.capacity"
  }},

  // Stage 4: Sort results
  { $sort: { start_date: 1, workshop_number: 1 } }
])
```

### How Design Impacts Execution

**1. Embedding eliminates JOINs:**
Since workshops and venue data are embedded within event documents, the query accesses a single collection. In SQL, this would require:
```sql
SELECT ... FROM Workshop w
JOIN HackathonEvent e ON w.event_id = e.event_id
JOIN Venue v ON e.venue_id = v.venue_id
```
The NoSQL design reduces I/O operations from 3 table scans to 1 collection scan.

**2. `$unwind` transforms embedded arrays:**
The `$unwind` stage deconstructs the `workshops` array, creating one document per workshop. This is necessary because workshops are embedded, not stored as separate documents.

**3. Filter position matters:**
The `$match` stage is placed after `$unwind` because we filter on `workshops.skill_level`, which only exists after unwinding. This means all events are scanned first, then filtered.

### Compromises Made

**Compromise 1: Post-unwind filtering**
- **Issue:** Filtering happens after `$unwind`, meaning MongoDB must process all workshops before filtering.
- **Mitigation:** For small datasets (typical hackathon scenario), this is acceptable. For large-scale applications, a separate `workshops` collection with indexing would be more efficient.

**Compromise 2: Data duplication**
- **Issue:** Venue data is duplicated across events (denormalization).
- **Mitigation:** This is intentional - venue information rarely changes, and embedding avoids additional lookups. The trade-off favors read performance over storage efficiency.

**Compromise 3: No cross-event workshop queries**
- **Issue:** Finding "all Advanced workshops across all events" requires scanning all event documents.
- **Mitigation:** Created an index on `workshops.skill_level` to optimize this common filter operation.

---

## 2.3.5 NoSQL Indexing

### Implemented Indexes

Two indexes were created to optimize the analytics report:

```javascript
// Index 1: For filtering by skill_level
db.events.createIndex(
  { "workshops.skill_level": 1 },
  { name: "idx_workshops_skill_level" }
)

// Index 2: For sorting by start_date
db.events.createIndex(
  { "start_date": 1 },
  { name: "idx_events_start_date" }
)
```

### How to Test Indexes

**1. Create indexes:**
```bash
curl -X POST http://localhost:3001/api/nosql/indexes/create
```

**2. List indexes:**
```bash
curl http://localhost:3001/api/nosql/indexes/list
```

**3. Get execution stats:**
```bash
curl "http://localhost:3001/api/nosql/analytics/workshops/explain?skillLevel=Beginner"
```

### Execution Stats Analysis

**Actual output from explain query:**
```json
{
  "executionStats": {
    "totalDocsExamined": 10,
    "executionTimeMillis": 2,
    "indexesUsed": "COLLSCAN (no index)"
  }
}
```

**Why COLLSCAN is shown despite indexes existing:**

The aggregation pipeline starts with `$unwind`, which requires MongoDB to load **all** event documents first to deconstruct the embedded `workshops` array. Only after unwinding can the `$match` filter be applied. This is a fundamental characteristic of how aggregation pipelines process embedded arrays.

### Index Impact Discussion

| Metric | Value |
|--------|-------|
| totalDocsExamined | 10 (all event documents) |
| nReturned after $unwind | 26 (total workshops) |
| nReturned after $match | 12 (filtered by skill_level) |
| Scan Type | COLLSCAN |

**Why indexes have limited impact for this specific query:**

1. **Pipeline order constraint:** The `$unwind` stage must process all documents before `$match` can filter. MongoDB cannot use the `workshops.skill_level` index to skip documents because it needs to access the full array to unwind it.

2. **Embedded array trade-off:** This is the inherent compromise of embedding workshops inside events. We gain single-document reads (no JOINs) but lose the ability to efficiently filter before loading documents.

3. **Where indexes DO help:**
   - Direct queries like `db.events.find({"workshops.skill_level": "Beginner"})` CAN use the multikey index
   - The `start_date` index helps with sorting operations
   - For large datasets, indexes still reduce memory usage during sorting

**Alternative design consideration:**
To fully leverage indexing, workshops could be stored in a separate collection with `event_id` reference. This would allow:
```javascript
db.workshops.find({ skill_level: "Beginner" })  // Uses index directly
```
However, this would require `$lookup` (JOIN equivalent), negating the benefits of embedding. For our hackathon use case with moderate data volume, the embedded design with COLLSCAN is acceptable.

### Recommendation

For the current use case (hackathon management with moderate data volume), the embedded design with multikey indexes provides adequate performance. If the application scaled to thousands of events with hundreds of workshops each, migrating to a separate `workshops` collection with direct indexing would be recommended.
