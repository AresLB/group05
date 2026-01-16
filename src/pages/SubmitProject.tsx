import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { api, Participant, HackathonEvent, Submission } from '@/lib/api';
import { Loader2, Send, FileText } from 'lucide-react';

export default function SubmitProject() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [submissionType, setSubmissionType] = useState<string>('Individual');
  const [teamMembers, setTeamMembers] = useState<number[]>([]);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [participantsData, eventsData, submissionsData] = await Promise.all([
        api.getParticipants(),
        api.getEvents(),
        api.getSubmissions(),
      ]);
      setParticipants(participantsData);
      setEvents(eventsData);
      setSubmissions(submissionsData);
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

  const handleTeamMemberToggle = (participantId: number) => {
    setTeamMembers(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant || !selectedEvent || !projectName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const participantIds = submissionType === 'Team'
      ? [parseInt(selectedParticipant), ...teamMembers]
      : [parseInt(selectedParticipant)];

    setSubmitting(true);
    try {
      await api.createSubmission({
        event_id: parseInt(selectedEvent),
        project_name: projectName,
        description,
        tech_stack: techStack,
        repository_url: repositoryUrl,
        submission_type: submissionType,
        participant_ids: participantIds,
      });

      toast({
        title: 'Project Submitted!',
        description: `"${projectName}" has been submitted successfully.`,
      });

      // Reset form and reload data
      setProjectName('');
      setDescription('');
      setTechStack('');
      setRepositoryUrl('');
      setTeamMembers([]);
      loadData();
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit project',
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Submit Hackathon Project</h1>
        <p className="text-muted-foreground">Student 1 Use Case: Submit individual or team projects</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              New Submission
            </CardTitle>
            <CardDescription>
              Fill in the project details to submit your hackathon project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Active User Selection */}
              <div className="space-y-2">
                <Label htmlFor="participant">Active Participant *</Label>
                <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((p) => (
                      <SelectItem key={p.person_id} value={p.person_id.toString()}>
                        {p.first_name} {p.last_name} ({p.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Selection */}
              <div className="space-y-2">
                <Label htmlFor="event">Hackathon Event *</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((e) => (
                      <SelectItem key={e.event_id} value={e.event_id.toString()}>
                        {e.name} ({e.start_date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submission Type */}
              <div className="space-y-2">
                <Label>Submission Type *</Label>
                <Select value={submissionType} onValueChange={setSubmissionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Members (if Team) */}
              {submissionType === 'Team' && (
                <div className="space-y-2">
                  <Label>Team Members</Label>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                    {participants
                      .filter(p => p.person_id.toString() !== selectedParticipant)
                      .map((p) => (
                        <div key={p.person_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`member-${p.person_id}`}
                            checked={teamMembers.includes(p.person_id)}
                            onCheckedChange={() => handleTeamMemberToggle(p.person_id)}
                          />
                          <label htmlFor={`member-${p.person_id}`} className="text-sm">
                            {p.first_name} {p.last_name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., SmartAssist AI"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your project..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input
                  id="techStack"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repositoryUrl">Repository URL</Label>
                <Input
                  id="repositoryUrl"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Project
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              Projects submitted to hackathon events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Creators</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No submissions yet. Import data or submit a project.
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.slice(0, 10).map((s) => (
                      <TableRow key={s.submission_id}>
                        <TableCell className="font-medium">{s.project_name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.event_name}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded ${
                            s.submission_type === 'Team' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {s.submission_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{s.creators}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
