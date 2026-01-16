-- ============================================
-- Initial Sample Data - Before Use Case Execution
-- Group 5 - Student 2: Baur, Lennard (12018378)
-- Course: IMSE 2025W
-- ============================================
-- This file contains INITIAL data before the use case is executed
-- Use Case execution data is in a separate file
-- ============================================

-- ============================================
-- INSERT PERSONS (Base entity for IS-A)
-- ============================================
INSERT INTO Person (person_id, first_name, last_name, email, phone) VALUES
(1, 'Anna', 'Mueller', 'anna.mueller@email.com', '+43 650 1234567'),
(2, 'Michael', 'Schmidt', 'michael.schmidt@email.com', '+43 660 2345678'),
(3, 'Sarah', 'Weber', 'sarah.weber@email.com', '+43 670 3456789'),
(4, 'David', 'Fischer', 'david.fischer@email.com', '+43 680 4567890'),
(5, 'Lisa', 'Wagner', 'lisa.wagner@email.com', '+43 690 5678901'),
(6, 'Thomas', 'Bauer', 'thomas.bauer@email.com', '+43 699 6789012'),
(7, 'Julia', 'Hofer', 'julia.hofer@email.com', '+43 676 7890123'),
(8, 'Markus', 'Gruber', 'markus.gruber@email.com', '+43 664 8901234'),
(9, 'Emma', 'Steiner', 'emma.steiner@email.com', '+43 681 9012345'),
(10, 'Lukas', 'Mayer', 'lukas.mayer@email.com', '+43 688 0123456');

-- ============================================
-- INSERT PARTICIPANTS (IS-A Person)
-- ============================================
-- Note: manager_id creates unary (recursive) relationship
INSERT INTO Participant (person_id, registration_date, t_shirt_size, dietary_restrictions, manager_id) VALUES
(1, '2024-01-15', 'M', 'Vegetarian', NULL),          -- Anna is a senior participant
(2, '2024-02-20', 'L', NULL, 1),                      -- Michael managed by Anna
(3, '2024-03-10', 'S', 'Vegan', 1),                   -- Sarah managed by Anna
(4, '2024-04-05', 'XL', 'Gluten-free', NULL),         -- David is a senior participant
(5, '2024-05-12', 'M', NULL, 4),                      -- Lisa managed by David
(7, '2024-06-01', 'L', 'Lactose-free', 4),            -- Julia managed by David
(8, '2024-06-15', 'M', NULL, NULL),                   -- Markus is a senior participant
(9, '2024-07-20', 'S', NULL, 8);                      -- Emma managed by Markus

-- ============================================
-- INSERT JUDGES (IS-A Person)
-- ============================================
-- Note: IS-A is (total, overlapping) - person can be both Participant and Judge
INSERT INTO Judge (person_id, expertise_area, years_experience, organization) VALUES
(6, 'Artificial Intelligence', 10, 'TU Wien'),
(10, 'Web Development', 8, 'FH Technikum Wien'),
(4, 'Cybersecurity', 12, 'University of Vienna');     -- David is both Participant and Judge

-- ============================================
-- INSERT VENUES
-- ============================================
INSERT INTO Venue (venue_id, name, address, capacity, facilities) VALUES
(1, 'Tech Hub Vienna', 'Mariahilfer Straße 123, 1060 Vienna', 500, 'WiFi, Projectors, Catering, Parking'),
(2, 'Innovation Center', 'Praterstraße 45, 1020 Vienna', 300, 'WiFi, Breakout Rooms, Parking, Kitchen'),
(3, 'Startup Campus', 'Neubaugasse 78, 1070 Vienna', 200, 'WiFi, Kitchen, Lounge Area, Game Room'),
(4, 'Digital Factory', 'Gürtel 12, 1090 Vienna', 400, 'WiFi, Lab Equipment, Meeting Rooms');

