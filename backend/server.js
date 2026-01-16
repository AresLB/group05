const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'hackathon_user',
  password: process.env.DB_PASSWORD || 'hackathon_pass',
  database: process.env.DB_NAME || 'hackathon_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// ============ DATA IMPORT ============
app.post('/api/import-data', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    // Clear existing data
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE Creates');
    await conn.query('TRUNCATE TABLE Evaluates');
    await conn.query('TRUNCATE TABLE Supports');
    await conn.query('TRUNCATE TABLE Registration');
    await conn.query('TRUNCATE TABLE Submission');
    await conn.query('TRUNCATE TABLE Workshop');
    await conn.query('TRUNCATE TABLE HackathonEvent');
    await conn.query('TRUNCATE TABLE Sponsor');
    await conn.query('TRUNCATE TABLE Venue');
    await conn.query('TRUNCATE TABLE InnovationManager');
    await conn.query('TRUNCATE TABLE Judge');
    await conn.query('TRUNCATE TABLE Participant');
    await conn.query('TRUNCATE TABLE Person');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert Persons (50 records)
    const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    
    const persons = [];
    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
      const phone = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      persons.push([i, firstName, lastName, email, phone]);
    }
    await conn.query('INSERT INTO Person (person_id, first_name, last_name, email, phone) VALUES ?', [persons]);

    // Insert Participants (35 records from persons 1-35)
    const tshirtSizes = ['S', 'M', 'L', 'XL'];
    const dietaryRestrictions = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'];
    const participants = [];
    for (let i = 1; i <= 35; i++) {
      participants.push([
        i,
        tshirtSizes[Math.floor(Math.random() * tshirtSizes.length)],
        dietaryRestrictions[Math.floor(Math.random() * dietaryRestrictions.length)]
      ]);
    }
    await conn.query('INSERT INTO Participant (person_id, tshirt_size, dietary_restrictions) VALUES ?', [participants]);

    // Insert Judges (15 records from persons 36-50)
    const expertiseAreas = ['AI/ML', 'Web Development', 'Mobile Apps', 'Blockchain', 'IoT', 'Cloud Computing', 'Cybersecurity', 'Data Science'];
    const judges = [];
    for (let i = 36; i <= 50; i++) {
      judges.push([
        i,
        expertiseAreas[Math.floor(Math.random() * expertiseAreas.length)],
        Math.floor(1 + Math.random() * 20)
      ]);
    }
    await conn.query('INSERT INTO Judge (person_id, expertise_area, years_experience) VALUES ?', [judges]);

    // Insert Innovation Managers (5 records - some participants manage others)
    const innovationManagers = [
      [1, 2], [1, 3], [5, 6], [5, 7], [10, 11]
    ];
    await conn.query('INSERT INTO InnovationManager (manager_id, managed_id) VALUES ?', [innovationManagers]);

    // Insert Venues (5 records)
    const venues = [
      [1, 'Tech Innovation Center', '123 Silicon Valley Blvd, San Jose, CA', 500],
      [2, 'University Conference Hall', '456 Academic Ave, Palo Alto, CA', 300],
      [3, 'Downtown Convention Center', '789 Main St, San Francisco, CA', 1000],
      [4, 'Startup Hub', '321 Entrepreneur Way, Oakland, CA', 200],
      [5, 'Digital Campus', '654 Future Dr, Mountain View, CA', 400]
    ];
    await conn.query('INSERT INTO Venue (venue_id, name, address, capacity) VALUES ?', [venues]);

    // Insert Sponsors (8 records)
    const sponsors = [
      [1, 'TechCorp Inc', 'Platinum', 50000.00],
      [2, 'Innovation Labs', 'Gold', 25000.00],
      [3, 'Cloud Solutions', 'Silver', 10000.00],
      [4, 'DataDriven Co', 'Gold', 25000.00],
      [5, 'AI Ventures', 'Platinum', 50000.00],
      [6, 'StartupBoost', 'Bronze', 5000.00],
      [7, 'CodeFactory', 'Silver', 10000.00],
      [8, 'DevTools Inc', 'Bronze', 5000.00]
    ];
    await conn.query('INSERT INTO Sponsor (sponsor_id, name, tier, contribution_amount) VALUES ?', [sponsors]);

    // Insert Hackathon Events (5 records)
    const events = [
      [1, 'AI Innovation Hackathon 2025', '2025-03-15', '2025-03-17', 1, 200],
      [2, 'Web3 Dev Challenge', '2025-04-01', '2025-04-03', 2, 150],
      [3, 'Green Tech Hackathon', '2025-05-10', '2025-05-12', 3, 300],
      [4, 'Mobile App Sprint', '2025-06-20', '2025-06-22', 4, 100],
      [5, 'Cloud Computing Challenge', '2025-07-05', '2025-07-07', 5, 250]
    ];
    await conn.query('INSERT INTO HackathonEvent (event_id, name, start_date, end_date, venue_id, max_participants) VALUES ?', [events]);

    // Insert Workshops (10 records)
    const workshops = [
      [1, 'Intro to Machine Learning', 1, '2025-03-15 10:00:00', 120],
      [2, 'Advanced Neural Networks', 1, '2025-03-16 14:00:00', 90],
      [3, 'Blockchain Basics', 2, '2025-04-01 09:00:00', 60],
      [4, 'Smart Contract Development', 2, '2025-04-02 11:00:00', 90],
      [5, 'Sustainable Tech Solutions', 3, '2025-05-10 10:00:00', 120],
      [6, 'React Native Masterclass', 4, '2025-06-20 09:00:00', 180],
      [7, 'Flutter Development', 4, '2025-06-21 14:00:00', 120],
      [8, 'AWS Fundamentals', 5, '2025-07-05 10:00:00', 90],
      [9, 'Kubernetes Workshop', 5, '2025-07-06 09:00:00', 120],
      [10, 'DevOps Best Practices', 5, '2025-07-06 14:00:00', 90]
    ];
    await conn.query('INSERT INTO Workshop (workshop_id, title, event_id, scheduled_time, duration_minutes) VALUES ?', [workshops]);

    // Insert Supports (sponsor-event relationships)
    const supports = [
      [1, 1], [2, 1], [3, 1],
      [1, 2], [4, 2],
      [5, 3], [6, 3], [7, 3],
      [2, 4], [8, 4],
      [1, 5], [5, 5], [3, 5]
    ];
    await conn.query('INSERT INTO Supports (sponsor_id, event_id) VALUES ?', [supports]);

    // Insert Registrations (40 records)
    const ticketTypes = ['General', 'VIP', 'Student'];
    const paymentStatuses = ['Completed', 'Pending', 'Completed', 'Completed'];
    const registrations = [];
    let regId = 1;
    for (let eventId = 1; eventId <= 5; eventId++) {
      const numRegs = 5 + Math.floor(Math.random() * 5);
      const usedParticipants = new Set();
      for (let j = 0; j < numRegs; j++) {
        let participantId;
        do {
          participantId = 1 + Math.floor(Math.random() * 35);
        } while (usedParticipants.has(participantId));
        usedParticipants.add(participantId);
        const regDate = new Date(2025, eventId, Math.floor(1 + Math.random() * 28));
        registrations.push([
          regId++,
          participantId,
          eventId,
          regDate.toISOString().split('T')[0],
          ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
          paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
        ]);
      }
    }
    await conn.query('INSERT INTO Registration (registration_id, participant_id, event_id, registration_date, ticket_type, payment_status) VALUES ?', [registrations]);

    // Insert Submissions (25 records)
    const projectNames = ['SmartAssist AI', 'EcoTracker', 'HealthHub', 'LearnBot', 'CryptoWallet', 'FoodShare', 'TaskMaster', 'WeatherNow', 'FitTrack', 'NewsDigest', 'BudgetBuddy', 'TravelPlanner', 'CodeReview AI', 'MeetingBot', 'DataViz Pro'];
    const techStacks = ['React, Node.js, MongoDB', 'Python, TensorFlow, Flask', 'Vue.js, Django, PostgreSQL', 'React Native, Firebase', 'Solidity, Web3.js, React', 'Angular, Spring Boot, MySQL', 'Next.js, Prisma, PostgreSQL', 'Flutter, Dart, Firebase'];
    const submissions = [];
    for (let i = 1; i <= 25; i++) {
      const eventId = 1 + Math.floor(Math.random() * 5);
      const isTeam = Math.random() > 0.4;
      const submitDate = new Date(2025, eventId + 2, 16 + Math.floor(Math.random() * 2));
      submissions.push([
        i,
        eventId,
        `${projectNames[i % projectNames.length]} v${i}`,
        `An innovative solution for ${['healthcare', 'education', 'finance', 'environment', 'productivity'][Math.floor(Math.random() * 5)]} challenges.`,
        techStacks[Math.floor(Math.random() * techStacks.length)],
        `https://github.com/team${i}/project${i}`,
        isTeam ? 'Team' : 'Individual',
        submitDate.toISOString().split('T')[0]
      ]);
    }
    await conn.query('INSERT INTO Submission (submission_id, event_id, project_name, description, tech_stack, repository_url, submission_type, submission_date) VALUES ?', [submissions]);

    // Insert Creates (participant-submission relationships)
    const creates = [];
    for (let subId = 1; subId <= 25; subId++) {
      const numCreators = 1 + Math.floor(Math.random() * 3);
      const usedParticipants = new Set();
      for (let j = 0; j < numCreators; j++) {
        let participantId;
        do {
          participantId = 1 + Math.floor(Math.random() * 35);
        } while (usedParticipants.has(participantId));
        usedParticipants.add(participantId);
        creates.push([participantId, subId]);
      }
    }
    await conn.query('INSERT INTO Creates (participant_id, submission_id) VALUES ?', [creates]);

    // Insert Evaluates (judge-submission relationships with scores)
    const evaluates = [];
    for (let subId = 1; subId <= 25; subId++) {
      const numJudges = 1 + Math.floor(Math.random() * 2);
      const usedJudges = new Set();
      for (let j = 0; j < numJudges; j++) {
        let judgeId;
        do {
          judgeId = 36 + Math.floor(Math.random() * 15);
        } while (usedJudges.has(judgeId));
        usedJudges.add(judgeId);
        evaluates.push([
          judgeId,
          subId,
          Math.floor(60 + Math.random() * 41),
          ['Great innovation!', 'Solid technical implementation.', 'Needs more polish.', 'Excellent presentation.', 'Good concept, execution could improve.'][Math.floor(Math.random() * 5)]
        ]);
      }
    }
    await conn.query('INSERT INTO Evaluates (judge_id, submission_id, score, feedback) VALUES ?', [evaluates]);

    await conn.commit();
    res.json({ success: true, message: 'Data imported successfully!' });
  } catch (error) {
    await conn.rollback();
    console.error('Import error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    conn.release();
  }
});

