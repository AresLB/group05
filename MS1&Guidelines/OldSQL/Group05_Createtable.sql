DROP TABLE IF EXISTS Evaluates;
DROP TABLE IF EXISTS Creates;
DROP TABLE IF EXISTS Supports;
DROP TABLE IF EXISTS Registration;
DROP TABLE IF EXISTS Submission;
DROP TABLE IF EXISTS Workshop;
DROP TABLE IF EXISTS HackathonEvent;
DROP TABLE IF EXISTS Sponsor;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS Judge;
DROP TABLE IF EXISTS Participant;
DROP TABLE IF EXISTS Person;

CREATE TABLE Person (
    person_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20)
);

CREATE TABLE Participant (
    person_id INT PRIMARY KEY,
    registration_date DATE NOT NULL,
    t_shirt_size VARCHAR(10),
    dietary_restrictions TEXT,
    manager_id INT,
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES Participant(person_id) ON DELETE SET NULL
);


CREATE TABLE Judge (
    person_id INT PRIMARY KEY,
    expertise_area VARCHAR(100) NOT NULL,
    years_experience INT NOT NULL,
    organization VARCHAR(200),
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE
);


CREATE TABLE Venue (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(300) NOT NULL,
    capacity INT NOT NULL,
    facilities TEXT
);

CREATE TABLE HackathonEvent (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    max_participants INT NOT NULL,
    venue_id INT NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id) ON DELETE RESTRICT
);



CREATE TABLE Workshop (
    workshop_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    skill_level VARCHAR(50),
    max_attendees INT,
    event_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE
);

CREATE TABLE Sponsor (
    sponsor_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    contribution_amount DECIMAL(10, 2)
);

CREATE TABLE Submission (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    submission_time DATETIME NOT NULL,
    technology_stack TEXT,
    repository_url VARCHAR(255)
);

CREATE TABLE Registration (
    person_id INT,
    event_id INT,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    registration_timestamp DATETIME NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    ticket_type VARCHAR(50),
    PRIMARY KEY (person_id, event_id),
    FOREIGN KEY (person_id) REFERENCES Participant(person_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE
);

CREATE TABLE Supports (
    sponsor_id INT,
    event_id INT,
    PRIMARY KEY (sponsor_id, event_id),
    FOREIGN KEY (sponsor_id) REFERENCES Sponsor(sponsor_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES HackathonEvent(event_id) ON DELETE CASCADE
);

CREATE TABLE Creates (
    person_id INT,
    submission_id INT,
    PRIMARY KEY (person_id, submission_id),
    FOREIGN KEY (person_id) REFERENCES Participant(person_id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE
);

CREATE TABLE Evaluates (
    person_id INT,
    submission_id INT,
    score DECIMAL(5, 2),
    feedback TEXT,
    PRIMARY KEY (person_id, submission_id),
    FOREIGN KEY (person_id) REFERENCES Judge(person_id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE
);