-- ============================================
-- Hackathon Management System - Table Creation
-- Group 5 - Student 2: Baur, Lennard (12018378)
-- Course: IMSE 2025W
-- ============================================
-- Based on updated ER diagram from MS2:
-- - Workshop is now the WEAK ENTITY (workshop_number is partial key)
-- - Registration is a relationship with attributes
-- - IS-A relationship: Person -> Participant/Judge (total, overlapping)
-- ============================================

-- Drop tables in correct order (referencing tables first)
DROP TABLE IF EXISTS Evaluates;
DROP TABLE IF EXISTS Creates;
DROP TABLE IF EXISTS Supports;
DROP TABLE IF EXISTS Registration;
DROP TABLE IF EXISTS Workshop;
DROP TABLE IF EXISTS Submission;
DROP TABLE IF EXISTS HackathonEvent;
DROP TABLE IF EXISTS Sponsor;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS Judge;
DROP TABLE IF EXISTS Participant;
DROP TABLE IF EXISTS Person;

-- ============================================
-- CORE ENTITIES
-- ============================================

-- Person: Superclass for IS-A relationship (total, overlapping)
CREATE TABLE Person (
    person_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    INDEX idx_email (email),
    INDEX idx_name (last_name, first_name)
) ENGINE=InnoDB;

-- Participant: Subclass of Person (IS-A relationship)
-- Includes unary (recursive) relationship via manager_id
CREATE TABLE Participant (
    person_id INT PRIMARY KEY,
    registration_date DATE NOT NULL,
    t_shirt_size VARCHAR(10),
    dietary_restrictions TEXT,
    manager_id INT,  -- Unary relationship: manages (1:N)
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES Participant(person_id) ON DELETE SET NULL,
    INDEX idx_manager (manager_id),
    INDEX idx_reg_date (registration_date)
) ENGINE=InnoDB;

-- Judge: Subclass of Person (IS-A relationship)
CREATE TABLE Judge (
    person_id INT PRIMARY KEY,
    expertise_area VARCHAR(100) NOT NULL,
    years_experience INT NOT NULL CHECK (years_experience >= 0),
    organization VARCHAR(200),
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE,
    INDEX idx_expertise (expertise_area)
) ENGINE=InnoDB;

-- Venue: Stores venue information
CREATE TABLE Venue (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(300) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    facilities TEXT,
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Sponsor: Stores sponsor information
CREATE TABLE Sponsor (
    sponsor_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    contribution_amount DECIMAL(10, 2) CHECK (contribution_amount >= 0),
    INDEX idx_company (company_name)
) ENGINE=InnoDB;

-- HackathonEvent: Main event entity
-- Hosts relationship: Venue (1) -> HackathonEvent (N) via venue_id
CREATE TABLE HackathonEvent (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    max_participants INT NOT NULL CHECK (max_participants > 0),
    venue_id INT NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id) ON DELETE RESTRICT,
    INDEX idx_event_type (event_type),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_venue (venue_id),
    CONSTRAINT chk_dates CHECK (end_date >= start_date)
) ENGINE=InnoDB;

-- ============================================
-- WEAK ENTITY (Updated for MS2)
-- ============================================

-- Workshop: WEAK ENTITY dependent on HackathonEvent
-- Composite key: (event_id, workshop_number)
-- workshop_number is the partial key
-- Organizes relationship: HackathonEvent (1) -> Workshop (N)
CREATE TABLE Workshop (
    event_id INT NOT NULL,
    workshop_number INT NOT NULL,  -- Partial key (unique within an event)
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INT NOT NULL CHECK (duration > 0),  -- Duration in minutes
    skill_level VARCHAR(50),
    max_attendees INT CHECK (max_attendees > 0),
    PRIMARY KEY (event_id, workshop_number),
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE,
    INDEX idx_skill_level (skill_level)
) ENGINE=InnoDB;

-- Submission: Stores hackathon project submissions
CREATE TABLE Submission (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    submission_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    technology_stack TEXT,
    repository_url VARCHAR(255),
    INDEX idx_submission_time (submission_time),
    INDEX idx_project_name (project_name)
) ENGINE=InnoDB;

-- ============================================
-- RELATIONSHIPS WITH ATTRIBUTES
-- ============================================

-- Registration: Relationship between Participant and HackathonEvent
-- This is a relationship with attributes, not a weak entity
-- Registers relationship: Participant (M) -> HackathonEvent (N)
CREATE TABLE Registration (
    person_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    registration_timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    ticket_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (person_id, event_id),
    FOREIGN KEY (person_id) REFERENCES Participant(person_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE,
    INDEX idx_reg_number (registration_number),
    INDEX idx_timestamp (registration_timestamp),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- Supports: Relationship between Sponsor and HackathonEvent (M:N)
CREATE TABLE Supports (
    sponsor_id INT NOT NULL,
    event_id INT NOT NULL,
    PRIMARY KEY (sponsor_id, event_id),
    FOREIGN KEY (sponsor_id) REFERENCES Sponsor(sponsor_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE,
    INDEX idx_event (event_id)
) ENGINE=InnoDB;

-- Creates: Relationship between Participant and Submission (M:N)
-- Allows team submissions where multiple participants create one submission
CREATE TABLE Creates (
    person_id INT NOT NULL,
    submission_id INT NOT NULL,
    PRIMARY KEY (person_id, submission_id),
    FOREIGN KEY (person_id) REFERENCES Participant(person_id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE,
    INDEX idx_submission (submission_id)
) ENGINE=InnoDB;

-- Evaluates: Relationship between Judge and Submission (M:N) with attributes
CREATE TABLE Evaluates (
    person_id INT NOT NULL,
    submission_id INT NOT NULL,
    score DECIMAL(5, 2) CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    evaluation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (person_id, submission_id),
    FOREIGN KEY (person_id) REFERENCES Judge(person_id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE,
    INDEX idx_score (score),
    INDEX idx_eval_date (evaluation_date)
) ENGINE=InnoDB;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify table structure
-- SHOW TABLES;
-- DESCRIBE Workshop;  -- Verify weak entity structure
-- DESCRIBE Registration;  -- Verify relationship with attributes
