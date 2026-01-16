-- ============================================
-- Generate Random Test Data
-- Group 5 - Student 2: Baur, Lennard (12018378)
-- Course: IMSE 2025W
-- ============================================
-- This script generates randomized data for testing purposes
-- Used for the "DB-filling script" requirement in MS2 Section 2.2.1
-- Can be triggered via GUI button to replace existing data
-- ============================================

-- ============================================
-- CLEAR EXISTING DATA
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Evaluates;
TRUNCATE TABLE Creates;
TRUNCATE TABLE Supports;
TRUNCATE TABLE Registration;
TRUNCATE TABLE Workshop;
TRUNCATE TABLE Submission;
TRUNCATE TABLE HackathonEvent;
TRUNCATE TABLE Sponsor;
TRUNCATE TABLE Venue;
TRUNCATE TABLE Judge;
TRUNCATE TABLE Participant;
TRUNCATE TABLE Person;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- GENERATE PERSONS (30 persons)
-- ============================================

INSERT INTO Person (first_name, last_name, email, phone) VALUES
-- Batch 1
('Alexander', 'Meier', 'alexander.meier@email.com', '+43 650 1000001'),
('Sophie', 'Schneider', 'sophie.schneider@email.com', '+43 660 1000002'),
('Maximilian', 'Fischer', 'max.fischer@email.com', '+43 670 1000003'),
('Laura', 'Weber', 'laura.weber@email.com', '+43 680 1000004'),
('Felix', 'Wagner', 'felix.wagner@email.com', '+43 690 1000005'),
('Emma', 'Becker', 'emma.becker@email.com', '+43 699 1000006'),
('Paul', 'Schulz', 'paul.schulz@email.com', '+43 676 1000007'),
('Anna', 'Hoffmann', 'anna.hoffmann@email.com', '+43 664 1000008'),
('Lukas', 'Koch', 'lukas.koch@email.com', '+43 681 1000009'),
('Marie', 'Bauer', 'marie.bauer@email.com', '+43 688 1000010'),

-- Batch 2
('Jonas', 'Richter', 'jonas.richter@email.com', '+43 650 2000001'),
('Lena', 'Klein', 'lena.klein@email.com', '+43 660 2000002'),
('Noah', 'Wolf', 'noah.wolf@email.com', '+43 670 2000003'),
('Mia', 'Schröder', 'mia.schroeder@email.com', '+43 680 2000004'),
('Elias', 'Neumann', 'elias.neumann@email.com', '+43 690 2000005'),
('Hannah', 'Schwarz', 'hannah.schwarz@email.com', '+43 699 2000006'),
('Leon', 'Zimmermann', 'leon.zimmermann@email.com', '+43 676 2000007'),
('Lea', 'Braun', 'lea.braun@email.com', '+43 664 2000008'),
('David', 'Hofmann', 'david.hofmann@email.com', '+43 681 2000009'),
('Sarah', 'Hartmann', 'sarah.hartmann@email.com', '+43 688 2000010'),

-- Batch 3
('Ben', 'Schmitt', 'ben.schmitt@email.com', '+43 650 3000001'),
('Lisa', 'Lange', 'lisa.lange@email.com', '+43 660 3000002'),
('Tim', 'Schmid', 'tim.schmid@email.com', '+43 670 3000003'),
('Julia', 'Krause', 'julia.krause@email.com', '+43 680 3000004'),
('Finn', 'Lehmann', 'finn.lehmann@email.com', '+43 690 3000005'),
('Sophia', 'Huber', 'sophia.huber@email.com', '+43 699 3000006'),
('Jan', 'Vogt', 'jan.vogt@email.com', '+43 676 3000007'),
('Emily', 'Werner', 'emily.werner@email.com', '+43 664 3000008'),
('Tom', 'Lorenz', 'tom.lorenz@email.com', '+43 681 3000009'),
('Clara', 'Baumann', 'clara.baumann@email.com', '+43 688 3000010');

