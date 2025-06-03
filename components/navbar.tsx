'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Leaf, Menu, X, User, Home, Camera, BarChart2, LogIn, Users, Settings, Shield } from 'lucide-react';
import { auth, isFirebaseConfigured } from '@/lib/firebase-config';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!firebaseReady) {
      // In demo mode, check localStorage
      const demoUser = localStorage.getItem('demo-user');
      if (demoUser) {
        setUser({ displayName: JSON.parse(demoUser).name } as FirebaseUser);
      }
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔍 Auth state changed:', user ? user.uid : 'signed out');
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseReady]);

  const handleSignOut = async () => {
    try {
      if (firebaseReady) {
        await signOut(auth);
        console.log('🔍 User signed out');
      } else {
        // Demo mode sign out
        localStorage.removeItem('demo-user');
        setUser(null);
        console.log('🔍 Demo user signed out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Diagnose', href: '/diagnose', icon: <Camera className="h-5 w-5" /> },
    { name: 'Dashboard', href: '/dashboard', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Community', href: '/community', icon: <Users className="h-5 w-5" /> },
    { name: 'Compliance', href: '/compliance', icon: <Shield className="h-5 w-5" /> },
    { name: 'Config', href: '/config', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-garden-light/20 bg-garden-cream/80 backdrop-blur supports-[backdrop-filter]:bg-garden-cream/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-garden-dark hover:text-garden-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-1 bg-garden-dark rounded-full">
                <Leaf className="h-6 w-6 text-garden-light" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">GardenGuardian</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ name, href }) => (
              <Link 
                key={name}
                href={href}
                className="text-garden-dark hover:text-garden-medium transition-colors font-medium"
              >
                {name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <>
                <span className="hidden sm:inline text-sm text-garden-medium">
                  Welcome, {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-garden-dark hover:text-garden-medium hover:bg-garden-light/10"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                  className="hidden sm:flex border-garden-light text-garden-dark hover:bg-garden-light/10"
                >
                  Sign Out
                </Button>
              </>
            ) : !isLoading ? (
              <Button asChild className="hidden sm:flex bg-garden-dark hover:bg-garden-medium text-white">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            ) : (
              <div className="hidden sm:flex w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden text-garden-dark hover:text-garden-medium hover:bg-garden-light/10"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-garden-light/20 p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-4 border-b border-garden-light/20">
                    <div className="flex justify-between items-center">
                      <Link 
                        href="/" 
                        className="flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="p-1 bg-garden-dark rounded-full">
                          <Leaf className="h-5 w-5 text-garden-light" />
                        </div>
                        <SheetTitle className="font-bold text-xl text-garden-dark">GardenGuardian</SheetTitle>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsOpen(false)}
                        className="text-garden-dark hover:bg-garden-light/10"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-auto py-4">
                    <nav className="flex flex-col gap-1 px-2">
                      {navLinks.map(({ name, href, icon }) => (
                        <Link
                          key={name}
                          href={href}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-garden-dark hover:bg-garden-light/10 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {icon}
                          <span>{name}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                  
                  <div className="p-4 border-t border-garden-light/20">
                    {!isLoading && user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-garden-medium flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-garden-dark">
                              {user.displayName || user.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-garden-medium">
                              Authenticated User
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full border-garden-light text-garden-dark"
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : !isLoading ? (
                      <div className="flex flex-col gap-2">
                        <Button asChild className="w-full bg-garden-dark hover:bg-garden-medium text-white">
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-garden-light text-garden-dark">
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            Register
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}