/**
 * API Module - Handles all HTTP requests
 * Student 2: Baur, Lennard (12018378)
 */

const API = {
    baseURL: '/api',
    currentDB: 'mariadb', // Default database

    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Set current database (mariadb or mongodb)
     */
    setDatabase(db) {
        this.currentDB = db;
    },

    // ============================================
    // MARIADB ENDPOINTS
    // ============================================

    MariaDB: {
        /**
         * Get all events
         */
        async getEvents() {
            return API.request('/mariadb/events');
        },

        /**
         * Get all participants
         */
        async getParticipants() {
            return API.request('/mariadb/participants');
        },

        /**
         * Register participant for event (Student 2 Use Case)
         */
        async registerParticipant(personId, eventId, ticketType, paymentStatus = 'pending') {
            return API.request('/mariadb/register', {
                method: 'POST',
                body: JSON.stringify({
                    personId: parseInt(personId),
                    eventId: parseInt(eventId),
                    ticketType,
                    paymentStatus
                })
            });
        },

        /**
         * Get analytics report (Student 2 Analytics Report)
         */
        async getAnalyticsReport(eventType = null) {
            const query = eventType ? `?eventType=${eventType}` : '';
            return API.request(`/mariadb/report${query}`);
        },

        /**
         * Import/regenerate random data
         */
        async importData() {
            return API.request('/mariadb/import-data', {
                method: 'POST'
            });
        },

        /**
         * Initialize database
         */
        async initializeDatabase() {
            return API.request('/mariadb/initialize', {
                method: 'POST'
            });
        },

        /**
         * Get database statistics
         */
        async getStats() {
            return API.request('/mariadb/stats');
        }
    },

    // ============================================
    // MONGODB ENDPOINTS
    // ============================================

    MongoDB: {
        /**
         * Migrate data from MariaDB to MongoDB
         */
        async migrate() {
            return API.request('/mongodb/migrate', {
                method: 'POST'
            });
        },

        /**
         * Get all events (NoSQL)
         */
        async getEvents() {
            return API.request('/mongodb/events');
        },

        /**
         * Get all participants (NoSQL)
         */
        async getParticipants() {
            return API.request('/mongodb/participants');
        },

        /**
         * Register participant for event (NoSQL version)
         */
        async registerParticipant(personId, eventId, ticketType, paymentStatus = 'pending') {
            return API.request('/mongodb/register', {
                method: 'POST',
                body: JSON.stringify({
                    personId: parseInt(personId),
                    eventId: parseInt(eventId),
                    ticketType,
                    paymentStatus
                })
            });
        },

        /**
         * Get analytics report (NoSQL version)
         */
        async getAnalyticsReport(eventType = null) {
            const query = eventType ? `?eventType=${eventType}` : '';
            return API.request(`/mongodb/report${query}`);
        },

        /**
         * Get database statistics (NoSQL)
         */
        async getStats() {
            return API.request('/mongodb/stats');
        }
    },

    // ============================================
    // DYNAMIC DATABASE CALLS
    // ============================================

    /**
     * Get events from current database
     */
    async getEvents() {
        return this.currentDB === 'mariadb'
            ? this.MariaDB.getEvents()
            : this.MongoDB.getEvents();
    },

    /**
     * Get participants from current database
     */
    async getParticipants() {
        return this.currentDB === 'mariadb'
            ? this.MariaDB.getParticipants()
            : this.MongoDB.getParticipants();
    },

    /**
     * Register participant (current database)
     */
    async registerParticipant(personId, eventId, ticketType, paymentStatus) {
        return this.currentDB === 'mariadb'
            ? this.MariaDB.registerParticipant(personId, eventId, ticketType, paymentStatus)
            : this.MongoDB.registerParticipant(personId, eventId, ticketType, paymentStatus);
    },

    /**
     * Get analytics report (current database)
     */
    async getAnalyticsReport(eventType) {
        return this.currentDB === 'mariadb'
            ? this.MariaDB.getAnalyticsReport(eventType)
            : this.MongoDB.getAnalyticsReport(eventType);
    },

    /**
     * Get database statistics (current database)
     */
    async getStats() {
        return this.currentDB === 'mariadb'
            ? this.MariaDB.getStats()
            : this.MongoDB.getStats();
    }
};