-- ============================================
-- INSERT SPONSORS
-- ============================================
INSERT INTO Sponsor (sponsor_id, company_name, industry, website, contribution_amount) VALUES
(1, 'Tech Corp', 'Technology', 'https://techcorp.com', 10000.00),
(2, 'Green Solutions', 'Sustainability', 'https://greensolutions.com', 5000.00),
(3, 'Innovation Labs', 'Research', 'https://innovationlabs.at', 7500.00),
(4, 'Cyber Security Pro', 'Cybersecurity', 'https://cybersecpro.com', 8000.00);

-- ============================================
-- INSERT HACKATHON EVENTS
-- ============================================
-- Hosts relationship: Venue (1) -> HackathonEvent (N)
INSERT INTO HackathonEvent (event_id, name, start_date, end_date, event_type, max_participants, venue_id) VALUES
(1, 'AI Innovation Hackathon 2025', '2025-03-15', '2025-03-17', 'Hackathon', 150, 1),
(2, 'Web Development Conference', '2025-04-20', '2025-04-21', 'Conference', 200, 2),
(3, 'Green Tech Challenge', '2025-05-10', '2025-05-12', 'Hackathon', 100, 3),
(4, 'Cybersecurity Workshop Series', '2025-06-05', '2025-06-07', 'Workshop', 80, 2),
(5, 'Blockchain Summit 2025', '2025-07-15', '2025-07-16', 'Conference', 120, 4);

-- ============================================
-- INSERT WORKSHOPS (WEAK ENTITY - Updated for MS2)
-- ============================================
-- Workshop is now a WEAK ENTITY with composite key (event_id, workshop_number)
-- workshop_number is the partial key - unique within each event
-- Organizes relationship: HackathonEvent (1) -> Workshop (N)
INSERT INTO Workshop (event_id, workshop_number, title, description, duration, skill_level, max_attendees) VALUES
-- Workshops for AI Innovation Hackathon (event_id = 1)
(1, 1, 'Introduction to Machine Learning', 'Learn the basics of ML and neural networks', 120, 'Beginner', 30),
(1, 2, 'Advanced NLP Techniques', 'Deep dive into natural language processing', 180, 'Advanced', 25),
(1, 3, 'Computer Vision Workshop', 'Hands-on with image recognition and processing', 150, 'Intermediate', 20),

-- Workshops for Web Development Conference (event_id = 2)
(2, 1, 'Modern React Patterns', 'Advanced React architecture and best practices', 180, 'Advanced', 25),
(2, 2, 'Full-Stack Development', 'Building complete web applications', 240, 'Intermediate', 30),

-- Workshops for Green Tech Challenge (event_id = 3)
(3, 1, 'Sustainable Tech Solutions', 'Building eco-friendly applications', 120, 'Beginner', 35),
(3, 2, 'IoT for Environmental Monitoring', 'Using sensors and data analytics', 150, 'Intermediate', 20),

-- Workshops for Cybersecurity Workshop Series (event_id = 4)
(4, 1, 'Ethical Hacking Basics', 'Introduction to penetration testing', 180, 'Beginner', 25),
(4, 2, 'Advanced Network Security', 'Securing enterprise networks', 240, 'Advanced', 15),
(4, 3, 'Web Application Security', 'OWASP Top 10 and mitigation strategies', 180, 'Intermediate', 20);

-- ============================================
-- INSERT INITIAL REGISTRATIONS (Before Use Case)
-- ============================================
-- Registers relationship: Participant (M) -> HackathonEvent (N)
-- Student 2 Use Case: Register participant for event
INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type) VALUES
-- AI Innovation Hackathon
(1, 1, 'REG-2025-001', '2025-01-20 10:30:00', 'completed', 'Standard'),
(2, 1, 'REG-2025-002', '2025-01-22 14:15:00', 'completed', 'VIP'),

-- Web Development Conference
(3, 2, 'REG-2025-003', '2025-02-01 09:00:00', 'pending', 'Student'),
(8, 2, 'REG-2025-008', '2025-02-05 11:30:00', 'completed', 'Standard'),

-- Green Tech Challenge
(4, 3, 'REG-2025-004', '2025-02-15 16:45:00', 'completed', 'VIP'),
(7, 3, 'REG-2025-007', '2025-02-18 13:20:00', 'completed', 'Student'),