-- ============================================
-- GENERATE PARTICIPANTS (20 participants with hierarchy)
-- ============================================

INSERT INTO Participant (person_id, registration_date, t_shirt_size, dietary_restrictions, manager_id) VALUES
-- Senior participants (no manager)
(1, '2024-01-10', 'L', NULL, NULL),
(5, '2024-01-15', 'M', 'Vegetarian', NULL),
(10, '2024-02-01', 'XL', NULL, NULL),
(15, '2024-02-10', 'L', 'Vegan', NULL),

-- Mid-level participants (managed by seniors)
(2, '2024-03-01', 'M', NULL, 1),
(3, '2024-03-05', 'S', 'Gluten-free', 1),
(6, '2024-03-10', 'L', NULL, 5),
(7, '2024-03-15', 'M', 'Lactose-free', 5),
(11, '2024-04-01', 'XL', NULL, 10),
(12, '2024-04-05', 'L', NULL, 10),
(16, '2024-04-10', 'M', 'Vegetarian', 15),
(17, '2024-04-15', 'S', NULL, 15),

-- Junior participants (managed by mid-level)
(4, '2024-05-01', 'M', NULL, 2),
(8, '2024-05-05', 'L', 'Vegan', 6),
(9, '2024-05-10', 'M', NULL, 7),
(13, '2024-05-15', 'S', NULL, 11),
(14, '2024-05-20', 'XL', 'Gluten-free', 12),
(18, '2024-06-01', 'M', NULL, 16),
(19, '2024-06-05', 'L', NULL, 17),
(20, '2024-06-10', 'M', 'Lactose-free', 17);

-- ============================================
-- GENERATE JUDGES (8 judges, some overlap with participants)
-- ============================================

INSERT INTO Judge (person_id, expertise_area, years_experience, organization) VALUES
-- Dedicated judges
(21, 'Artificial Intelligence', 12, 'TU Wien'),
(22, 'Web Development', 8, 'FH Technikum Wien'),
(23, 'Data Science', 10, 'University of Vienna'),
(24, 'Cybersecurity', 15, 'FH Technikum Wien'),
(25, 'Mobile Development', 7, 'WU Wien'),

-- Overlapping: Both participant and judge (IS-A overlapping)
(1, 'Machine Learning', 9, 'TU Wien'),
(10, 'Cloud Computing', 11, 'University of Vienna'),
(15, 'Blockchain', 6, 'TU Wien');

-- ============================================
-- GENERATE VENUES (6 venues)
-- ============================================

INSERT INTO Venue (name, address, capacity, facilities) VALUES
('Innovation Hub Vienna', 'Mariahilfer Straße 100, 1060 Vienna', 400, 'WiFi, Projectors, Catering, Parking'),
('Tech Center West', 'Neubaugasse 45, 1070 Vienna', 250, 'WiFi, Breakout Rooms, Kitchen'),
('Digital Campus East', 'Praterstraße 80, 1020 Vienna', 350, 'WiFi, Lab Equipment, Lounge'),
('Startup Space North', 'Währinger Straße 120, 1180 Vienna', 200, 'WiFi, Meeting Rooms, Coffee Bar'),
('Future Labs South', 'Favoritenstraße 95, 1100 Vienna', 300, 'WiFi, Workshop Areas, Parking'),
('Creative Studio', 'Gumpendorfer Straße 50, 1060 Vienna', 150, 'WiFi, Art Space, Kitchen');

-- ============================================
-- GENERATE SPONSORS (8 sponsors)
-- ============================================

INSERT INTO Sponsor (company_name, industry, website, contribution_amount) VALUES
('TechVentures GmbH', 'Technology', 'https://techventures.at', 12000.00),
('Innovation Capital', 'Investment', 'https://innovationcapital.com', 15000.00),
('Green Solutions AG', 'Sustainability', 'https://greensolutions.at', 8000.00),
('CyberSafe Austria', 'Cybersecurity', 'https://cybersafe.at', 10000.00),
('CloudFirst Technologies', 'Cloud Computing', 'https://cloudfirst.at', 9000.00),
('AI Research Labs', 'Artificial Intelligence', 'https://airesearch.at', 14000.00),
('StartupBoost Vienna', 'Startup Support', 'https://startupboost.at', 7000.00),
('DataWorks Austria', 'Data Analytics', 'https://dataworks.at', 11000.00);

