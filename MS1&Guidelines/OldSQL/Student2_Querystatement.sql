-- Analytics Report: Event Registration Overview with Participant Details
-- Student: Baur Lennard - 12018378

SELECT 
    he.event_id,
    he.name AS event_name,
    he.event_type,
    he.start_date,
    he.end_date,
    he.max_participants,
    v.name AS venue_name,
    v.address AS venue_address,
    v.capacity AS venue_capacity,
    COUNT(r.registration_number) AS total_registrations,
    COUNT(CASE WHEN r.payment_status = 'completed' THEN 1 END) AS paid_registrations,
    COUNT(CASE WHEN r.payment_status = 'pending' THEN 1 END) AS pending_payments,
    GROUP_CONCAT(
        CONCAT(p.first_name, ' ', p.last_name, ' (', r.ticket_type, ')')
        ORDER BY r.registration_timestamp
        SEPARATOR '; '
    ) AS registered_participants,
    ROUND((COUNT(r.registration_number) / he.max_participants) * 100, 2) AS capacity_percentage
FROM HackathonEvent he
INNER JOIN Venue v ON he.venue_id = v.venue_id
LEFT JOIN Registration r ON he.event_id = r.event_id
LEFT JOIN Participant pt ON r.person_id = pt.person_id
LEFT JOIN Person p ON pt.person_id = p.person_id
WHERE he.event_type = 'Hackathon'  -- FILTER FIELD: Change to 'Conference', 'Workshop', etc.
  AND r.registration_timestamp >= '2024-01-01'  -- Optional: additional time filter
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
ORDER BY he.start_date DESC, total_registrations DESC;