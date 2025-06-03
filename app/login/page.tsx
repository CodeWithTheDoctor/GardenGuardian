'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, Eye, EyeOff, Info } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase-config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const firebaseReady = isFirebaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (firebaseReady) {
        // Real Firebase authentication would go here
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase-config');
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', userCredential.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // Demo mode authentication
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        
        if (email && password) {
          console.log('Demo login successful for:', email);
          // In demo mode, we'll simulate successful login
          localStorage.setItem('demo-user', JSON.stringify({ 
            email, 
            id: 'demo-user-123',
            name: email.split('@')[0] 
          }));
          router.push('/dashboard');
        } else {
          throw new Error('Please enter both email and password');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and branding */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">GardenGuardian</span>
          </div>
          <p className="text-gray-600">Welcome back to your garden health companion</p>
        </div>

        {/* Prototype status notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {firebaseReady 
              ? "✅ Firebase authentication is configured and functional"
              : "🧪 Demo mode: Authentication simulated for prototype testing"
            }
          </AlertDescription>
        </Alert>

        {/* Login form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your garden dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                  Sign up here
                </Link>
              </p>
              
              {!firebaseReady && (
                <p className="text-xs text-gray-500">
                  Demo tip: Use any email/password combination to test the interface
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 