-- ============================================
-- GENERATE HACKATHON EVENTS (10 events)
-- ============================================

INSERT INTO HackathonEvent (name, start_date, end_date, event_type, max_participants, venue_id) VALUES
('AI Innovation Summit 2025', '2025-03-10', '2025-03-12', 'Hackathon', 200, 1),
('Web3 Revolution', '2025-04-15', '2025-04-17', 'Hackathon', 150, 3),
('Green Tech Challenge', '2025-05-05', '2025-05-07', 'Hackathon', 180, 5),
('Cybersecurity Conference', '2025-06-01', '2025-06-02', 'Conference', 250, 1),
('Mobile App Workshop', '2025-06-20', '2025-06-22', 'Workshop', 100, 4),
('Data Science Bootcamp', '2025-07-10', '2025-07-12', 'Workshop', 120, 2),
('Cloud Computing Summit', '2025-08-05', '2025-08-07', 'Conference', 300, 1),
('Startup Weekend Vienna', '2025-09-15', '2025-09-17', 'Hackathon', 160, 6),
('IoT Innovation Days', '2025-10-01', '2025-10-03', 'Hackathon', 140, 3),
('Blockchain Conference', '2025-11-10', '2025-11-11', 'Conference', 220, 5);

-- ============================================
-- GENERATE WORKSHOPS (Weak Entity - 15 workshops)
-- ============================================

INSERT INTO Workshop (event_id, workshop_number, title, description, duration, skill_level, max_attendees) VALUES
-- AI Innovation Summit
(1, 1, 'Deep Learning Fundamentals', 'Introduction to neural networks and deep learning', 180, 'Beginner', 40),
(1, 2, 'Advanced NLP Techniques', 'Natural language processing with transformers', 240, 'Advanced', 30),

-- Web3 Revolution
(2, 1, 'Smart Contract Development', 'Building secure smart contracts', 180, 'Intermediate', 35),
(2, 2, 'DeFi Applications', 'Decentralized finance application development', 240, 'Advanced', 25),

-- Green Tech Challenge
(3, 1, 'Sustainable Tech Design', 'Eco-friendly software architecture', 120, 'Beginner', 50),
(3, 2, 'IoT for Environment', 'Environmental monitoring with IoT', 180, 'Intermediate', 40),

-- Mobile App Workshop
(5, 1, 'Flutter Development', 'Cross-platform mobile apps with Flutter', 240, 'Intermediate', 45),
(5, 2, 'Mobile UI/UX Design', 'Designing intuitive mobile interfaces', 180, 'Beginner', 50),

-- Data Science Bootcamp
(6, 1, 'Data Analysis with Python', 'Pandas and NumPy for data analysis', 180, 'Beginner', 50),
(6, 2, 'Machine Learning Models', 'Building and deploying ML models', 240, 'Intermediate', 40),
(6, 3, 'Big Data Processing', 'Spark and distributed computing', 180, 'Advanced', 30),

-- Startup Weekend
(8, 1, 'Lean Startup Methodology', 'Building MVPs quickly', 120, 'Beginner', 60),
(8, 2, 'Pitch Perfect Workshop', 'Presenting to investors', 90, 'Beginner', 50),

-- IoT Innovation Days
(9, 1, 'IoT Sensor Networks', 'Building connected sensor systems', 180, 'Intermediate', 35),
(9, 2, 'Edge Computing', 'Processing data at the edge', 180, 'Advanced', 25);

-- ============================================
-- GENERATE REGISTRATIONS (50+ registrations)
-- ============================================

INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type) VALUES
-- AI Innovation Summit (event 1) - 8 registrations
(1, 1, 'REG-2025-0001', '2025-01-15 10:00:00', 'completed', 'Standard'),
(2, 1, 'REG-2025-0002', '2025-01-16 11:30:00', 'completed', 'VIP'),
(3, 1, 'REG-2025-0003', '2025-01-17 09:15:00', 'pending', 'Student'),
(4, 1, 'REG-2025-0004', '2025-01-18 14:20:00', 'completed', 'Standard'),
(5, 1, 'REG-2025-0005', '2025-01-19 16:45:00', 'completed', 'VIP'),
(6, 1, 'REG-2025-0006', '2025-01-20 13:10:00', 'pending', 'Student'),
(7, 1, 'REG-2025-0007', '2025-01-21 10:30:00', 'completed', 'Standard'),
(8, 1, 'REG-2025-0008', '2025-01-22 15:00:00', 'completed', 'VIP'),

-- Web3 Revolution (event 2) - 6 registrations
(2, 2, 'REG-2025-0009', '2025-02-01 09:00:00', 'completed', 'Standard'),
(4, 2, 'REG-2025-0010', '2025-02-02 11:00:00', 'pending', 'Standard'),
(6, 2, 'REG-2025-0011', '2025-02-03 14:00:00', 'completed', 'VIP'),
(10, 2, 'REG-2025-0012', '2025-02-04 10:30:00', 'completed', 'Student'),
(11, 2, 'REG-2025-0013', '2025-02-05 13:15:00', 'pending', 'Standard'),
(12, 2, 'REG-2025-0014', '2025-02-06 16:20:00', 'completed', 'VIP'),

-- Green Tech Challenge (event 3) - 7 registrations
(3, 3, 'REG-2025-0015', '2025-02-10 10:00:00', 'completed', 'Standard'),
(5, 3, 'REG-2025-0016', '2025-02-11 11:30:00', 'completed', 'Standard'),
(7, 3, 'REG-2025-0017', '2025-02-12 09:45:00', 'pending', 'Student'),
(9, 3, 'REG-2025-0018', '2025-02-13 14:00:00', 'completed', 'VIP'),
(13, 3, 'REG-2025-0019', '2025-02-14 15:30:00', 'completed', 'Standard'),
(14, 3, 'REG-2025-0020', '2025-02-15 12:00:00', 'pending', 'Student'),
(15, 3, 'REG-2025-0021', '2025-02-16 10:15:00', 'completed', 'VIP'),

-- Cybersecurity Conference (event 4) - 10 registrations
(1, 4, 'REG-2025-0022', '2025-03-01 09:00:00', 'completed', 'Standard'),
(4, 4, 'REG-2025-0023', '2025-03-02 10:30:00', 'completed', 'VIP'),
(8, 4, 'REG-2025-0024', '2025-03-03 11:00:00', 'pending', 'Student'),
(10, 4, 'REG-2025-0025', '2025-03-04 13:45:00', 'completed', 'Standard'),
(11, 4, 'REG-2025-0026', '2025-03-05 14:20:00', 'completed', 'VIP'),
(12, 4, 'REG-2025-0027', '2025-03-06 15:00:00', 'pending', 'Standard'),
(15, 4, 'REG-2025-0028', '2025-03-07 16:30:00', 'completed', 'Student'),
(16, 4, 'REG-2025-0029', '2025-03-08 09:30:00', 'completed', 'VIP'),
(17, 4, 'REG-2025-0030', '2025-03-09 10:00:00', 'pending', 'Standard'),
(18, 4, 'REG-2025-0031', '2025-03-10 11:45:00', 'completed', 'Standard'),

