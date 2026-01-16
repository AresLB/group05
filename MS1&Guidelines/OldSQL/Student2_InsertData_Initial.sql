-- INITIAL INSERT STATEMENTS (Before Use Case Execution)
-- Student: Baur Lennard - 12018378

-- Insert Venues
INSERT INTO Venue (venue_id, name, address, capacity, facilities) VALUES
(1, 'Tech Hub Vienna', 'Mariahilfer Straße 123, 1060 Vienna', 500, 'WiFi, Projectors, Catering'),
(2, 'Innovation Center', 'Praterstraße 45, 1020 Vienna', 300, 'WiFi, Breakout Rooms, Parking'),
(3, 'Startup Campus', 'Neubaugasse 78, 1070 Vienna', 200, 'WiFi, Kitchen, Lounge Area');

-- Insert Persons
INSERT INTO Person (person_id, first_name, last_name, email, phone) VALUES
(1, 'Anna', 'Mueller', 'anna.mueller@email.com', '+43 650 1234567'),
(2, 'Michael', 'Schmidt', 'michael.schmidt@email.com', '+43 660 2345678'),
(3, 'Sarah', 'Weber', 'sarah.weber@email.com', '+43 670 3456789'),
(4, 'David', 'Fischer', 'david.fischer@email.com', '+43 680 4567890'),
(5, 'Lisa', 'Wagner', 'lisa.wagner@email.com', '+43 690 5678901'),
(6, 'Thomas', 'Bauer', 'thomas.bauer@email.com', '+43 699 6789012');

-- Insert Participants
INSERT INTO Participant (person_id, registration_date, t_shirt_size, dietary_restrictions, manager_id) VALUES
(1, '2024-01-15', 'M', 'Vegetarian', NULL),
(2, '2024-02-20', 'L', NULL, 1),
(3, '2024-03-10', 'S', 'Vegan', 1),
(4, '2024-04-05', 'XL', 'Gluten-free', NULL),
(5, '2024-05-12', 'M', NULL, 4);

-- Insert Judge 
INSERT INTO Judge (person_id, expertise_area, years_experience, organization) VALUES
(6, 'Artificial Intelligence', 10, 'TU Wien');

-- Insert HackathonEvents
INSERT INTO HackathonEvent (event_id, name, start_date, end_date, event_type, max_participants, venue_id) VALUES
(1, 'AI Innovation Hackathon 2025', '2025-03-15', '2025-03-17', 'Hackathon', 150, 1),
(2, 'Web Development Conference', '2025-04-20', '2025-04-21', 'Conference', 200, 2),
(3, 'Green Tech Challenge', '2025-05-10', '2025-05-12', 'Hackathon', 100, 3),
(4, 'Cybersecurity Workshop Series', '2025-06-05', '2025-06-07', 'Workshop', 80, 2);

-- Insert Sponsors 
INSERT INTO Sponsor (sponsor_id, company_name, industry, website, contribution_amount) VALUES
(1, 'Tech Corp', 'Technology', 'https://techcorp.com', 10000.00),
(2, 'Green Solutions', 'Sustainability', 'https://greensolutions.com', 5000.00);

-- Insert Workshops 
INSERT INTO Workshop (workshop_id, title, description, duration, skill_level, max_attendees, event_id) VALUES
(1, 'Intro to Machine Learning', 'Basic ML concepts and applications', 120, 'Beginner', 30, 1),
(2, 'Advanced React Patterns', 'Deep dive into React architecture', 180, 'Advanced', 25, 2);

-- Insert Initial Registrations (BEFORE USE CASE EXECUTION)
INSERT INTO Registration (person_id, event_id, registration_number, registration_timestamp, payment_status, ticket_type) VALUES
(1, 1, 'REG-2025-001', '2025-01-20 10:30:00', 'completed', 'Early Bird'),
(2, 1, 'REG-2025-002', '2025-01-22 14:15:00', 'completed', 'Regular'),
(3, 2, 'REG-2025-003', '2025-02-01 09:00:00', 'pending', 'Student'),
(4, 3, 'REG-2025-004', '2025-02-15 16:45:00', 'completed', 'Regular');