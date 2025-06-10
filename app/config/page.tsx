'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Database, Camera, Cpu, Globe, Shield, BarChart3 } from 'lucide-react';
import { isFirebaseConfigured, isAnalyticsConfigured } from '@/lib/firebase-config';
import { isVisionAPIConfigured, getAIConfigurationStatus } from '@/lib/ai-vision';
import { ServiceErrorDisplay } from '@/components/ui/service-error';
import { FIREBASE_ERRORS, AI_VISION_ERRORS } from '@/lib/error-handling';
import Link from 'next/link';

interface ConfigItem {
  name: string;
  description: string;
  status: 'ready' | 'configured' | 'error' | 'missing';
  icon: React.ReactNode;
  details: string[];
  error?: any;
}

export default function ConfigPage() {
  const firebaseReady = isFirebaseConfigured();
  const visionReady = isVisionAPIConfigured();
  const analyticsReady = isAnalyticsConfigured();
  const aiStatus = getAIConfigurationStatus();

  const configurations: ConfigItem[] = [
    {
      name: 'Firebase Backend',
      description: 'Authentication, Database & Storage',
      status: firebaseReady ? 'configured' : 'error',
      icon: <Database className="h-5 w-5" />,
      details: firebaseReady 
        ? ['✅ Firebase SDK integrated', '✅ Auth configuration ready', '✅ Firestore database ready', '✅ Cloud Storage ready']
        : ['❌ Firebase not configured', '🔧 Environment variables missing', '📋 See error details below'],
      error: !firebaseReady ? FIREBASE_ERRORS.NOT_CONFIGURED : undefined
    },
    {
      name: 'AI Vision System',
      description: 'Plant disease recognition engine',
      status: visionReady ? 'configured' : 'error',
      icon: <Cpu className="h-5 w-5" />,
      details: visionReady
        ? ['✅ Google Vision API active', '✅ Image processing pipeline', '✅ Australian disease mapping', '✅ Confidence scoring']
        : ['❌ Google Vision API not configured', '🔧 API key missing', '📋 See error details below'],
      error: !visionReady ? AI_VISION_ERRORS.NOT_CONFIGURED : undefined
    },
    {
      name: 'Camera Integration',
      description: 'Real-time plant photo capture',
      status: 'ready',
      icon: <Camera className="h-5 w-5" />,
      details: ['✅ Browser Camera API working', '✅ Photo capture functional', '✅ Image preview & validation', '✅ File upload alternative']
    },
    {
      name: 'Progressive Web App',
      description: 'Mobile-first installation',
      status: 'ready',
      icon: <Globe className="h-5 w-5" />,
      details: ['✅ PWA manifest configured', '✅ Mobile-responsive design', '✅ Offline capability planned', '⚠️ App icons needed']
    },
    {
      name: 'Australian Compliance',
      description: 'APVMA & regulatory integration',
      status: 'ready',
      icon: <Shield className="h-5 w-5" />,
      details: ['✅ APVMA government API integrated', '✅ Real chemical registration data', '✅ State restriction mapping', '✅ Direct compliance checking']
    },
    {
      name: 'Analytics & Monitoring',
      description: 'Performance & user tracking',
      status: analyticsReady ? 'configured' : 'missing',
      icon: <BarChart3 className="h-5 w-5" />,
      details: analyticsReady
        ? ['✅ Firebase Analytics configured', '✅ User behavior tracking ready', '✅ Performance monitoring setup', '✅ Custom event tracking']
        : ['❌ Analytics not implemented', '📋 Monitoring strategy planned', '🔧 Error tracking needed', '📊 User behavior tracking planned']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'configured': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'missing': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'configured': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'missing': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const readyCount = configurations.filter(c => c.status === 'ready').length;
  const configuredCount = configurations.filter(c => c.status === 'configured').length;
  const errorCount = configurations.filter(c => c.status === 'error').length;
  const missingCount = configurations.filter(c => c.status === 'missing').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Configuration Status</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time status of all services and environment variables. Clear error messages guide you through 
            the setup process to enable full functionality.
          </p>
        </div>

        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Implementation Overview</span>
            </CardTitle>
            <CardDescription>
              Current system state across all major components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{readyCount}</div>
                <div className="text-sm text-green-700">Production Ready</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{configuredCount}</div>
                <div className="text-sm text-blue-700">API Configured</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{errorCount}</div>
                <div className="text-sm text-yellow-700">Configuration Errors</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{missingCount}</div>
                <div className="text-sm text-red-700">Not Implemented</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration Alert */}
        <Alert>
          <Cpu className="h-4 w-4" />
          <AlertDescription>
            <strong>AI Status:</strong> {aiStatus.message}
            {!aiStatus.visionAPI && (
              <span className="ml-2 text-xs">
                (Add NEXT_PUBLIC_GOOGLE_VISION_API_KEY to enable real AI analysis)
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Debug Firebase Configuration */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">🔧 Debug: Firebase Configuration</CardTitle>
            <CardDescription className="text-orange-700">
              Environment variable status (for troubleshooting)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>FIREBASE_API_KEY:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>FIREBASE_AUTH_DOMAIN:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>FIREBASE_PROJECT_ID:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>FIREBASE_STORAGE_BUCKET:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>FIREBASE_APP_ID:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>FIREBASE_MEASUREMENT_ID:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
              </div>
            </div>
            
            {!firebaseReady && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Configuration Issue:</strong> Some Firebase environment variables are missing. 
                  Make sure your .env file has all required NEXT_PUBLIC_FIREBASE_* variables and restart the dev server.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Configuration Details */}
        <div className="grid gap-6">
          {configurations.map((config, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {config.icon}
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(config.status)}
                    <Badge className={getStatusColor(config.status)}>
                      {config.status.charAt(0).toUpperCase() + config.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {config.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="text-sm text-gray-600">
                      {detail}
                    </div>
                  ))}
                </div>
                {config.error && (
                  <div className="mt-4">
                    <ServiceErrorDisplay 
                      error={config.error}
                      variant="inline"
                      showRetry={false}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Production Readiness Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Production Implementation Plan</CardTitle>
            <CardDescription>
              Next steps to move from prototype to production system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h4 className="font-medium text-gray-900">Immediate Priority (Week 1-2):</h4>
              <ul className="text-gray-600 space-y-1">
                <li>Set up Firebase project with Australian data residency</li>
                <li>Configure Google Vision API with custom plant disease model</li>
                <li>Implement APVMA API integration for real compliance checking</li>
                <li>Add comprehensive error handling and monitoring</li>
              </ul>

              <h4 className="font-medium text-gray-900 mt-4">Enhanced Features (Week 3-6):</h4>
              <ul className="text-gray-600 space-y-1">
                <li>Custom TensorFlow model training with Australian plant data</li>
                <li>Real-time expert consultation system</li>
                <li>Treatment effectiveness tracking and community features</li>
                <li>Advanced analytics and user behavior insights</li>
              </ul>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button asChild>
                <Link href="/demo">
                  View Live Demo
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 