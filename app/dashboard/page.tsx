'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Leaf, AlertCircle, Calendar, PlusCircle, Filter, SortDesc,
  CloudRain, Bug, Thermometer, AlertTriangle
} from 'lucide-react';
import { getUserDiagnoses, getWeatherAlerts, getDashboardAnalytics } from '@/lib/firebase-utils';
import { PlantDiagnosis } from '@/lib/types';

export default function DashboardPage() {
  const [diagnoses, setDiagnoses] = useState<PlantDiagnosis[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load real data from Firebase or fallback storage
        const [diagnosesData, alertsData, analyticsData] = await Promise.all([
          getUserDiagnoses(),
          getWeatherAlerts('4000'), // Brisbane postcode as example
          getDashboardAnalytics()
        ]);
        
        setDiagnoses(diagnosesData);
        setWeatherAlerts(alertsData);
        setAnalytics(analyticsData);
        setLoading(false);
        
        console.log('✅ Dashboard data loaded:', {
          diagnoses: diagnosesData.length,
          alerts: alertsData.length,
          analytics: analyticsData
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load your plant diagnoses. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // In a real app, we'd filter these based on the selected tab
  const recentDiagnoses = diagnoses;
  const criticalDiagnoses = diagnoses.filter(d => d.diagnosis.severity === 'severe');
  const treatedDiagnoses = diagnoses.filter(d => d.treated);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-garden-cream px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-garden-alert mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-garden-dark mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-garden-medium mb-8">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-garden-dark hover:bg-garden-medium text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-garden-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-garden-dark">
              Garden Health Dashboard
            </h1>
            <p className="text-garden-medium">
              Track, monitor, and manage all your plant health issues
            </p>
          </div>
          
          <Button asChild className="bg-garden-dark hover:bg-garden-medium text-white">
            <Link href="/diagnose">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Diagnosis
            </Link>
          </Button>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-garden-dark mb-4 flex items-center">
              <CloudRain className="h-5 w-5 mr-2" />
              Local Garden Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherAlerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.severity === 'severe' ? 'border-l-garden-alert bg-red-50' :
                  alert.severity === 'moderate' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-garden-dark">{alert.title}</AlertTitle>
                  <AlertDescription className="text-garden-medium">
                    {alert.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {diagnoses.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList className="bg-white border border-garden-light/30">
                <TabsTrigger value="all">All Plants</TabsTrigger>
                <TabsTrigger value="critical">
                  Critical
                  {criticalDiagnoses.length > 0 && (
                    <Badge className="ml-1 bg-garden-alert text-white">{criticalDiagnoses.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="treated">Treated</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-garden-light/30">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="border-garden-light/30">
                  <SortDesc className="h-4 w-4 mr-1" />
                  Sort
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderDiagnosesGrid(recentDiagnoses)}
              </div>
            </TabsContent>
            
            <TabsContent value="critical" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {criticalDiagnoses.length > 0 ? 
                  renderDiagnosesGrid(criticalDiagnoses) : 
                  <EmptyState message="No critical plant issues found" icon={<Leaf className="h-10 w-10 text-garden-light" />} />
                }
              </div>
            </TabsContent>
            
            <TabsContent value="treated" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {treatedDiagnoses.length > 0 ? 
                  renderDiagnosesGrid(treatedDiagnoses) : 
                  <EmptyState message="No treated plants yet" icon={<Leaf className="h-10 w-10 text-garden-light" />} />
                }
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="border-garden-light/30 text-center p-12">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-garden-light/20 rounded-full flex items-center justify-center mb-6">
                <Leaf className="h-10 w-10 text-garden-medium" />
              </div>
              <h2 className="text-2xl font-bold text-garden-dark mb-3">
                No Plant Diagnoses Yet
              </h2>
              <p className="text-garden-medium mb-8">
                Start by diagnosing your first plant. It only takes a minute to identify issues and get treatment recommendations.
              </p>
              <Button asChild className="bg-garden-dark hover:bg-garden-medium text-white">
                <Link href="/diagnose">
                  Diagnose Your First Plant
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function renderDiagnosesGrid(diagnoses: PlantDiagnosis[]) {
  return diagnoses.map((plant) => (
    <Link 
      key={plant.id} 
      href={`/diagnosis/${plant.id}`}
      className="block"
    >
      <Card className="h-full border-garden-light/30 hover:shadow-md transition-shadow overflow-hidden">
        <div className="aspect-video w-full bg-black/5 relative">
          {plant.imageUrl ? (
            <img 
              src={plant.imageUrl} 
              alt={plant.diagnosis.disease}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-garden-medium">
              No image
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge className={
              plant.diagnosis.severity === 'severe' ? 'bg-garden-alert text-white' :
              plant.diagnosis.severity === 'moderate' ? 'bg-yellow-500 text-white' :
              'bg-garden-light text-garden-dark'
            }>
              {plant.diagnosis.severity}
            </Badge>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <h3 className="font-semibold text-garden-dark mb-1 line-clamp-2">
            {plant.diagnosis.disease}
          </h3>
          
          <div className="flex items-center text-garden-medium text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(plant.createdAt).toLocaleDateString()}
          </div>
          
          <div className="mt-2">
            <Badge variant="outline" className={
              plant.treated ? 'border-garden-light text-garden-light' : 'border-garden-alert text-garden-alert'
            }>
              {plant.treated ? 'Treated' : 'Needs Treatment'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  ));
}

function EmptyState({ message, icon }: { message: string, icon: React.ReactNode }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-garden-light/20 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-garden-medium">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-garden-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border-garden-light/30 overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="pt-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}