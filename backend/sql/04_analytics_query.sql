-- ============================================
-- Analytics Report Query - Event Registration Statistics
-- Group 5 - Student 2: Baur, Lennard (12018378)
-- Course: IMSE 2025W
-- ============================================
-- REQUIREMENTS:
-- - Uses data generated from the use case (registration)
-- - Involves 5 entities: Person, Participant, HackathonEvent, Venue, Registration
-- - Filter field: event_type
-- - Shows statistics that change after use case execution
-- ============================================

-- ============================================
-- MAIN ANALYTICS QUERY
-- ============================================

SELECT
    -- Event Information
    he.event_id,
    he.name AS event_name,
    he.event_type,
    he.start_date,
    he.end_date,
    he.max_participants,

    -- Venue Information (Hosts relationship: Venue -> HackathonEvent)
    v.name AS venue_name,
    v.address AS venue_address,
    v.capacity AS venue_capacity,

    -- Registration Statistics
    COUNT(r.registration_number) AS total_registrations,
    ROUND((COUNT(r.registration_number) / he.max_participants) * 100, 2) AS capacity_percentage,

    -- Payment Status Breakdown
    SUM(CASE WHEN r.payment_status = 'completed' THEN 1 ELSE 0 END) AS paid_registrations,
    SUM(CASE WHEN r.payment_status = 'pending' THEN 1 ELSE 0 END) AS pending_payments,

    -- Ticket Type Breakdown
    SUM(CASE WHEN r.ticket_type = 'Standard' THEN 1 ELSE 0 END) AS standard_tickets,
    SUM(CASE WHEN r.ticket_type = 'VIP' THEN 1 ELSE 0 END) AS vip_tickets,
    SUM(CASE WHEN r.ticket_type = 'Student' THEN 1 ELSE 0 END) AS student_tickets,

    -- Participant Details (concatenated list)
    GROUP_CONCAT(
        CONCAT(p.first_name, ' ', p.last_name, ' (', r.ticket_type, ')')
        ORDER BY r.registration_timestamp
        SEPARATOR '; '
    ) AS registered_participants

FROM HackathonEvent he

-- Join Venue (Hosts relationship)
INNER JOIN Venue v ON he.venue_id = v.venue_id

-- Join Registration (Registers relationship: Participant M:N HackathonEvent)
LEFT JOIN Registration r ON he.event_id = r.event_id

-- Join Participant (IS-A Person)
LEFT JOIN Participant pt ON r.person_id = pt.person_id

-- Join Person (base entity for IS-A)
LEFT JOIN Person p ON pt.person_id = p.person_id

-- ============================================
-- FILTER FIELD: event_type
-- ============================================
WHERE he.event_type = 'Hackathon'
  -- Change filter to: 'Conference', 'Workshop', etc.
  -- Or remove WHERE clause to see all events

-- ============================================
-- GROUPING AND ORDERING
-- ============================================
GROUP BY
    he.event_id,
    he.name,
    he.event_type,
    he.start_date,
    he.end_date,
    he.max_participants,
    v.name,
    v.address,
    v.capacity
ORDER BY
    he.start_date DESC,
    total_registrations DESC;

-- ============================================
-- EXPECTED CHANGES AFTER USE CASE EXECUTION
-- ============================================
-- Before use case execution:
--   - AI Innovation Hackathon: 2 registrations
--   - Green Tech Challenge: 2 registrations
--
-- After use case execution (03_usecase_execution.sql):
--   - AI Innovation Hackathon: 3 registrations (Lisa added)
--   - Green Tech Challenge: 3 registrations (Anna added)
--
-- This demonstrates that the analytics report changes
-- after the use case is triggered!
-- ============================================

-- ============================================
-- ALTERNATIVE QUERIES FOR DIFFERENT ANALYSES
-- ============================================

-- Query 1: Registration trends over time
-- SELECT
--     DATE(r.registration_timestamp) AS registration_date,
--     COUNT(*) AS registrations_per_day,
--     SUM(COUNT(*)) OVER (ORDER BY DATE(r.registration_timestamp)) AS cumulative_registrations
-- FROM Registration r
-- GROUP BY DATE(r.registration_timestamp)
-- ORDER BY registration_date;

-- Query 2: Popular events by registration count
-- SELECT
--     e.name,
--     e.event_type,
--     COUNT(r.person_id) AS total_registrations,
--     ROUND(AVG(CASE WHEN r.payment_status = 'completed' THEN 1.0 ELSE 0.0 END) * 100, 2) AS payment_completion_rate
-- FROM HackathonEvent e
-- LEFT JOIN Registration r ON e.event_id = r.event_id
-- GROUP BY e.event_id, e.name, e.event_type
-- HAVING total_registrations > 0
-- ORDER BY total_registrations DESC;

-- Query 3: Participant engagement analysis
-- SELECT
--     p.person_id,
--     CONCAT(p.first_name, ' ', p.last_name) AS participant_name,
--     COUNT(r.event_id) AS events_registered,
--     GROUP_CONCAT(e.name ORDER BY e.start_date SEPARATOR '; ') AS events
-- FROM Person p
-- JOIN Participant pt ON p.person_id = pt.person_id
-- JOIN Registration r ON pt.person_id = r.person_id
-- JOIN HackathonEvent e ON r.event_id = e.event_id
-- GROUP BY p.person_id, p.first_name, p.last_name
-- ORDER BY events_registered DESC;

-- Query 4: Venue utilization analysis
-- SELECT
--     v.name AS venue_name,
--     COUNT(DISTINCT e.event_id) AS events_hosted,
--     SUM(r.registration_count) AS total_registrations,
--     v.capacity,
--     ROUND((SUM(r.registration_count) / (COUNT(DISTINCT e.event_id) * v.capacity)) * 100, 2) AS avg_utilization_percentage
-- FROM Venue v
-- JOIN HackathonEvent e ON v.venue_id = e.venue_id
-- LEFT JOIN (
--     SELECT event_id, COUNT(*) AS registration_count
--     FROM Registration
--     GROUP BY event_id
-- ) r ON e.event_id = r.event_id
-- GROUP BY v.venue_id, v.name, v.capacity
-- ORDER BY avg_utilization_percentage DESC;
