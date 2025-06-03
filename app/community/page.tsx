'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, MapPin, Star, MessageCircle, Heart, Share2, 
  AlertTriangle, CheckCircle, Leaf, Bug, Calendar
} from 'lucide-react';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location: string;
    expertise: string;
    verified: boolean;
  };
  type: 'success_story' | 'help_request' | 'alert' | 'tip';
  title: string;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  disease?: string;
  treatment?: string;
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      location: 'Melbourne, VIC',
      expertise: 'Organic Gardening Expert',
      verified: true
    },
    type: 'success_story',
    title: 'Saved my tomatoes from blight using copper spray!',
    content: 'Thanks to GardenGuardian AI, I identified early blight on my tomatoes and treated them with copper oxychloride. 3 weeks later and they\'re thriving! The key was catching it early.',
    images: [
      'https://images.pexels.com/photos/7728056/pexels-photo-7728056.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      'https://images.pexels.com/photos/7728078/pexels-photo-7728078.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
    ],
    tags: ['tomatoes', 'blight', 'copper-spray', 'success'],
    likes: 24,
    comments: 8,
    createdAt: '2024-01-15T10:30:00Z',
    disease: 'Early Blight',
    treatment: 'Copper Oxychloride'
  },
  {
    id: '2',
    author: {
      name: 'Mike Thompson',
      location: 'Brisbane, QLD',
      expertise: 'Fruit Tree Specialist',
      verified: true
    },
    type: 'alert',
    title: 'Fruit Fly Alert - Brisbane North',
    content: 'High fruit fly activity detected in Brisbane northern suburbs. I\'ve caught 15+ in my traps this week. Time to harvest early and set up more traps!',
    images: ['https://images.pexels.com/photos/7728081/pexels-photo-7728081.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'],
    tags: ['fruit-fly', 'brisbane', 'alert', 'traps'],
    likes: 18,
    comments: 12,
    createdAt: '2024-01-14T16:45:00Z'
  },
  {
    id: '3',
    author: {
      name: 'Emma Rodriguez',
      location: 'Perth, WA',
      expertise: 'Native Plant Enthusiast',
      verified: false
    },
    type: 'help_request',
    title: 'Strange spots on my native hibiscus - help needed!',
    content: 'I\'ve noticed these brown spots appearing on my native hibiscus leaves. They started small but are spreading. Has anyone seen this before? I\'m in Perth and we\'ve had unusual humidity lately.',
    images: ['https://images.pexels.com/photos/7728039/pexels-photo-7728039.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'],
    tags: ['hibiscus', 'native-plants', 'help-needed', 'perth'],
    likes: 5,
    comments: 15,
    createdAt: '2024-01-13T09:20:00Z'
  },
  {
    id: '4',
    author: {
      name: 'David Kim',
      location: 'Adelaide, SA',
      expertise: 'Vegetable Garden Master',
      verified: true
    },
    type: 'tip',
    title: 'Pro tip: Companion planting to prevent aphids',
    content: 'Plant marigolds and nasturtiums around your vegetables! I\'ve been doing this for 5 years and rarely get aphid problems. The marigolds repel them naturally, and nasturtiums act as trap crops.',
    images: [],
    tags: ['companion-planting', 'aphids', 'prevention', 'organic'],
    likes: 31,
    comments: 6,
    createdAt: '2024-01-12T14:15:00Z'
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate loading community posts
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.type === activeTab;
  });

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'success_story': return <CheckCircle className="h-5 w-5 text-garden-light" />;
      case 'help_request': return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-garden-alert" />;
      case 'tip': return <Leaf className="h-5 w-5 text-garden-medium" />;
      default: return <MessageCircle className="h-5 w-5 text-garden-medium" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'success_story': return 'Success Story';
      case 'help_request': return 'Help Needed';
      case 'alert': return 'Community Alert';
      case 'tip': return 'Garden Tip';
      default: return 'Post';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-garden-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-garden-dark mb-4">
            Garden Community
          </h1>
          <p className="text-garden-medium max-w-2xl mx-auto">
            Connect with local gardeners, share success stories, and get help from experienced growers in your area.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-garden-light/30 text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-garden-medium mx-auto mb-2" />
              <div className="text-2xl font-bold text-garden-dark">2,847</div>
              <div className="text-garden-medium">Active Gardeners</div>
            </CardContent>
          </Card>
          
          <Card className="border-garden-light/30 text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 text-garden-light mx-auto mb-2" />
              <div className="text-2xl font-bold text-garden-dark">1,234</div>
              <div className="text-garden-medium">Plants Saved</div>
            </CardContent>
          </Card>
          
          <Card className="border-garden-light/30 text-center">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-garden-alert mx-auto mb-2" />
              <div className="text-2xl font-bold text-garden-dark">156</div>
              <div className="text-garden-medium">Local Experts</div>
            </CardContent>
          </Card>
        </div>

        {/* Post Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-white border border-garden-light/30">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="success_story">Success Stories</TabsTrigger>
              <TabsTrigger value="help_request">Help Requests</TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
              <TabsTrigger value="tip">Tips</TabsTrigger>
            </TabsList>
            
            <Button className="bg-garden-dark hover:bg-garden-medium text-white">
              Share Your Story
            </Button>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-garden-light/30">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-garden-light/20 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-garden-light/20 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-garden-light/20 rounded w-1/6"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-garden-light/20 rounded w-3/4 mb-3"></div>
                        <div className="h-20 bg-garden-light/20 rounded mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-garden-light/20 rounded w-16"></div>
                          <div className="h-8 bg-garden-light/20 rounded w-16"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="border-garden-light/30 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-garden-dark">{post.author.name}</span>
                            {post.author.verified && (
                              <Badge className="bg-garden-light text-garden-dark text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Expert
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-garden-medium">
                            <MapPin className="h-3 w-3" />
                            {post.author.location}
                            <span>•</span>
                            {post.author.expertise}
                            <span>•</span>
                            {formatTimeAgo(post.createdAt)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {getPostIcon(post.type)}
                          <Badge variant="outline" className="text-xs">
                            {getPostTypeLabel(post.type)}
                          </Badge>
                        </div>
                      </div>

                      {/* Post Content */}
                      <h3 className="text-lg font-semibold text-garden-dark mb-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-garden-medium mb-4">
                        {post.content}
                      </p>

                      {/* Post Images */}
                      {post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {post.images.slice(0, 2).map((image, index) => (
                            <div key={index} className="aspect-video bg-black/5 rounded-lg overflow-hidden">
                              <img 
                                src={image} 
                                alt={`Post image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-garden-light text-garden-medium">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-garden-light/20">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-garden-medium hover:text-garden-dark">
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-garden-medium hover:text-garden-dark">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-garden-medium hover:text-garden-dark">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-12 border-garden-light/30 bg-gradient-to-r from-garden-light/10 to-garden-medium/10">
          <CardContent className="p-8 text-center">
            <Leaf className="h-12 w-12 text-garden-medium mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-garden-dark mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-garden-medium mb-6 max-w-2xl mx-auto">
              Share your garden successes, get help from local experts, and help fellow gardeners save their plants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-garden-dark hover:bg-garden-medium text-white">
                Share Your Success Story
              </Button>
              <Button variant="outline" className="border-garden-medium text-garden-dark">
                Find Local Experts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 