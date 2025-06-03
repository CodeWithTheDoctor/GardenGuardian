'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Leaf,
  CheckCircle
} from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (auth) {
        // Firebase authentication
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Firebase login successful');
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        // Fallback authentication
        console.log('Login successful for:', email);
        localStorage.setItem('demo-user', JSON.stringify({
          name: email.split('@')[0],
          id: 'demo-user-123',
          email
        }));
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        className="min-h-screen bg-garden-cream flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle className="h-16 w-16 text-garden-light mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-garden-dark mb-2">Welcome Back!</h2>
          <p className="text-garden-medium">Redirecting to your dashboard...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-garden-cream flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="text-center mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            variants={fadeInUp}
            className="mx-auto mb-4 p-3 bg-garden-light/20 rounded-full w-fit"
          >
            <Leaf className="h-8 w-8 text-garden-medium" />
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-bold text-garden-dark mb-2"
          >
            Welcome Back
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-garden-medium"
          >
            Sign in to continue your garden health journey
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-garden-light/30">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-garden-dark">Sign In</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  variants={slideInLeft}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="email" className="text-garden-dark">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-garden-medium" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-garden-light focus:border-garden-medium"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  variants={slideInLeft}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="password" className="text-garden-dark">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-garden-medium" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-garden-light focus:border-garden-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800">Sign In Failed</AlertTitle>
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  variants={slideInLeft}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.5 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-garden-dark hover:bg-garden-medium text-white py-2.5"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                          />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>

              <motion.div 
                className="mt-6 text-center"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-garden-medium">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-garden-dark font-semibold hover:text-garden-medium transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="mt-6 text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-garden-medium">
            Secure login powered by Firebase Authentication
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
} 