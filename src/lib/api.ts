// API configuration
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

// In demo mode (Lovable preview), use mock data
const isDemoMode = !import.meta.env.PROD && typeof window !== 'undefined' && !window.location.hostname.includes('localhost:3000');

// Mock data for demo mode
import { mockParticipants, mockEvents, mockSubmissions, mockRegistrations, mockAnalyticsSubmissions, mockAnalyticsRegistrations } from './mockData';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (isDemoMode) {
    // Return mock data in demo mode
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    if (endpoint === '/participants') return mockParticipants as T;
    if (endpoint === '/events') return mockEvents as T;
    if (endpoint === '/submissions') return mockSubmissions as T;
    if (endpoint === '/registrations') return mockRegistrations as T;
    if (endpoint === '/analytics/submissions') return mockAnalyticsSubmissions as T;
    if (endpoint === '/analytics/registrations') return mockAnalyticsRegistrations as T;
    if (endpoint === '/health') return { status: 'demo', database: 'mock' } as T;
    
    throw new Error('Mock endpoint not found');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
}

// Types
export interface Person {
  person_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface Participant extends Person {
  tshirt_size: string;
  dietary_restrictions: string;
}

export interface HackathonEvent {
  event_id: number;
  name: string;
  start_date: string;
  end_date: string;
  venue_id: number;
  venue_name: string;
  venue_address: string;
  max_participants: number;
  registration_count: number;
}

export interface Submission {
  submission_id: number;
  event_id: number;
  event_name: string;
  project_name: string;
  description: string;
  tech_stack: string;
  repository_url: string;
  submission_type: 'Individual' | 'Team';
  submission_date: string;
  creators: string;
}

export interface Registration {
  registration_id: number;
  participant_id: number;
  event_id: number;
  event_name: string;
  first_name: string;
  last_name: string;
  email: string;
  registration_date: string;
  ticket_type: string;
  payment_status: string;
}

export interface SubmissionAnalytics {
  byParticipant: { person_id: number; participant_name: string; submission_count: number; tech_stacks: string }[];
  byEvent: { event_id: number; event_name: string; submission_count: number }[];
  byTechStack: { tech_stack: string; count: number }[];
  submissionTimeline: { month: string; count: number }[];
}

export interface RegistrationAnalytics {
  byEvent: { event_id: number; event_name: string; max_participants: number; registration_count: number; utilization_pct: number }[];
  byTicketType: { ticket_type: string; count: number }[];
  byPaymentStatus: { payment_status: string; count: number }[];
  registrationTimeline: { month: string; count: number }[];
}

// API Functions
export const api = {
  // Health check
  health: () => fetchAPI<{ status: string; database: string }>('/health'),
  
  // Data import
  importData: () => fetchAPI<{ success: boolean; message: string }>('/import-data', { method: 'POST' }),
  
  // Participants
  getParticipants: () => fetchAPI<Participant[]>('/participants'),
  
  // Events
  getEvents: () => fetchAPI<HackathonEvent[]>('/events'),
  getEvent: (id: number) => fetchAPI<HackathonEvent>(`/events/${id}`),
  
  // Submissions (Student 1)
  getSubmissions: () => fetchAPI<Submission[]>('/submissions'),
  createSubmission: (data: {
    event_id: number;
    project_name: string;
    description: string;
    tech_stack: string;
    repository_url: string;
    submission_type: string;
    participant_ids: number[];
  }) => fetchAPI<{ success: boolean; submission_id: number }>('/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Registrations (Student 2)
  getRegistrations: () => fetchAPI<Registration[]>('/registrations'),
  createRegistration: (data: {
    participant_id: number;
    event_id: number;
    ticket_type: string;
  }) => fetchAPI<{ success: boolean; registration_id: number }>('/registrations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Analytics
  getSubmissionAnalytics: () => fetchAPI<SubmissionAnalytics>('/analytics/submissions'),
  getRegistrationAnalytics: () => fetchAPI<RegistrationAnalytics>('/analytics/registrations'),
};
