// Mock data for demo mode (when running in Lovable preview)

export const mockParticipants = [
  { person_id: 1, first_name: 'Emma', last_name: 'Smith', email: 'emma.smith@email.com', phone: '+1234567890', tshirt_size: 'M', dietary_restrictions: 'None' },
  { person_id: 2, first_name: 'Liam', last_name: 'Johnson', email: 'liam.johnson@email.com', phone: '+1234567891', tshirt_size: 'L', dietary_restrictions: 'Vegetarian' },
  { person_id: 3, first_name: 'Olivia', last_name: 'Williams', email: 'olivia.williams@email.com', phone: '+1234567892', tshirt_size: 'S', dietary_restrictions: 'None' },
  { person_id: 4, first_name: 'Noah', last_name: 'Brown', email: 'noah.brown@email.com', phone: '+1234567893', tshirt_size: 'XL', dietary_restrictions: 'Gluten-Free' },
  { person_id: 5, first_name: 'Ava', last_name: 'Jones', email: 'ava.jones@email.com', phone: '+1234567894', tshirt_size: 'M', dietary_restrictions: 'Vegan' },
  { person_id: 6, first_name: 'Ethan', last_name: 'Garcia', email: 'ethan.garcia@email.com', phone: '+1234567895', tshirt_size: 'L', dietary_restrictions: 'None' },
  { person_id: 7, first_name: 'Sophia', last_name: 'Miller', email: 'sophia.miller@email.com', phone: '+1234567896', tshirt_size: 'S', dietary_restrictions: 'Halal' },
  { person_id: 8, first_name: 'Mason', last_name: 'Davis', email: 'mason.davis@email.com', phone: '+1234567897', tshirt_size: 'M', dietary_restrictions: 'None' },
];

export const mockEvents = [
  { event_id: 1, name: 'AI Innovation Hackathon 2025', start_date: '2025-03-15', end_date: '2025-03-17', venue_id: 1, venue_name: 'Tech Innovation Center', venue_address: '123 Silicon Valley Blvd', max_participants: 200, registration_count: 45 },
  { event_id: 2, name: 'Web3 Dev Challenge', start_date: '2025-04-01', end_date: '2025-04-03', venue_id: 2, venue_name: 'University Conference Hall', venue_address: '456 Academic Ave', max_participants: 150, registration_count: 32 },
  { event_id: 3, name: 'Green Tech Hackathon', start_date: '2025-05-10', end_date: '2025-05-12', venue_id: 3, venue_name: 'Downtown Convention Center', venue_address: '789 Main St', max_participants: 300, registration_count: 78 },
  { event_id: 4, name: 'Mobile App Sprint', start_date: '2025-06-20', end_date: '2025-06-22', venue_id: 4, venue_name: 'Startup Hub', venue_address: '321 Entrepreneur Way', max_participants: 100, registration_count: 25 },
  { event_id: 5, name: 'Cloud Computing Challenge', start_date: '2025-07-05', end_date: '2025-07-07', venue_id: 5, venue_name: 'Digital Campus', venue_address: '654 Future Dr', max_participants: 250, registration_count: 56 },
];

export const mockSubmissions = [
  { submission_id: 1, event_id: 1, event_name: 'AI Innovation Hackathon 2025', project_name: 'SmartAssist AI', description: 'An AI-powered assistant for healthcare', tech_stack: 'React, Node.js, TensorFlow', repository_url: 'https://github.com/team1/smartassist', submission_type: 'Team', submission_date: '2025-03-17', creators: 'Emma Smith, Liam Johnson' },
  { submission_id: 2, event_id: 1, event_name: 'AI Innovation Hackathon 2025', project_name: 'DataViz Pro', description: 'Advanced data visualization platform', tech_stack: 'Python, D3.js, Flask', repository_url: 'https://github.com/team2/dataviz', submission_type: 'Team', submission_date: '2025-03-17', creators: 'Olivia Williams, Noah Brown' },
  { submission_id: 3, event_id: 2, event_name: 'Web3 Dev Challenge', project_name: 'CryptoWallet', description: 'Secure decentralized wallet', tech_stack: 'Solidity, Web3.js, React', repository_url: 'https://github.com/team3/cryptowallet', submission_type: 'Individual', submission_date: '2025-04-03', creators: 'Ava Jones' },
  { submission_id: 4, event_id: 3, event_name: 'Green Tech Hackathon', project_name: 'EcoTracker', description: 'Carbon footprint monitoring app', tech_stack: 'React Native, Firebase', repository_url: 'https://github.com/team4/ecotracker', submission_type: 'Team', submission_date: '2025-05-12', creators: 'Ethan Garcia, Sophia Miller, Mason Davis' },
];

