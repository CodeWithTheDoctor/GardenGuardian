'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Users, MapPin, Star, MessageCircle, Heart, Share2, 
  AlertTriangle, CheckCircle, Leaf, Bug, Calendar,
  Plus, Filter, Search, Shield, Clock, Award
} from 'lucide-react';
import { communityService, CommunityPost, LocalAlert, CommunityUser } from '@/lib/community-service';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [localAlerts, setLocalAlerts] = useState<LocalAlert[]>([]);
  const [nearbyGardeners, setNearbyGardeners] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [userLocation, setUserLocation] = useState('2000'); // Default postcode
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'question' as const,
    tags: [] as string[]
  });

  useEffect(() => {
    loadCommunityData();
  }, [userLocation]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      // Load posts, alerts, and nearby gardeners in parallel
      const [postsData, alertsData, gardenersData] = await Promise.all([
        communityService.getPosts({ limit: 20 }),
        communityService.getLocalAlerts(userLocation),
        communityService.getNearbyGardeners(userLocation)
      ]);

      setPosts(postsData);
      setLocalAlerts(alertsData);
      setNearbyGardeners(gardenersData);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const postData = {
        authorId: 'current_user', // In real app, get from auth
        type: newPost.type,
        title: newPost.title,
        content: newPost.content,
        images: [],
        tags: newPost.tags,
        urgency: 'medium' as const,
        status: 'open' as const,
        featured: false,
        moderated: true
      };

      const createdPost = await communityService.createPost(postData);
      setPosts(prev => [createdPost, ...prev]);
      setNewPost({ title: '', content: '', type: 'question', tags: [] });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

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
      case 'question': return <MessageCircle className="h-5 w-5 text-purple-500" />;
      default: return <MessageCircle className="h-5 w-5 text-garden-medium" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'success_story': return 'Success Story';
      case 'help_request': return 'Help Needed';
      case 'alert': return 'Community Alert';
      case 'tip': return 'Garden Tip';
      case 'question': return 'Question';
      default: return 'Post';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-garden-dark mb-4">
            Garden Community
          </h1>
          <p className="text-garden-medium max-w-2xl mx-auto mb-6">
            Connect with local gardeners, share success stories, and get help from experienced growers in your area.
          </p>
          
          {/* Location Input */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-garden-medium" />
            <Input
              placeholder="Enter your postcode"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="w-32"
            />
            <Button onClick={loadCommunityData} size="sm">
              Update Location
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <Card className="border-garden-light/30">
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-garden-medium" />
                  <div>
                    <div className="font-semibold">2,847</div>
                    <div className="text-sm text-garden-medium">Active Gardeners</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-garden-light" />
                  <div>
                    <div className="font-semibold">1,234</div>
                    <div className="text-sm text-garden-medium">Plants Saved</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-garden-alert" />
                  <div>
                    <div className="font-semibold">{nearbyGardeners.filter(g => g.verified).length}</div>
                    <div className="text-sm text-garden-medium">Local Experts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Local Alerts */}
            <Card className="border-garden-light/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Local Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {localAlerts.length === 0 ? (
                  <p className="text-sm text-garden-medium">No active alerts in your area</p>
                ) : (
                  localAlerts.slice(0, 3).map((alert) => (
                    <Alert key={alert.id} className={getAlertSeverityColor(alert.severity)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-sm">{alert.title}</AlertTitle>
                      <AlertDescription className="text-xs">
                        {alert.description.substring(0, 100)}...
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Nearby Experts */}
            <Card className="border-garden-light/30">
              <CardHeader>
                <CardTitle className="text-lg">Nearby Experts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyGardeners.slice(0, 5).map((gardener) => (
                  <div key={gardener.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={gardener.avatar} />
                      <AvatarFallback>{gardener.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate">{gardener.name}</span>
                        {gardener.verified && <Shield className="h-3 w-3 text-blue-500" />}
                      </div>
                      <div className="text-xs text-garden-medium">
                        {gardener.expertise[0]} • {gardener.plantsHelped} plants helped
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Create Post Button */}
            <div className="mb-6">
              <Button 
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="bg-garden-dark hover:bg-garden-medium text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Share Your Experience
              </Button>
            </div>

            {/* Create Post Form */}
            {showCreatePost && (
              <Card className="mb-6 border-garden-light/30">
                <CardHeader>
                  <CardTitle>Share with the Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Post title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <select
                      value={newPost.type}
                      onChange={(e) => setNewPost(prev => ({ ...prev, type: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="question">Question</option>
                      <option value="tip">Garden Tip</option>
                      <option value="success_story">Success Story</option>
                      <option value="help_request">Help Request</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                  <Textarea
                    placeholder="Share your experience, ask for help, or give advice..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePost}>Post</Button>
                    <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Post Filters */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="question">Questions</TabsTrigger>
                <TabsTrigger value="success_story">Success</TabsTrigger>
                <TabsTrigger value="help_request">Help</TabsTrigger>
                <TabsTrigger value="tip">Tips</TabsTrigger>
                <TabsTrigger value="alert">Alerts</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-garden-medium">Loading community posts...</div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-garden-medium mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-garden-dark mb-2">
                    No posts found
                  </h3>
                  <p className="text-garden-medium">
                    Be the first to share something with the community!
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="border-garden-light/30 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      {/* Post Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{post.author.name}</span>
                            {post.author.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                {post.author.verificationLevel}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {getPostIcon(post.type)}
                              <span className="ml-1">{getPostTypeLabel(post.type)}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-garden-medium">
                            <MapPin className="h-3 w-3" />
                            <span>{post.author.location.suburb}, {post.author.location.state}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-garden-dark mb-2">
                          {post.title}
                        </h3>
                        <p className="text-garden-medium whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Images */}
                      {post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {post.images.slice(0, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="rounded-lg object-cover h-32 w-full"
                            />
                          ))}
                        </div>
                      )}

                      {/* Post Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-garden-light/20">
                        <Button variant="ghost" size="sm" className="text-garden-medium">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-garden-medium">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments.length}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-garden-medium">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        {post.status === 'resolved' && (
                          <Badge className="ml-auto bg-garden-light text-garden-dark">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 