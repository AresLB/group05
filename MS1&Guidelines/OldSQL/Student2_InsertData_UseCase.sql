-- USE CASE EXECUTION INSERT STATEMENTS
-- Student: Baur Lennard - 12018378

-- Simulate Lisa (person_id 5) registering for AI Innovation Hackathon
INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type) 
VALUES (5, 1, 'REG-2025-005', '2025-02-25 11:20:00', 'pending', 'Regular');

-- Simulate Anna (person_id 1) registering for Green Tech Challenge
INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type) 
VALUES (1, 3, 'REG-2025-006', '2025-02-26 13:45:00', 'completed', 'Early Bird');

-- Simulate Michael (person_id 2) registering for Web Development Conference
INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type) 
VALUES (2, 2, 'REG-2025-007', '2025-02-27 10:10:00', 'completed', 'Professional');