// ============ PERSONS & PARTICIPANTS ============
app.get('/api/persons', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Person ORDER BY person_id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/participants', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.person_id, p.first_name, p.last_name, p.email, p.phone,
             pt.tshirt_size, pt.dietary_restrictions
      FROM Person p
      JOIN Participant pt ON p.person_id = pt.person_id
      ORDER BY p.person_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EVENTS ============
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, v.name as venue_name, v.address as venue_address,
             (SELECT COUNT(*) FROM Registration r WHERE r.event_id = e.event_id) as registration_count
      FROM HackathonEvent e
      JOIN Venue v ON e.venue_id = v.venue_id
      ORDER BY e.start_date
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, v.name as venue_name, v.address as venue_address, v.capacity as venue_capacity
      FROM HackathonEvent e
      JOIN Venue v ON e.venue_id = v.venue_id
      WHERE e.event_id = ?
    `, [req.params.id]);
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ REGISTRATIONS (Student 2 Use Case) ============
app.get('/api/registrations', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, p.first_name, p.last_name, p.email, e.name as event_name
      FROM Registration r
      JOIN Person p ON r.participant_id = p.person_id
      JOIN HackathonEvent e ON r.event_id = e.event_id
      ORDER BY r.registration_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/registrations', async (req, res) => {
  const { participant_id, event_id, ticket_type } = req.body;
  try {
    // Check if already registered
    const [existing] = await pool.query(
      'SELECT * FROM Registration WHERE participant_id = ? AND event_id = ?',
      [participant_id, event_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Participant already registered for this event' });
    }

    // Check event capacity
    const [event] = await pool.query(
      'SELECT max_participants, (SELECT COUNT(*) FROM Registration WHERE event_id = ?) as current_count FROM HackathonEvent WHERE event_id = ?',
      [event_id, event_id]
    );
    if (event[0] && event[0].current_count >= event[0].max_participants) {
      return res.status(400).json({ error: 'Event is at full capacity' });
    }

    const [result] = await pool.query(
      'INSERT INTO Registration (participant_id, event_id, registration_date, ticket_type, payment_status) VALUES (?, ?, CURDATE(), ?, ?)',
      [participant_id, event_id, ticket_type, 'Pending']
    );
    res.json({ success: true, registration_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SUBMISSIONS (Student 1 Use Case) ============
app.get('/api/submissions', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, e.name as event_name,
             GROUP_CONCAT(CONCAT(p.first_name, ' ', p.last_name) SEPARATOR ', ') as creators
      FROM Submission s
      JOIN HackathonEvent e ON s.event_id = e.event_id
      LEFT JOIN Creates c ON s.submission_id = c.submission_id
      LEFT JOIN Person p ON c.participant_id = p.person_id
      GROUP BY s.submission_id
      ORDER BY s.submission_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/submissions', async (req, res) => {
  const { event_id, project_name, description, tech_stack, repository_url, submission_type, participant_ids } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO Submission (event_id, project_name, description, tech_stack, repository_url, submission_type, submission_date) VALUES (?, ?, ?, ?, ?, ?, CURDATE())',
      [event_id, project_name, description, tech_stack, repository_url, submission_type]
    );
    const submissionId = result.insertId;

    // Link participants to submission
    for (const participantId of participant_ids) {
      await conn.query(
        'INSERT INTO Creates (participant_id, submission_id) VALUES (?, ?)',
        [participantId, submissionId]
      );
    }

    await conn.commit();
    res.json({ success: true, submission_id: submissionId });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

// ============ ANALYTICS ============

// Student 1 Analytics: Submissions per participant with tech stacks
app.get('/api/analytics/submissions', async (req, res) => {
  try {
    const [byParticipant] = await pool.query(`
      SELECT p.person_id, CONCAT(p.first_name, ' ', p.last_name) as participant_name,
             COUNT(s.submission_id) as submission_count,
             GROUP_CONCAT(DISTINCT s.tech_stack SEPARATOR ' | ') as tech_stacks
      FROM Person p
      JOIN Participant pt ON p.person_id = pt.person_id
      LEFT JOIN Creates c ON p.person_id = c.participant_id
      LEFT JOIN Submission s ON c.submission_id = s.submission_id
      GROUP BY p.person_id
      HAVING submission_count > 0
      ORDER BY submission_count DESC
    `);

    const [byEvent] = await pool.query(`
      SELECT e.event_id, e.name as event_name, COUNT(s.submission_id) as submission_count
      FROM HackathonEvent e
      LEFT JOIN Submission s ON e.event_id = s.event_id
      GROUP BY e.event_id
      ORDER BY e.start_date
    `);

    const [byTechStack] = await pool.query(`
      SELECT tech_stack, COUNT(*) as count
      FROM Submission
      GROUP BY tech_stack
      ORDER BY count DESC
    `);

    const [submissionTimeline] = await pool.query(`
      SELECT DATE_FORMAT(submission_date, '%Y-%m') as month, COUNT(*) as count
      FROM Submission
      GROUP BY month
      ORDER BY month
    `);

    res.json({ byParticipant, byEvent, byTechStack, submissionTimeline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student 2 Analytics: Registrations per event
app.get('/api/analytics/registrations', async (req, res) => {
  try {
    const [byEvent] = await pool.query(`
      SELECT e.event_id, e.name as event_name, e.max_participants,
             COUNT(r.registration_id) as registration_count,
             ROUND(COUNT(r.registration_id) / e.max_participants * 100, 1) as utilization_pct
      FROM HackathonEvent e
      LEFT JOIN Registration r ON e.event_id = r.event_id
      GROUP BY e.event_id
      ORDER BY e.start_date
    `);

    const [byTicketType] = await pool.query(`
      SELECT ticket_type, COUNT(*) as count
      FROM Registration
      GROUP BY ticket_type
      ORDER BY count DESC
    `);

    const [byPaymentStatus] = await pool.query(`
      SELECT payment_status, COUNT(*) as count
      FROM Registration
      GROUP BY payment_status
    `);

    const [registrationTimeline] = await pool.query(`
      SELECT DATE_FORMAT(registration_date, '%Y-%m') as month, COUNT(*) as count
      FROM Registration
      GROUP BY month
      ORDER BY month
    `);

    res.json({ byEvent, byTicketType, byPaymentStatus, registrationTimeline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