-- Cybersecurity Workshop Series
(9, 4, 'REG-2025-009', '2025-02-25 10:00:00', 'pending', 'Standard');

-- ============================================
-- INSERT SUBMISSIONS
-- ============================================
INSERT INTO Submission (submission_id, project_name, description, submission_time, technology_stack, repository_url) VALUES
(1, 'AI Health Predictor', 'Machine learning model for health risk prediction', '2025-03-17 14:30:00', 'Python, TensorFlow, Flask', 'https://github.com/team1/ai-health'),
(2, 'Smart Recycling App', 'Mobile app for smart waste sorting', '2025-05-12 16:00:00', 'React Native, Node.js, MongoDB', 'https://github.com/team2/smart-recycle'),
(3, 'SecureChat Platform', 'End-to-end encrypted messaging', '2025-06-07 18:45:00', 'React, Node.js, WebRTC, PostgreSQL', 'https://github.com/team3/securechat');

-- ============================================
-- INSERT SUPPORTS (Sponsor-Event relationship)
-- ============================================
-- Supports relationship: Sponsor (M) -> HackathonEvent (N)
INSERT INTO Supports (sponsor_id, event_id) VALUES
(1, 1),  -- Tech Corp supports AI Innovation Hackathon
(1, 2),  -- Tech Corp supports Web Development Conference
(2, 3),  -- Green Solutions supports Green Tech Challenge
(3, 1),  -- Innovation Labs supports AI Innovation Hackathon
(3, 5),  -- Innovation Labs supports Blockchain Summit
(4, 4);  -- Cyber Security Pro supports Cybersecurity Workshop Series

-- ============================================
-- INSERT CREATES (Participant-Submission relationship)
-- ============================================
-- Creates relationship: Participant (M) -> Submission (N)
-- Allows team submissions
INSERT INTO Creates (person_id, submission_id) VALUES
(1, 1),  -- Anna created AI Health Predictor
(2, 1),  -- Michael created AI Health Predictor (team submission)
(4, 2),  -- David created Smart Recycling App
(7, 2),  -- Julia created Smart Recycling App (team submission)
(9, 3);  -- Emma created SecureChat Platform

-- ============================================
-- INSERT EVALUATES (Judge-Submission relationship)
-- ============================================
-- Evaluates relationship: Judge (M) -> Submission (N) with attributes
INSERT INTO Evaluates (person_id, submission_id, score, feedback, evaluation_date) VALUES
(6, 1, 85.50, 'Excellent use of ML algorithms, good potential for real-world application', '2025-03-17 16:00:00'),
(10, 1, 78.00, 'Strong technical implementation, UI could be improved', '2025-03-17 16:30:00'),
(6, 2, 92.00, 'Innovative approach to sustainability, well executed', '2025-05-12 17:00:00'),
(4, 3, 88.50, 'Strong security implementation, good architecture', '2025-06-07 19:30:00'),
(10, 3, 82.00, 'Solid project, consider adding more features', '2025-06-07 20:00:00');

-- ============================================
-- VERIFICATION
-- ============================================
-- Uncomment to verify data insertion

-- SELECT COUNT(*) AS person_count FROM Person;
-- SELECT COUNT(*) AS participant_count FROM Participant;
-- SELECT COUNT(*) AS judge_count FROM Judge;
-- SELECT COUNT(*) AS workshop_count FROM Workshop;
-- SELECT COUNT(*) AS registration_count FROM Registration;

-- -- Verify weak entity structure
-- SELECT event_id, workshop_number, title FROM Workshop ORDER BY event_id, workshop_number;

-- -- Verify IS-A overlapping (person can be both Participant and Judge)
-- SELECT p.person_id, p.first_name, p.last_name,
--        CASE WHEN pt.person_id IS NOT NULL THEN 'Yes' ELSE 'No' END AS is_participant,
--        CASE WHEN j.person_id IS NOT NULL THEN 'Yes' ELSE 'No' END AS is_judge
-- FROM Person p
-- LEFT JOIN Participant pt ON p.person_id = pt.person_id
-- LEFT JOIN Judge j ON p.person_id = j.person_id;