-- Mobile App Workshop (event 5) - 5 registrations
(2, 5, 'REG-2025-0032', '2025-03-15 10:00:00', 'completed', 'Standard'),
(6, 5, 'REG-2025-0033', '2025-03-16 11:00:00', 'pending', 'Student'),
(9, 5, 'REG-2025-0034', '2025-03-17 13:30:00', 'completed', 'VIP'),
(13, 5, 'REG-2025-0035', '2025-03-18 14:00:00', 'completed', 'Standard'),
(19, 5, 'REG-2025-0036', '2025-03-19 15:30:00', 'pending', 'Student'),

-- Data Science Bootcamp (event 6) - 6 registrations
(3, 6, 'REG-2025-0037', '2025-04-01 09:00:00', 'completed', 'Standard'),
(7, 6, 'REG-2025-0038', '2025-04-02 10:30:00', 'completed', 'VIP'),
(11, 6, 'REG-2025-0039', '2025-04-03 11:45:00', 'pending', 'Student'),
(14, 6, 'REG-2025-0040', '2025-04-04 13:00:00', 'completed', 'Standard'),
(16, 6, 'REG-2025-0041', '2025-04-05 14:30:00', 'completed', 'VIP'),
(20, 6, 'REG-2025-0042', '2025-04-06 15:00:00', 'pending', 'Student'),

-- Cloud Computing Summit (event 7) - 8 registrations
(1, 7, 'REG-2025-0043', '2025-04-10 10:00:00', 'completed', 'VIP'),
(5, 7, 'REG-2025-0044', '2025-04-11 11:00:00', 'completed', 'Standard'),
(8, 7, 'REG-2025-0045', '2025-04-12 09:30:00', 'pending', 'Student'),
(10, 7, 'REG-2025-0046', '2025-04-13 14:00:00', 'completed', 'VIP'),
(12, 7, 'REG-2025-0047', '2025-04-14 15:30:00', 'completed', 'Standard'),
(15, 7, 'REG-2025-0048', '2025-04-15 13:00:00', 'pending', 'Student'),
(17, 7, 'REG-2025-0049', '2025-04-16 10:30:00', 'completed', 'Standard'),
(19, 7, 'REG-2025-0050', '2025-04-17 11:45:00', 'completed', 'VIP');

-- ============================================
-- GENERATE SUBMISSIONS (10 submissions)
-- ============================================

INSERT INTO Submission (project_name, description, submission_time, technology_stack, repository_url) VALUES
('AI Health Assistant', 'AI-powered health monitoring and prediction system', '2025-03-12 16:00:00', 'Python, TensorFlow, Flask, React', 'https://github.com/team1/ai-health'),
('Blockchain Voting System', 'Secure decentralized voting platform', '2025-04-17 15:30:00', 'Solidity, React, Web3.js, IPFS', 'https://github.com/team2/blockchain-vote'),
('Smart Waste Management', 'IoT-based waste collection optimization', '2025-05-07 17:00:00', 'Node.js, React Native, MongoDB, Arduino', 'https://github.com/team3/smart-waste'),
('CyberGuard Suite', 'Comprehensive cybersecurity monitoring tool', '2025-06-02 18:30:00', 'Python, React, PostgreSQL, Docker', 'https://github.com/team4/cyberguard'),
('FitTracker Pro', 'AI-powered fitness tracking mobile app', '2025-06-22 14:00:00', 'Flutter, Firebase, TensorFlow Lite', 'https://github.com/team5/fittracker'),
('DataViz Dashboard', 'Real-time data visualization platform', '2025-07-12 16:45:00', 'React, D3.js, Node.js, TimescaleDB', 'https://github.com/team6/dataviz'),
('CloudSync Manager', 'Multi-cloud resource management system', '2025-08-07 17:30:00', 'Python, React, Kubernetes, Terraform', 'https://github.com/team7/cloudsync'),
('StartupConnect', 'Platform connecting startups with investors', '2025-09-17 15:00:00', 'Node.js, React, MongoDB, Stripe', 'https://github.com/team8/startup-connect'),
('SmartHome Hub', 'Unified IoT home automation system', '2025-10-03 16:15:00', 'Python, React, MQTT, InfluxDB', 'https://github.com/team9/smarthome'),
('CryptoWallet Plus', 'Secure multi-chain crypto wallet', '2025-11-11 18:00:00', 'React Native, Node.js, Web3.js', 'https://github.com/team10/cryptowallet');

