import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { api, SubmissionAnalytics, RegistrationAnalytics } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Loader2, FileText, UserPlus } from 'lucide-react';

const COLORS = ['hsl(222.2, 47.4%, 11.2%)', 'hsl(215.4, 16.3%, 46.9%)', 'hsl(210, 40%, 96.1%)', 'hsl(0, 84.2%, 60.2%)', 'hsl(217.2, 32.6%, 17.5%)'];

export default function Analytics() {
  const [submissionAnalytics, setSubmissionAnalytics] = useState<SubmissionAnalytics | null>(null);
  const [registrationAnalytics, setRegistrationAnalytics] = useState<RegistrationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [subData, regData] = await Promise.all([
        api.getSubmissionAnalytics(),
        api.getRegistrationAnalytics(),
      ]);
      setSubmissionAnalytics(subData);
      setRegistrationAnalytics(regData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load analytics. Make sure the backend is running.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Submission and Registration analytics reports</p>
      </div>

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="submissions" className="gap-2">
            <FileText className="h-4 w-4" />
            Student 1: Submissions
          </TabsTrigger>
          <TabsTrigger value="registrations" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Student 2: Registrations
          </TabsTrigger>
        </TabsList>

        {/* Student 1: Submission Analytics */}
        <TabsContent value="submissions" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Submissions by Event */}
            <Card>
              <CardHeader>
                <CardTitle>Submissions by Event</CardTitle>
                <CardDescription>Number of project submissions per hackathon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={submissionAnalytics?.byEvent || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="event_name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="submission_count" fill="hsl(222.2, 47.4%, 11.2%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack Distribution</CardTitle>
                <CardDescription>Technologies used in submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={submissionAnalytics?.byTechStack?.slice(0, 5) || []}
                        dataKey="count"
                        nameKey="tech_stack"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {submissionAnalytics?.byTechStack?.slice(0, 5).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Submission Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Timeline</CardTitle>
                <CardDescription>Submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={submissionAnalytics?.submissionTimeline || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="hsl(222.2, 47.4%, 11.2%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Submissions by Participant */}
            <Card>
              <CardHeader>
                <CardTitle>Submissions by Participant</CardTitle>
                <CardDescription>Participant productivity analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md max-h-64 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Tech Stacks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissionAnalytics?.byParticipant?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        submissionAnalytics?.byParticipant?.map((p) => (
                          <TableRow key={p.person_id}>
                            <TableCell className="font-medium">{p.participant_name}</TableCell>
                            <TableCell>{p.submission_count}</TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-32 truncate">
                              {p.tech_stacks}
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
        </TabsContent>

        {/* Student 2: Registration Analytics */}
        <TabsContent value="registrations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Registrations by Event */}
            <Card>
              <CardHeader>
                <CardTitle>Registrations by Event</CardTitle>
                <CardDescription>Registration count and capacity utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationAnalytics?.byEvent || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="event_name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="registration_count" fill="hsl(222.2, 47.4%, 11.2%)" name="Registered" />
                      <Bar dataKey="max_participants" fill="hsl(210, 40%, 96.1%)" name="Capacity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Type Distribution</CardTitle>
                <CardDescription>Breakdown by ticket category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={registrationAnalytics?.byTicketType || []}
                        dataKey="count"
                        nameKey="ticket_type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {registrationAnalytics?.byTicketType?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Completed vs pending payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={registrationAnalytics?.byPaymentStatus || []}
                        dataKey="count"
                        nameKey="payment_status"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        label
                      >
                        {registrationAnalytics?.byPaymentStatus?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(142, 76%, 36%)' : 'hsl(38, 92%, 50%)'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Registration Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Timeline</CardTitle>
                <CardDescription>Registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationAnalytics?.registrationTimeline || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="hsl(222.2, 47.4%, 11.2%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capacity Utilization Table */}
          <Card>
            <CardHeader>
              <CardTitle>Event Capacity Utilization</CardTitle>
              <CardDescription>Detailed breakdown of event registrations vs capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Utilization %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationAnalytics?.byEvent?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrationAnalytics?.byEvent?.map((e) => (
                        <TableRow key={e.event_id}>
                          <TableCell className="font-medium">{e.event_name}</TableCell>
                          <TableCell>{e.registration_count}</TableCell>
                          <TableCell>{e.max_participants}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              e.utilization_pct > 80 ? 'text-red-600' : 
                              e.utilization_pct > 50 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {e.utilization_pct}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
