/**
 * Main Application Logic
 * Student 2: Baur, Lennard (12018378)
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const AppState = {
    currentSection: 'home',
    currentDB: 'mariadb',
    events: [],
    participants: []
};

// ============================================
// UI UTILITIES
// ============================================

const UI = {
    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    },

    /**
     * Show alert message
     */
    showAlert(message, type = 'info', containerId = 'registration-result') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    },

    /**
     * Navigate to section
     */
    navigateToSection(sectionId) {
        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        // Update nav menu
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        AppState.currentSection = sectionId;

        // Load data for section
        this.loadSectionData(sectionId);
    },

    /**
     * Load data for current section
     */
    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'events':
                await EventsModule.loadEvents();
                break;
            case 'register':
                await RegistrationModule.loadDropdowns();
                break;
            case 'analytics':
                // Data loads when button is clicked
                break;
        }
    },

    /**
     * Update database selector buttons
     */
    updateDBSelector(db) {
        document.querySelectorAll('.db-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.db === db) {
                btn.classList.add('active');
            }
        });
        AppState.currentDB = db;
        API.setDatabase(db);
    },

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Format percentage
     */
    formatPercentage(value) {
        return `${parseFloat(value).toFixed(2)}%`;
    }
};

// ============================================
// EVENTS MODULE
// ============================================

const EventsModule = {
    /**
     * Load and display events
     */
    async loadEvents() {
        try {
            UI.showLoading();
            const response = await API.getEvents();
            AppState.events = response.data;
            this.renderEvents(response.data);
        } catch (error) {
            UI.showAlert(`Error loading events: ${error.message}`, 'error', 'events-list');
        } finally {
            UI.hideLoading();
        }
    },

    /**
     * Render events table
     */
    renderEvents(events) {
        const container = document.getElementById('events-list');

        if (events.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No events found.</p>';
            return;
        }

        const html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Venue</th>
                            <th>Capacity</th>
                            <th>Registrations</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${events.map(event => `
                            <tr>
                                <td><strong>${event.name || event.event_name}</strong></td>
                                <td><span class="badge badge-info">${event.event_type}</span></td>
                                <td>${UI.formatDate(event.start_date)}</td>
                                <td>${UI.formatDate(event.end_date)}</td>
                                <td>${event.venue_name || event.venue?.name || 'N/A'}</td>
                                <td>${event.max_participants}</td>
                                <td>${event.current_registrations || event.registration_count || 0}</td>
                                <td>
                                    <span class="badge ${event.capacity_percentage > 80 ? 'badge-warning' : 'badge-success'}">
                                        ${UI.formatPercentage(event.capacity_percentage)}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }
};

// ============================================
// REGISTRATION MODULE (Student 2 Use Case)
// ============================================

const RegistrationModule = {
    /**
     * Load participants and events for dropdowns
     */
    async loadDropdowns() {
        try {
            UI.showLoading();

            const [participantsRes, eventsRes] = await Promise.all([
                API.getParticipants(),
                API.getEvents()
            ]);

            AppState.participants = participantsRes.data;
            AppState.events = eventsRes.data;

            this.populateParticipantsDropdown(participantsRes.data);
            this.populateEventsDropdown(eventsRes.data);
        } catch (error) {
            UI.showAlert(`Error loading data: ${error.message}`, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    /**
     * Populate participants dropdown
     */
    populateParticipantsDropdown(participants) {
        const select = document.getElementById('participant-select');
        select.innerHTML = '<option value="">-- Select Participant --</option>';

        participants.forEach(p => {
            const option = document.createElement('option');
            option.value = p.person_id || p._id;
            option.textContent = `${p.first_name} ${p.last_name} (${p.email})`;
            select.appendChild(option);
        });
    },

    /**
     * Populate events dropdown
     */
    populateEventsDropdown(events) {
        const select = document.getElementById('event-select');
        select.innerHTML = '<option value="">-- Select Event --</option>';

        events.forEach(e => {
            const option = document.createElement('option');
            option.value = e.event_id || e._id;
            option.textContent = `${e.name || e.event_name} - ${UI.formatDate(e.start_date)}`;
            select.appendChild(option);
        });
    },

    /**
     * Handle registration form submission
     */
    async handleRegistration(event) {
        event.preventDefault();

        const personId = document.getElementById('participant-select').value;
        const eventId = document.getElementById('event-select').value;
        const ticketType = document.getElementById('ticket-type').value;

        if (!personId || !eventId || !ticketType) {
            UI.showAlert('Please fill in all fields', 'error');
            return;
        }

        try {
            UI.showLoading();

            const result = await API.registerParticipant(
                personId,
                eventId,
                ticketType,
                'pending'
            );

            UI.showAlert(
                `✓ ${result.message}! Registration #${result.registration.registration_number}`,
                'success'
            );

            // Reset form
            event.target.reset();

            // Reload events to show updated registration count
            await this.loadDropdowns();

        } catch (error) {
            UI.showAlert(`✗ Registration failed: ${error.message}`, 'error');
        } finally {
            UI.hideLoading();
        }
    }
};

