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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const firebaseReady = isFirebaseConfigured();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error('Name is required');
    }
    if (!formData.email.trim()) {
      throw new Error('Email is required');
    }
    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Registration form submitted');
    console.log('🔍 Form data:', { ...formData, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
    console.log('🔍 Firebase ready:', firebaseReady);
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 Validating form...');
      validateForm();
      console.log('🔍 Form validation passed');

      if (firebaseReady) {
        console.log('🔍 Using Firebase authentication');
        // Real Firebase authentication would go here
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase-config');
        
        console.log('🔍 Creating user with Firebase...');
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        console.log('🔍 User created successfully:', userCredential.user.uid);
        
        // Update the user's display name
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });
        
        console.log('🔍 Profile updated, redirecting to dashboard...');
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.log('🔍 Using demo mode authentication');
        // Demo mode registration
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        
        console.log('Demo registration successful for:', formData.email);
        
        // In demo mode, we'll simulate successful registration
        localStorage.setItem('demo-user', JSON.stringify({ 
          email: formData.email, 
          id: 'demo-user-123',
          name: formData.name 
        }));
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('🚨 Registration error:', error);
      console.error('🚨 Error code:', error.code);
      console.error('🚨 Error message:', error.message);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      console.log('🔍 Setting loading to false');
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
          <p className="text-gray-600">Join thousands of successful Australian gardeners</p>
        </div>

        {/* Prototype status notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {firebaseReady 
              ? "✅ Firebase authentication is configured and functional"
              : "🧪 Demo mode: Registration simulated for prototype testing"
            }
          </AlertDescription>
        </Alert>

        {/* Registration form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Get started with your personalized garden health companion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in here
                </Link>
              </p>
              
              {!firebaseReady && (
                <p className="text-xs text-gray-500">
                  Demo tip: Use any valid details to test the interface
                </p>
              )}

              <p className="text-xs text-gray-500 mt-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 