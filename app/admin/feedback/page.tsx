'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase-config';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Mail, 
  Clock, 
  Star, 
  User, 
  MessageCircle,
  TrendingUp,
  BarChart3,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FeedbackItem {
  id: string;
  rating: number;
  context: string;
  page: string;
  diagnosisId?: string;
  message?: string;
  email?: string;
  userEmail?: string;
  userId: string;
  userAgent: string;
  timestamp: Date;
  createdAt?: Timestamp;
}

interface FeedbackStats {
  total: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  contextBreakdown: { [key: string]: number };
  recentFeedback: number; // Last 7 days
}

const EMOJI_RATINGS = ['', '😡', '😞', '😐', '😊', '😍'];
const RATING_LABELS = ['', 'Very Poor', 'Poor', 'Okay', 'Good', 'Excellent'];
const RATING_COLORS = ['', 'text-red-600', 'text-orange-500', 'text-yellow-600', 'text-green-500', 'text-green-600'];

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [filterContext, setFilterContext] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  
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

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!isAdmin || !authChecked) return;
      
      try {
        setLoading(true);
        
        // Fetch feedback from Firestore
        const q = query(
          collection(db, 'feedback'), 
          orderBy('createdAt', 'desc'), 
          limit(100)
        );
        
        const querySnapshot = await getDocs(q);
        const feedbackData: FeedbackItem[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
            createdAt: data.createdAt
          } as FeedbackItem;
        });
        
        setFeedback(feedbackData);
        
        // Calculate statistics
        const totalFeedback = feedbackData.length;
        const averageRating = totalFeedback > 0 
          ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / totalFeedback 
          : 0;
          
        const ratingDistribution: { [key: number]: number } = {};
        const contextBreakdown: { [key: string]: number } = {};
        
        feedbackData.forEach(item => {
          ratingDistribution[item.rating] = (ratingDistribution[item.rating] || 0) + 1;
          contextBreakdown[item.context] = (contextBreakdown[item.context] || 0) + 1;
        });
        
        // Count recent feedback (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentFeedback = feedbackData.filter(item => 
          item.timestamp >= sevenDaysAgo
        ).length;
        
        setStats({
          total: totalFeedback,
          averageRating,
          ratingDistribution,
          contextBreakdown,
          recentFeedback
        });
        
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [isAdmin, authChecked]);

  // Filter feedback based on selected filters
  const filteredFeedback = feedback.filter(item => {
    const contextMatch = filterContext === 'all' || item.context === filterContext;
    const ratingMatch = filterRating === 'all' || item.rating.toString() === filterRating;
    return contextMatch && ratingMatch;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-garden-cream px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-garden-cream px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-garden-dark mb-2">
            🌱 Feedback Dashboard
          </h1>
          <p className="text-garden-medium">
            Monitor user feedback and improve GardenGuardian AI
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-garden-medium">Total Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-garden-dark">{stats.total}</div>
                <p className="text-xs text-garden-medium">
                  <span className="text-green-600">+{stats.recentFeedback}</span> in last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-garden-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-garden-dark">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-xs text-garden-medium">Out of 5.0 stars</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-garden-medium">Most Common Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-garden-dark">
                  {Object.entries(stats.contextBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </div>
                <p className="text-xs text-garden-medium">
                  {Object.entries(stats.contextBreakdown).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} responses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-garden-medium">Poor Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {(stats.ratingDistribution[1] || 0) + (stats.ratingDistribution[2] || 0)}
                </div>
                <p className="text-xs text-garden-medium">Need attention</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px]">
                <label className="text-sm font-medium text-garden-medium mb-2 block">Context</label>
                <Select value={filterContext} onValueChange={setFilterContext}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contexts</SelectItem>
                    {stats && Object.keys(stats.contextBreakdown).map(context => (
                      <SelectItem key={context} value={context}>
                        {context} ({stats.contextBreakdown[context]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[150px]">
                <label className="text-sm font-medium text-garden-medium mb-2 block">Rating</label>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {EMOJI_RATINGS[rating]} {rating} Star{rating !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Feedback ({filteredFeedback.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-garden-medium mx-auto mb-4" />
                <h3 className="text-lg font-medium text-garden-dark mb-2">No feedback found</h3>
                <p className="text-garden-medium">No feedback matches your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedback.map((item) => (
                  <div key={item.id} className="border border-garden-light/30 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{EMOJI_RATINGS[item.rating]}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={RATING_COLORS[item.rating]}>
                              {item.rating}/5 - {RATING_LABELS[item.rating]}
                            </Badge>
                            <Badge variant="secondary">{item.context}</Badge>
                          </div>
                        </div>
                        
                        <div className="text-sm text-garden-medium mb-2">
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {item.timestamp.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {item.userEmail || 'Anonymous'}
                            </span>
                            {item.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${item.email}`} className="text-garden-dark hover:underline">
                                  {item.email}
                                </a>
                              </span>
                            )}
                          </div>
                        </div>

                        {item.message && (
                          <div className="bg-garden-cream p-3 rounded-lg mb-2">
                            <p className="text-garden-dark italic">
                              "{item.message}"
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-garden-medium space-y-1">
                          <div>Page: {item.page}</div>
                          {item.diagnosisId && <div>Diagnosis ID: {item.diagnosisId}</div>}
                          <div>User ID: {item.userId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 