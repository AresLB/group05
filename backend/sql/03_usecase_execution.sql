-- ============================================
-- Use Case Execution - Register Participant for Event
-- Group 5 - Student 2: Baur, Lennard (12018378)
-- Course: IMSE 2025W
-- ============================================
-- This file simulates the execution of Student 2's use case:
-- "Register Participant for Event"
--
-- ENTITIES INVOLVED:
-- - Person (superclass in IS-A relationship)
-- - Participant (subclass of Person)
-- - HackathonEvent
-- - Venue (related to HackathonEvent via "hosts")
-- - Registration (relationship with attributes)
--
-- WORKFLOW:
-- 1. Participant selects an event
-- 2. Participant selects ticket type
-- 3. System validates and creates registration
-- ============================================

-- ============================================
-- SCENARIO 1: Lisa registers for AI Hackathon
-- ============================================
-- Lisa (person_id 5) registers for AI Innovation Hackathon (event_id 1)
-- Ticket type: Standard
-- Payment status: pending (will pay on-site)

INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type)
VALUES (5, 1, 'REG-2025-005', '2025-02-25 11:20:00', 'pending', 'Standard');

-- ============================================
-- SCENARIO 2: Anna registers for Green Tech Challenge
-- ============================================
-- Anna (person_id 1) registers for Green Tech Challenge (event_id 3)
-- She's already registered for event 1, demonstrating M:N relationship
-- Ticket type: VIP (early bird)
-- Payment status: completed

INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type)
VALUES (1, 3, 'REG-2025-006', '2025-02-26 13:45:00', 'completed', 'VIP');

-- ============================================
-- SCENARIO 3: Michael registers for Blockchain Summit
-- ============================================
-- Michael (person_id 2) registers for Blockchain Summit (event_id 5)
-- Ticket type: Student
-- Payment status: completed

INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type)
VALUES (2, 5, 'REG-2025-010', '2025-02-27 10:10:00', 'completed', 'Student');

-- ============================================
-- SCENARIO 4: Sarah registers for Cybersecurity Workshop
-- ============================================
-- Sarah (person_id 3) registers for Cybersecurity Workshop Series (event_id 4)
-- Ticket type: Standard
-- Payment status: pending

INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type)
VALUES (3, 4, 'REG-2025-011', '2025-02-28 15:30:00', 'pending', 'Standard');

-- ============================================
-- SCENARIO 5: David registers for Web Development Conference
-- ============================================
-- David (person_id 4) registers for Web Development Conference (event_id 2)
-- Note: David is both a Participant AND a Judge (IS-A overlapping)
-- Ticket type: VIP (as a judge, he gets VIP access)
-- Payment status: completed

INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type)
VALUES (4, 2, 'REG-2025-012', '2025-03-01 09:00:00', 'completed', 'VIP');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Uncomment to verify the use case execution

-- -- Check all registrations for Lisa (person_id 5)
-- SELECT r.registration_number, r.registration_timestamp, r.payment_status, r.ticket_type,
--        e.name AS event_name, e.start_date, v.name AS venue_name
-- FROM Registration r
-- JOIN HackathonEvent e ON r.event_id = e.event_id
-- JOIN Venue v ON e.venue_id = v.venue_id
-- WHERE r.person_id = 5;

-- -- Count registrations per event (should increase after use case execution)
-- SELECT e.event_id, e.name, COUNT(r.person_id) AS registration_count, e.max_participants,
--        ROUND((COUNT(r.person_id) / e.max_participants) * 100, 2) AS capacity_percentage
-- FROM HackathonEvent e
-- LEFT JOIN Registration r ON e.event_id = r.event_id
-- GROUP BY e.event_id, e.name, e.max_participants
-- ORDER BY registration_count DESC;

-- -- Verify IS-A overlapping: David is both Participant and Judge
-- SELECT p.person_id, p.first_name, p.last_name, p.email,
--        pt.registration_date AS participant_since,
--        j.expertise_area AS judge_expertise,
--        COUNT(r.event_id) AS events_registered
-- FROM Person p
-- LEFT JOIN Participant pt ON p.person_id = pt.person_id
-- LEFT JOIN Judge j ON p.person_id = j.person_id
-- LEFT JOIN Registration r ON p.person_id = r.person_id
-- WHERE p.person_id = 4
-- GROUP BY p.person_id, p.first_name, p.last_name, p.email, pt.registration_date, j.expertise_area;

-- -- Check payment status distribution
-- SELECT payment_status, COUNT(*) AS count
-- FROM Registration
-- GROUP BY payment_status;

-- -- Check ticket type distribution
-- SELECT ticket_type, COUNT(*) AS count
-- FROM Registration
-- GROUP BY ticket_type
-- ORDER BY count DESC;
