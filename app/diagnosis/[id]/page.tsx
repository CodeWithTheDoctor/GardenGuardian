'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, AlertTriangle, ChevronRight, Check, 
  ShoppingCart, Download, Share2 
} from 'lucide-react';
import { TreatmentRecommendations } from '@/components/treatment-recommendations';
import { getDiagnosisById } from '@/lib/firebase-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { PlantDiagnosis } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DiagnosisPage() {
  const { id } = useParams<{ id: string }>();
  const [diagnosis, setDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        if (typeof id !== 'string') return;
        
        console.log('🔍 Fetching diagnosis for ID:', id);
        // In a real app, this would fetch from Firebase
        const diagnosisData = await getDiagnosisById(id);
        console.log('🔍 Diagnosis data received:', diagnosisData);
        setDiagnosis(diagnosisData);
        setLoading(false);
      } catch (err) {
        console.error('🚨 Error fetching diagnosis:', err);
        setError('Failed to load diagnosis. Please try again.');
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDiagnosis();
    }
  }, [id]);
  
  if (loading) {
    return <DiagnosisPageSkeleton />;
  }
  
  if (error || !diagnosis) {
    return (
      <div className="min-h-screen bg-garden-cream px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <AlertTriangle className="h-16 w-16 text-garden-alert mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-garden-dark mb-4">
            Diagnosis Not Found
          </h1>
          <p className="text-garden-medium mb-8">
            {error || "We couldn't find the diagnosis you're looking for."}
          </p>
          <Button asChild className="bg-garden-dark hover:bg-garden-medium text-white">
            <Link href="/diagnose">
              Try Another Diagnosis
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const { disease, confidence, severity, description } = diagnosis.diagnosis;
  
  // Convert confidence to progress value
  const confidenceValue = Math.round(confidence);
  
  // Determine severity color
  const severityColor = 
    severity === 'severe' ? 'text-garden-alert' :
    severity === 'moderate' ? 'text-yellow-600' : 
    'text-garden-light';

  return (
    <div className="min-h-screen bg-garden-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="text-garden-medium hover:text-garden-dark flex items-center"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Prototype Results</AlertTitle>
          <AlertDescription className="text-blue-700">
            This diagnosis is generated from demonstration data. Production version will use real AI analysis.
          </AlertDescription>
        </Alert>
        
        {/* Diagnosis Result Card */}
        <Card className="mb-8 border-garden-light/30 overflow-hidden">
          <CardHeader className="bg-garden-dark text-white">
            <CardTitle className="text-2xl">Diagnosis Results</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Plant Image */}
              <div className="md:w-1/2">
                <div className="aspect-video bg-black/5 rounded-lg overflow-hidden">
                  {diagnosis.imageUrl ? (
                    <img 
                      src={diagnosis.imageUrl}
                      alt={`Plant with ${disease}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-garden-medium">
                      No image available
                    </div>
                  )}
                </div>
              </div>
              
              {/* Diagnosis Details */}
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-garden-dark mb-2">
                  {disease}
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className={`${severityColor} border-current`}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </Badge>
                  
                  <Badge variant="outline" className="border-garden-medium text-garden-medium">
                    <Leaf className="h-3 w-3 mr-1" />
                    Plant Disease
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-garden-medium">AI Confidence</span>
                    <span className="text-sm font-medium">{confidenceValue}%</span>
                  </div>
                  <Progress
                    value={confidenceValue}
                    className="h-2 bg-garden-cream"
                    indicatorClassName={
                      confidenceValue > 80 ? "bg-garden-light" :
                      confidenceValue > 60 ? "bg-yellow-500" :
                      "bg-garden-alert"
                    }
                  />
                </div>
                
                <p className="text-garden-medium mb-4">
                  {description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="border-garden-light text-garden-dark gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="border-garden-light text-garden-dark gap-1">
                    <Download className="h-4 w-4" />
                    Save Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Recommendations */}
        {diagnosis.treatments && diagnosis.treatments.length > 0 && (
          <TreatmentRecommendations 
            treatments={diagnosis.treatments}
            userPreferences={{
              organicOnly: false,
              budgetLimit: 100
            }}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="bg-garden-dark hover:bg-garden-medium text-white flex-1">
            <Link href="/diagnose">
              Diagnose Another Plant
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="border-garden-medium text-garden-dark flex-1"
            onClick={() => {
              // In a real app, this would mark the plant as treated
              console.log('Mark as treated');
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark as Treated
          </Button>
        </div>
      </div>
    </div>
  );
}

function DiagnosisPageSkeleton() {
  return (
    <div className="min-h-screen bg-garden-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-6 w-32" />
        </div>
        
        <Card className="mb-8 border-garden-light/30 overflow-hidden">
          <CardHeader className="bg-garden-dark text-white">
            <CardTitle className="text-2xl">Diagnosis Results</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/2">
                <Skeleton className="aspect-video w-full rounded-lg" />
              </div>
              
              <div className="md:w-1/2">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
                
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-2 w-full mb-4" />
                
                <Skeleton className="h-20 w-full mb-4" />
                
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4 mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}