// ============================================
// ANALYTICS MODULE (Student 2 Analytics Report)
// ============================================

const AnalyticsModule = {
    /**
     * Load and display analytics report
     */
    async loadReport() {
        try {
            UI.showLoading();

            const eventType = document.getElementById('analytics-filter')?.value || null;
            const response = await API.getAnalyticsReport(eventType);

            this.renderReport(response.data);
        } catch (error) {
            UI.showAlert(`Error loading analytics: ${error.message}`, 'error', 'analytics-report');
        } finally {
            UI.hideLoading();
        }
    },

    /**
     * Render analytics report
     */
    renderReport(data) {
        const container = document.getElementById('analytics-report');

        if (data.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No data available for the selected filter.</p>';
            return;
        }

        const html = `
            <div class="card">
                <h3 class="mb-2">Event Registration Statistics</h3>
                <p class="text-muted">Database: <strong>${AppState.currentDB.toUpperCase()}</strong></p>
            </div>

            ${data.map(event => `
                <div class="card">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">
                        ${event.event_name}
                    </h3>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${event.total_registrations}</div>
                            <div class="stat-label">Total Registrations</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${UI.formatPercentage(event.capacity_percentage)}</div>
                            <div class="stat-label">Capacity</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${event.paid_registrations}</div>
                            <div class="stat-label">Paid</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${event.pending_payments}</div>
                            <div class="stat-label">Pending</div>
                        </div>
                    </div>

                    <div class="table-container mt-2">
                        <table>
                            <thead>
                                <tr>
                                    <th>Event Details</th>
                                    <th>Venue</th>
                                    <th>Ticket Breakdown</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Type:</strong> ${event.event_type}<br>
                                        <strong>Dates:</strong> ${UI.formatDate(event.start_date)} - ${UI.formatDate(event.end_date)}<br>
                                        <strong>Max Participants:</strong> ${event.max_participants}
                                    </td>
                                    <td>
                                        <strong>${event.venue_name}</strong><br>
                                        ${event.venue_address}<br>
                                        Capacity: ${event.venue_capacity}
                                    </td>
                                    <td>
                                        <span class="badge badge-success">Standard: ${event.standard_tickets}</span>
                                        <span class="badge badge-warning">VIP: ${event.vip_tickets}</span>
                                        <span class="badge badge-info">Student: ${event.student_tickets}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    ${event.registered_participants ? `
                        <div class="mt-2">
                            <h4>Registered Participants:</h4>
                            <p style="line-height: 1.8;">${event.registered_participants}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        `;

        container.innerHTML = html;
    }
};

// ============================================
// DATA MANAGEMENT MODULE
// ============================================

const DataModule = {
    /**
     * Import/regenerate data (MariaDB only)
     */
    async importData() {
        if (!confirm('This will delete all existing data and generate new random data. Continue?')) {
            return;
        }

        try {
            UI.showLoading();
            const result = await API.MariaDB.importData();
            UI.showAlert(`✓ ${result.message}`, 'success');

            // Reload current section data
            UI.loadSectionData(AppState.currentSection);
        } catch (error) {
            UI.showAlert(`✗ Data import failed: ${error.message}`, 'error');
        } finally {
            UI.hideLoading();
        }
    },

    /**
     * Migrate data from MariaDB to MongoDB
     */
    async migrateData() {
        if (!confirm('This will migrate all data from MariaDB to MongoDB. This may take a few moments. Continue?')) {
            return;
        }

        try {
            UI.showLoading();
            const result = await API.MongoDB.migrate();
            UI.showAlert(`✓ ${result.message}`, 'success');

            // Switch to MongoDB view
            UI.updateDBSelector('mongodb');

            // Reload current section data
            UI.loadSectionData(AppState.currentSection);
        } catch (error) {
            UI.showAlert(`✗ Migration failed: ${error.message}`, 'error');
        } finally {
            UI.hideLoading();
        }
    }
};

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute('href').substring(1);
            UI.navigateToSection(sectionId);
        });
    });

    // Database selector buttons
    document.querySelectorAll('.db-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const db = e.target.dataset.db;
            UI.updateDBSelector(db);
            UI.loadSectionData(AppState.currentSection);
        });
    });

    // Registration form
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            RegistrationModule.handleRegistration(e);
        });
    }

    // Analytics load button
    const loadAnalyticsBtn = document.getElementById('load-analytics');
    if (loadAnalyticsBtn) {
        loadAnalyticsBtn.addEventListener('click', () => {
            AnalyticsModule.loadReport();
        });
    }

    // Initialize with home section
    UI.navigateToSection('home');

    console.log('✓ Hackathon Management System initialized');
    console.log('Student 2: Baur, Lennard (12018378)');
});