-- ============================================
-- GENERATE SUPPORTS (Sponsor-Event relationships)
-- ============================================

INSERT INTO Supports (sponsor_id, event_id) VALUES
(1, 1), (1, 7), (2, 1), (2, 2),
(3, 3), (3, 9), (4, 4), (4, 1),
(5, 7), (6, 1), (6, 6), (7, 8),
(8, 6), (8, 9);

-- ============================================
-- GENERATE CREATES (Participant-Submission relationships)
-- ============================================

INSERT INTO Creates (person_id, submission_id) VALUES
-- Team submissions
(1, 1), (2, 1),           -- AI Health Assistant
(4, 2), (6, 2), (10, 2),  -- Blockchain Voting System (3-person team)
(3, 3), (5, 3),           -- Smart Waste Management
(7, 4), (9, 4),           -- CyberGuard Suite
(8, 5),                    -- FitTracker Pro (solo)
(11, 6), (12, 6),         -- DataViz Dashboard
(13, 7), (14, 7),         -- CloudSync Manager
(15, 8), (16, 8), (17, 8),-- StartupConnect (3-person team)
(18, 9), (19, 9),         -- SmartHome Hub
(20, 10);                  -- CryptoWallet Plus (solo)

-- ============================================
-- GENERATE EVALUATES (Judge-Submission relationships)
-- ============================================

INSERT INTO Evaluates (person_id, submission_id, score, feedback, evaluation_date) VALUES
-- Multiple judges per submission
(21, 1, 88.50, 'Excellent AI implementation, good user interface', '2025-03-12 17:00:00'),
(23, 1, 85.00, 'Strong technical foundation, consider adding more features', '2025-03-12 17:30:00'),
(1, 1, 90.00, 'Outstanding work, very practical application', '2025-03-12 18:00:00'),

(22, 2, 92.00, 'Innovative blockchain use case, well executed', '2025-04-17 16:30:00'),
(24, 2, 87.50, 'Solid security implementation', '2025-04-17 17:00:00'),

(21, 3, 86.00, 'Great environmental impact, good IoT integration', '2025-05-07 18:00:00'),
(10, 3, 84.50, 'Practical solution, could improve scalability', '2025-05-07 18:30:00'),

(24, 4, 91.00, 'Comprehensive security solution, excellent architecture', '2025-06-02 19:00:00'),
(21, 4, 88.00, 'Strong technical implementation', '2025-06-02 19:30:00'),

(25, 5, 89.50, 'Great mobile app design, smooth user experience', '2025-06-22 15:00:00'),
(22, 5, 87.00, 'Good use of Flutter, consider adding social features', '2025-06-22 15:30:00');

-- ============================================
-- VERIFICATION SUMMARY
-- ============================================

SELECT 'Data Generation Complete!' AS Status;

SELECT
    'Persons' AS Entity, COUNT(*) AS Count FROM Person
UNION ALL SELECT 'Participants', COUNT(*) FROM Participant
UNION ALL SELECT 'Judges', COUNT(*) FROM Judge
UNION ALL SELECT 'Venues', COUNT(*) FROM Venue
UNION ALL SELECT 'Sponsors', COUNT(*) FROM Sponsor
UNION ALL SELECT 'Events', COUNT(*) FROM HackathonEvent
UNION ALL SELECT 'Workshops', COUNT(*) FROM Workshop
UNION ALL SELECT 'Registrations', COUNT(*) FROM Registration
UNION ALL SELECT 'Submissions', COUNT(*) FROM Submission
UNION ALL SELECT 'Supports', COUNT(*) FROM Supports
UNION ALL SELECT 'Creates', COUNT(*) FROM Creates
UNION ALL SELECT 'Evaluates', COUNT(*) FROM Evaluates;