export const mockRegistrations = [
  { registration_id: 1, participant_id: 1, event_id: 1, event_name: 'AI Innovation Hackathon 2025', first_name: 'Emma', last_name: 'Smith', email: 'emma.smith@email.com', registration_date: '2025-02-15', ticket_type: 'VIP', payment_status: 'Completed' },
  { registration_id: 2, participant_id: 2, event_id: 1, event_name: 'AI Innovation Hackathon 2025', first_name: 'Liam', last_name: 'Johnson', email: 'liam.johnson@email.com', registration_date: '2025-02-16', ticket_type: 'General', payment_status: 'Completed' },
  { registration_id: 3, participant_id: 3, event_id: 1, event_name: 'AI Innovation Hackathon 2025', first_name: 'Olivia', last_name: 'Williams', email: 'olivia.williams@email.com', registration_date: '2025-02-17', ticket_type: 'Student', payment_status: 'Pending' },
  { registration_id: 4, participant_id: 4, event_id: 2, event_name: 'Web3 Dev Challenge', first_name: 'Noah', last_name: 'Brown', email: 'noah.brown@email.com', registration_date: '2025-03-01', ticket_type: 'General', payment_status: 'Completed' },
  { registration_id: 5, participant_id: 5, event_id: 2, event_name: 'Web3 Dev Challenge', first_name: 'Ava', last_name: 'Jones', email: 'ava.jones@email.com', registration_date: '2025-03-02', ticket_type: 'VIP', payment_status: 'Completed' },
  { registration_id: 6, participant_id: 6, event_id: 3, event_name: 'Green Tech Hackathon', first_name: 'Ethan', last_name: 'Garcia', email: 'ethan.garcia@email.com', registration_date: '2025-04-15', ticket_type: 'Student', payment_status: 'Completed' },
];

export const mockAnalyticsSubmissions = {
  byParticipant: [
    { person_id: 1, participant_name: 'Emma Smith', submission_count: 2, tech_stacks: 'React, Node.js, TensorFlow' },
    { person_id: 2, participant_name: 'Liam Johnson', submission_count: 2, tech_stacks: 'React, Node.js, TensorFlow' },
    { person_id: 3, participant_name: 'Olivia Williams', submission_count: 1, tech_stacks: 'Python, D3.js, Flask' },
    { person_id: 4, participant_name: 'Noah Brown', submission_count: 1, tech_stacks: 'Python, D3.js, Flask' },
    { person_id: 5, participant_name: 'Ava Jones', submission_count: 1, tech_stacks: 'Solidity, Web3.js, React' },
    { person_id: 6, participant_name: 'Ethan Garcia', submission_count: 1, tech_stacks: 'React Native, Firebase' },
  ],
  byEvent: [
    { event_id: 1, event_name: 'AI Innovation Hackathon 2025', submission_count: 8 },
    { event_id: 2, event_name: 'Web3 Dev Challenge', submission_count: 5 },
    { event_id: 3, event_name: 'Green Tech Hackathon', submission_count: 7 },
    { event_id: 4, event_name: 'Mobile App Sprint', submission_count: 3 },
    { event_id: 5, event_name: 'Cloud Computing Challenge', submission_count: 4 },
  ],
  byTechStack: [
    { tech_stack: 'React, Node.js, MongoDB', count: 6 },
    { tech_stack: 'Python, TensorFlow, Flask', count: 5 },
    { tech_stack: 'Solidity, Web3.js, React', count: 4 },
    { tech_stack: 'React Native, Firebase', count: 3 },
    { tech_stack: 'Vue.js, Django, PostgreSQL', count: 2 },
  ],
  submissionTimeline: [
    { month: '2025-03', count: 8 },
    { month: '2025-04', count: 5 },
    { month: '2025-05', count: 7 },
    { month: '2025-06', count: 4 },
    { month: '2025-07', count: 3 },
  ],
};

export const mockAnalyticsRegistrations = {
  byEvent: [
    { event_id: 1, event_name: 'AI Innovation Hackathon 2025', max_participants: 200, registration_count: 45, utilization_pct: 22.5 },
    { event_id: 2, event_name: 'Web3 Dev Challenge', max_participants: 150, registration_count: 32, utilization_pct: 21.3 },
    { event_id: 3, event_name: 'Green Tech Hackathon', max_participants: 300, registration_count: 78, utilization_pct: 26.0 },
    { event_id: 4, event_name: 'Mobile App Sprint', max_participants: 100, registration_count: 25, utilization_pct: 25.0 },
    { event_id: 5, event_name: 'Cloud Computing Challenge', max_participants: 250, registration_count: 56, utilization_pct: 22.4 },
  ],
  byTicketType: [
    { ticket_type: 'General', count: 95 },
    { ticket_type: 'Student', count: 80 },
    { ticket_type: 'VIP', count: 61 },
  ],
  byPaymentStatus: [
    { payment_status: 'Completed', count: 180 },
    { payment_status: 'Pending', count: 56 },
  ],
  registrationTimeline: [
    { month: '2025-02', count: 45 },
    { month: '2025-03', count: 32 },
    { month: '2025-04', count: 28 },
    { month: '2025-05', count: 56 },
    { month: '2025-06', count: 35 },
    { month: '2025-07', count: 40 },
  ],
};
