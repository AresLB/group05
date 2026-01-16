import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Database, Upload, FileText, UserPlus, BarChart3, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const { toast } = useToast();

  const handleImportData = async () => {
    setImporting(true);
    try {
      await api.importData();
      setImported(true);
      toast({
        title: 'Data Imported Successfully',
        description: 'Database has been populated with 20-50 randomized records.',
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import data',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const features = [
    {
      title: 'Submit Hackathon Project',
      description: 'Student 1 Use Case: Submit individual or team projects for hackathon events.',
      icon: FileText,
      path: '/submit-project',
      color: 'text-blue-600',
    },
    {
      title: 'Event Registration',
      description: 'Student 2 Use Case: Register participants for hackathon events with ticket selection.',
      icon: UserPlus,
      path: '/register-event',
      color: 'text-green-600',
    },
    {
      title: 'Analytics Dashboard',
      description: 'View submission and registration analytics with charts and reports.',
      icon: BarChart3,
      path: '/analytics',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Tech Conference & Hackathon Management System
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          VU Information Management & Systems Engineering - Milestone 2 Implementation.
          A minimal RDBMS-based system with MariaDB backend.
        </p>
      </div>

      {/* Data Import Card */}
      <Card className="border-2 border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Import randomized demo data (20-50 records) to populate the database.
            This will clear existing data and create new records across all tables.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            size="lg"
            onClick={handleImportData}
            disabled={importing}
            className="gap-2"
          >
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : imported ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Data Imported
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import Demo Data
              </>
            )}
          </Button>
          {imported && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Database populated successfully!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.path} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2`}>
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.path}>
                  <Button variant="outline" className="w-full">
                    Open →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Database Entities</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Person, Participant, Judge (ISA relationship)</li>
                <li>• InnovationManager (recursive/unary)</li>
                <li>• Venue, HackathonEvent, Workshop</li>
                <li>• Sponsor, Submission, Registration</li>
                <li>• Creates, Supports, Evaluates (M:N bridges)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Technology Stack</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Frontend: React + TypeScript + Tailwind</li>
                <li>• Backend: Node.js + Express (raw SQL)</li>
                <li>• Database: MariaDB</li>
                <li>• Infrastructure: Docker Compose</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
