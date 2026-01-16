import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { api, Participant, HackathonEvent, Registration } from '@/lib/api';
import { Loader2, UserPlus, Calendar, MapPin, Users } from 'lucide-react';

export default function RegisterEvent() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [ticketType, setTicketType] = useState<string>('General');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [participantsData, eventsData, registrationsData] = await Promise.all([
        api.getParticipants(),
        api.getEvents(),
        api.getRegistrations(),
      ]);
      setParticipants(participantsData);
      setEvents(eventsData);
      setRegistrations(registrationsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data. Make sure the backend is running.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant || !selectedEvent) {
      toast({
        title: 'Validation Error',
        description: 'Please select a participant and event.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.createRegistration({
        participant_id: parseInt(selectedParticipant),
        event_id: parseInt(selectedEvent),
        ticket_type: ticketType,
      });

      toast({
        title: 'Registration Successful!',
        description: 'Participant has been registered for the event.',
      });

      // Reset and reload
      setSelectedParticipant('');
      setSelectedEvent('');
      setTicketType('General');
      loadData();
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Failed to register',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedEventData = events.find(e => e.event_id.toString() === selectedEvent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Event Registration</h1>
        <p className="text-muted-foreground">Student 2 Use Case: Register participants for hackathon events</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              New Registration
            </CardTitle>
            <CardDescription>
              Register a participant for a hackathon event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="participant">Participant *</Label>
                <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((p) => (
                      <SelectItem key={p.person_id} value={p.person_id.toString()}>
                        {p.first_name} {p.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Hackathon Event *</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((e) => (
                      <SelectItem key={e.event_id} value={e.event_id.toString()}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Details Preview */}
              {selectedEventData && (
                <div className="p-3 bg-muted rounded-md space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {selectedEventData.start_date} to {selectedEventData.end_date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedEventData.venue_name}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {selectedEventData.registration_count} / {selectedEventData.max_participants} registered
                  </div>
                  <Progress 
                    value={(selectedEventData.registration_count / selectedEventData.max_participants) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ticketType">Ticket Type *</Label>
                <Select value={ticketType} onValueChange={setTicketType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Register
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Events</CardTitle>
            <CardDescription>
              Hackathon events with capacity information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => {
                const utilizationPct = (event.registration_count / event.max_participants) * 100;
                return (
                  <div key={event.event_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.venue_name}</p>
                      </div>
                      <Badge variant={utilizationPct > 80 ? 'destructive' : 'secondary'}>
                        {event.registration_count}/{event.max_participants}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.start_date}
                      </span>
                    </div>
                    <Progress value={utilizationPct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>
            Participant registrations for hackathon events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No registrations yet. Import data or register a participant.
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.slice(0, 10).map((r) => (
                    <TableRow key={r.registration_id}>
                      <TableCell className="font-medium">
                        {r.first_name} {r.last_name}
                      </TableCell>
                      <TableCell>{r.event_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.ticket_type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.registration_date}</TableCell>
                      <TableCell>
                        <Badge variant={r.payment_status === 'Completed' ? 'default' : 'secondary'}>
                          {r.payment_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
