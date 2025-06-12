'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { MessageCircle, Settings, AlertTriangle, BarChart3, Shield } from 'lucide-react';

export default function AdminDashboardPage() {
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
              You don't have permission to access this admin panel.
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="w-full bg-garden-dark hover:bg-garden-medium"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-garden-cream py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-garden-dark" />
            <h1 className="text-3xl font-bold text-garden-dark">Admin Dashboard</h1>
          </div>
          <p className="text-garden-medium max-w-2xl mx-auto">
            Welcome to the admin panel. Manage user feedback, configure system settings, and monitor application performance.
          </p>
        </div>

        {/* Admin Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Feedback Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/feedback')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-garden-dark">User Feedback</CardTitle>
                  <p className="text-garden-medium">Monitor user experiences and ratings</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-garden-medium">
                  View and analyze user feedback, ratings, and system performance metrics. 
                  Track user satisfaction and identify areas for improvement.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Emoji Ratings
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Real-time Analytics
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Email Alerts
                  </span>
                </div>
                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/admin/feedback');
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View Feedback Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/config')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-garden-dark">System Configuration</CardTitle>
                  <p className="text-garden-medium">Monitor and configure system services</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-garden-medium">
                  Check the status of Firebase, AI services, and other system components. 
                  Debug configuration issues and monitor service health.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Firebase Status
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    AI Services
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Environment Variables
                  </span>
                </div>
                <Button 
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/config');
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  View Configuration Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">🎯</div>
                <div className="text-sm text-blue-700 mt-1">Admin Access Active</div>
                <div className="text-xs text-garden-medium mt-1">Full system privileges enabled</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">🔐</div>
                <div className="text-sm text-green-700 mt-1">Secure Authentication</div>
                <div className="text-xs text-garden-medium mt-1">Firebase custom claims verified</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">🌱</div>
                <div className="text-sm text-purple-700 mt-1">GardenGuardian AI</div>
                <div className="text-xs text-garden-medium mt-1">Admin panel ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 