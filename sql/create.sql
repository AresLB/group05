-- Tech Conference & Hackathon Management System
-- Database Schema for MariaDB

CREATE DATABASE IF NOT EXISTS hackathon_db;
USE hackathon_db;

-- Person (base entity for ISA relationship)
CREATE TABLE Person (
    person_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20)
);

-- Participant (ISA: Person)
CREATE TABLE Participant (
    person_id INT PRIMARY KEY,
    tshirt_size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL'),
    dietary_restrictions VARCHAR(100),
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE
);

-- Judge (ISA: Person)
CREATE TABLE Judge (
    person_id INT PRIMARY KEY,
    expertise_area VARCHAR(100),
    years_experience INT,
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE
);

-- InnovationManager (Unary/Recursive relationship on Participant)
CREATE TABLE InnovationManager (
    manager_id INT,
    managed_id INT,
    PRIMARY KEY (manager_id, managed_id),
    FOREIGN KEY (manager_id) REFERENCES Participant(person_id) ON DELETE CASCADE,
    FOREIGN KEY (managed_id) REFERENCES Participant(person_id) ON DELETE CASCADE
);

-- Venue
CREATE TABLE Venue (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    capacity INT
);

-- Sponsor
CREATE TABLE Sponsor (
    sponsor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    tier ENUM('Bronze', 'Silver', 'Gold', 'Platinum'),
    contribution_amount DECIMAL(10, 2)
);

-- HackathonEvent
CREATE TABLE HackathonEvent (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue_id INT,
    max_participants INT,
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id) ON DELETE SET NULL
);

-- Workshop
CREATE TABLE Workshop (
    workshop_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    event_id INT NOT NULL,
    scheduled_time DATETIME,
    duration_minutes INT,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE
);

-- Supports (M:N between Sponsor and HackathonEvent)
CREATE TABLE Supports (
    sponsor_id INT,
    event_id INT,
    PRIMARY KEY (sponsor_id, event_id),
    FOREIGN KEY (sponsor_id) REFERENCES Sponsor(sponsor_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE
);

-- Registration
CREATE TABLE Registration (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    participant_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date DATE NOT NULL,
    ticket_type ENUM('General', 'VIP', 'Student') DEFAULT 'General',
    payment_status ENUM('Pending', 'Completed', 'Refunded') DEFAULT 'Pending',
    FOREIGN KEY (participant_id) REFERENCES Participant(person_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (participant_id, event_id)
);

-- Submission
CREATE TABLE Submission (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    project_name VARCHAR(100) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(200),
    repository_url VARCHAR(200),
    submission_type ENUM('Individual', 'Team') DEFAULT 'Individual',
    submission_date DATE,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE
);

-- Creates (M:N between Participant and Submission)
CREATE TABLE Creates (
    participant_id INT,
    submission_id INT,
    PRIMARY KEY (participant_id, submission_id),
    FOREIGN KEY (participant_id) REFERENCES Participant(person_id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE
);

-- Evaluates (M:N between Judge and Submission with attributes)
CREATE TABLE Evaluates (
    judge_id INT,
    submission_id INT,
    score INT CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    PRIMARY KEY (judge_id, submission_id),
    FOREIGN KEY (judge_id) REFERENCES Judge(person_id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_registration_event ON Registration(event_id);
CREATE INDEX idx_registration_participant ON Registration(participant_id);
CREATE INDEX idx_submission_event ON Submission(event_id);
CREATE INDEX idx_workshop_event ON Workshop(event_id);
