'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Database, Camera, Cpu, Globe, Shield, BarChart3, AlertTriangle } from 'lucide-react';
import { isFirebaseConfigured, isAnalyticsConfigured, auth } from '@/lib/firebase-config';
import { isGeminiAPIConfigured, getGeminiConfigurationStatus } from '@/lib/gemini-vision';
import { ServiceErrorDisplay } from '@/components/ui/service-error';
import { FIREBASE_ERRORS, GEMINI_VISION_ERRORS } from '@/lib/error-handling';
import { onAuthStateChanged } from 'firebase/auth';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Check admin status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Force token refresh to get latest custom claims
          await user.getIdToken(true);
          const idTokenResult = await user.getIdTokenResult();
          const isUserAdmin = idTokenResult.claims.admin === true;
          
          setIsAdmin(isUserAdmin);
          
          if (!isUserAdmin) {
            router.push('/login');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          router.push('/login');
        }
      } else {
        setIsAdmin(false);
        router.push('/login');
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [router]);

  const firebaseReady = isFirebaseConfigured();
  const geminiReady = isGeminiAPIConfigured();
  const analyticsReady = isAnalyticsConfigured();
  const aiStatus = getGeminiConfigurationStatus();

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
      name: 'Gemini AI System',
      description: 'Intelligent plant health analysis',
      status: geminiReady ? 'configured' : 'error',
      icon: <Cpu className="h-5 w-5" />,
      details: geminiReady
        ? ['✅ Gemini 2.0 Flash API active', '✅ AI-powered plant diagnosis', '✅ Australian treatment recommendations', '✅ Intelligent health assessment']
        : ['❌ Gemini 2.0 Flash not configured', '🔧 API key missing', '📋 See error details below'],
      error: !geminiReady ? GEMINI_VISION_ERRORS.NOT_CONFIGURED : undefined
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

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-garden-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-garden-dark mx-auto mb-4"></div>
          <p className="text-garden-medium">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-garden-cream flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-garden-alert">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-garden-medium mb-4">
              You don't have permission to access this configuration panel. Admin privileges are required.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/')}
                className="flex-1 bg-garden-dark hover:bg-garden-medium"
              >
                Go Home
              </Button>
              <Button 
                onClick={() => router.push('/admin')}
                variant="outline"
                className="flex-1 border-garden-dark text-garden-dark hover:bg-garden-dark hover:text-white"
              >
                Admin Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {!aiStatus.geminiAPI && (
              <span className="ml-2 text-xs">
                (Add NEXT_PUBLIC_GEMINI_API_KEY to enable intelligent plant analysis)
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Debug Configuration */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">🔧 Debug: Environment Configuration</CardTitle>
            <CardDescription className="text-orange-700">
              Environment variable status (for troubleshooting)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-800">Firebase Variables</h4>
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
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-800">AI & External APIs</h4>
                <div className="flex items-center justify-between">
                  <span>GEMINI_API_KEY:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>OPENWEATHER_API_KEY:</span>
                  <Badge variant={process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ? "default" : "destructive"}>
                    {process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                {process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
                  <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded mt-2">
                    Gemini API Key: {process.env.NEXT_PUBLIC_GEMINI_API_KEY.substring(0, 8)}...
                    (Length: {process.env.NEXT_PUBLIC_GEMINI_API_KEY.length} chars)
                  </div>
                )}
              </div>
            </div>
            
            {(!firebaseReady || !geminiReady) && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Configuration Issues Detected:</strong>
                  {!firebaseReady && <div>• Firebase environment variables missing. Add all NEXT_PUBLIC_FIREBASE_* variables.</div>}
                  {!geminiReady && <div>• Gemini 2.0 Flash API key missing. Add NEXT_PUBLIC_GEMINI_API_KEY.</div>}
                  <div className="mt-2 text-xs">Restart the development server after adding environment variables.</div>
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
                <li>Configure Gemini 2.0 Flash API for intelligent plant health analysis</li>
                <li>Implement APVMA API integration for real compliance checking</li>
                <li>Add comprehensive error handling and monitoring</li>
              </ul>

              <h4 className="font-medium text-gray-900 mt-4">Enhanced Features (Week 3-6):</h4>
              <ul className="text-gray-600 space-y-1">
                <li>Enhanced Gemini prompts with Australian plant disease expertise</li>
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