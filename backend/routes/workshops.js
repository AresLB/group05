const express = require('express');
const router = express.Router();

// GET /api/workshops - Get all workshops with event info
router.get('/', async (req, res) => {
    try {
        const [workshops] = await req.mysqlPool.query(`
            SELECT
                w.workshop_number,
                w.event_id,
                w.title,
                w.description,
                w.duration,
                w.skill_level,
                w.max_attendees,
                e.name as event_name,
                e.start_date,
                e.end_date,
                v.name as venue_name
            FROM Workshop w
            JOIN HackathonEvent e ON w.event_id = e.event_id
            LEFT JOIN Venue v ON e.venue_id = v.venue_id
            ORDER BY e.start_date, w.workshop_number
        `);

        res.json({ success: true, data: workshops });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/workshops/events - Get all events (for dropdown selection)
router.get('/events', async (req, res) => {
    try {
        const [events] = await req.mysqlPool.query(`
            SELECT
                e.event_id,
                e.name,
                e.start_date,
                e.end_date,
                e.event_type,
                v.name as venue_name,
                (SELECT COUNT(*) FROM Workshop w WHERE w.event_id = e.event_id) as workshop_count
            FROM HackathonEvent e
            LEFT JOIN Venue v ON e.venue_id = v.venue_id
            ORDER BY e.start_date
        `);

        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/workshops/by-event/:eventId - Get workshops for a specific event
router.get('/by-event/:eventId', async (req, res) => {
    try {
        const [workshops] = await req.mysqlPool.query(`
            SELECT
                w.workshop_number,
                w.event_id,
                w.title,
                w.description,
                w.duration,
                w.skill_level,
                w.max_attendees,
                e.name as event_name
            FROM Workshop w
            JOIN HackathonEvent e ON w.event_id = e.event_id
            WHERE w.event_id = ?
            ORDER BY w.workshop_number
        `, [req.params.eventId]);

        res.json({ success: true, data: workshops });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:eventId/:workshopNumber', async (req, res) => {
    try {
        const [workshops] = await req.mysqlPool.query(`
            SELECT
                w.*,
                e.name as event_name,
                e.start_date,
                e.end_date,
                v.name as venue_name,
                v.address as venue_address
            FROM Workshop w
            JOIN HackathonEvent e ON w.event_id = e.event_id
            LEFT JOIN Venue v ON e.venue_id = v.venue_id
            WHERE w.event_id = ? AND w.workshop_number = ?
        `, [req.params.eventId, req.params.workshopNumber]);

        if (workshops.length === 0) {
            return res.status(404).json({ success: false, error: 'Workshop not found' });
        }

        res.json({ success: true, data: workshops[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { event_id, title, description, duration, skill_level, max_attendees } = req.body;

        // Validation
        if (!event_id || !title) {
            return res.status(400).json({
                success: false,
                error: 'Event and workshop title are required'
            });
        }

        // Check if event exists
        const [eventCheck] = await req.mysqlPool.query(
            'SELECT event_id, name FROM HackathonEvent WHERE event_id = ?',
            [event_id]
        );

        if (eventCheck.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        const [maxNumber] = await req.mysqlPool.query(
            'SELECT COALESCE(MAX(workshop_number), 0) as max_num FROM Workshop WHERE event_id = ?',
            [event_id]
        );
        const nextWorkshopNumber = maxNumber[0].max_num + 1;

        // Insert workshop
        await req.mysqlPool.query(
            `INSERT INTO Workshop (workshop_number, event_id, title, description, duration, skill_level, max_attendees)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nextWorkshopNumber, event_id, title, description || '', duration || 60, skill_level || 'Beginner', max_attendees || 30]
        );

        res.status(201).json({
            success: true,
            message: `Workshop "${title}" created for ${eventCheck[0].name}`,
            data: {
                workshop_number: nextWorkshopNumber,
                event_id: event_id,
                title: title
            }
        });

    } catch (error) {
        console.error('Create workshop error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/workshops/:eventId/:workshopNumber - Update workshop
router.put('/:eventId/:workshopNumber', async (req, res) => {
    try {
        const { eventId, workshopNumber } = req.params;
        const { title, description, duration, skill_level, max_attendees } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Workshop title is required'
            });
        }

        // Check if workshop exists
        const [existing] = await req.mysqlPool.query(
            'SELECT * FROM Workshop WHERE event_id = ? AND workshop_number = ?',
            [eventId, workshopNumber]
        );

        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Workshop not found' });
        }

        // Update workshop
        await req.mysqlPool.query(
            `UPDATE Workshop
             SET title = ?, description = ?, duration = ?, skill_level = ?, max_attendees = ?
             WHERE event_id = ? AND workshop_number = ?`,
            [title, description || '', duration || 60, skill_level || 'Beginner', max_attendees || 30, eventId, workshopNumber]
        );

        res.json({
            success: true,
            message: 'Workshop updated successfully'
        });

    } catch (error) {
        console.error('Update workshop error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/workshops/:eventId/:workshopNumber - Delete workshop
router.delete('/:eventId/:workshopNumber', async (req, res) => {
    try {
        const { eventId, workshopNumber } = req.params;

        const [result] = await req.mysqlPool.query(
            'DELETE FROM Workshop WHERE event_id = ? AND workshop_number = ?',
            [eventId, workshopNumber]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Workshop not found' });
        }

        res.json({ success: true, message: 'Workshop deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
