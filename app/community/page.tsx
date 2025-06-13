'use client';

import { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Users, MapPin, Star, MessageCircle, Heart, Share2, 
  AlertTriangle, CheckCircle, Leaf, Bug, Calendar,
  Plus, Filter, Search, Shield, Clock, Award, Trash2, X, Sun
} from 'lucide-react';
import { communityService, CommunityPost, LocalAlert, CommunityUser } from '@/lib/community-service';
import { auth } from '@/lib/firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { WYSIWYGEditor } from '@/components/ui/wysiwyg-editor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [localAlerts, setLocalAlerts] = useState<LocalAlert[]>([]);
  const [nearbyGardeners, setNearbyGardeners] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [userLocation, setUserLocation] = useState('2000'); // Default postcode
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'question' as const,
    tags: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('latest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showComments, setShowComments] = useState<Set<string>>(new Set());

  // Listen for authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Check if user is admin
      if (user) {
        try {
          const token = await user.getIdTokenResult();
          setIsAdmin(!!token.claims.admin);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

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
    if (!currentUser) {
      // Redirect to sign in page instead of showing alert
      window.location.href = '/login?redirect=/community';
      return;
    }

    try {
      const postData = {
        authorId: currentUser.uid,
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
      alert('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!isAdmin) {
      alert('Only administrators can delete posts');
      return;
    }

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await communityService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!currentUser) {
      // Redirect to sign in page instead of showing alert
      window.location.href = '/login?redirect=/community';
      return;
    }

    try {
      const result = await communityService.togglePostLike(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: result.totalLikes, likedBy: result.liked 
              ? [...(post.likedBy || []), currentUser.uid]
              : (post.likedBy || []).filter(id => id !== currentUser.uid) }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleToggleComments = async (postId: string) => {
    if (!currentUser) {
      // Redirect to sign in page instead of showing alert
      window.location.href = '/login?redirect=/community';
      return;
    }

    setShowComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handleSharePost = async (post: CommunityPost) => {
    const shareData = {
      title: post.title,
      text: `Check out this garden post: ${post.title}`,
      url: window.location.href.split('?')[0] + `?post=${post.id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\nView post: ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      alert('Failed to share post. Please try again.');
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

  const togglePostExpand = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const getWeatherBadge = (post: CommunityPost) => {
    // This would be replaced with actual weather data
    return (
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
        <Sun className="h-3 w-3 mr-1" />
        32°C | Humid
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-garden-cream">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header - More Compact on Mobile */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-garden-dark mb-2 sm:mb-4">
            Garden Community
          </h1>
          <p className="text-garden-medium max-w-2xl mx-auto mb-4 text-base sm:text-lg px-4">
            Connect with local gardeners, share success stories, and get help from experienced growers in your area.
          </p>

          {/* Enhanced Location Input - More Compact on Mobile */}
          <div className="flex justify-center items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-garden-medium" />
            <Input
              placeholder="Enter postcode"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="w-24 sm:w-32 text-base sm:text-lg h-8 sm:h-10"
              aria-label="Enter your postcode"
            />
            <Button 
              onClick={loadCommunityData} 
              size="sm"
              className="h-8 sm:h-10 text-base"
            >
              Update
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3">
            {/* Enhanced Post Filters - More Compact on Mobile */}
            <div className="sticky top-0 bg-garden-cream z-10 pb-2 sm:pb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="h-9 sm:h-10 grid w-full grid-cols-3 sm:grid-cols-6 text-xs sm:text-sm">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="question">Q&A</TabsTrigger>
                    <TabsTrigger value="success_story">Success</TabsTrigger>
                    <TabsTrigger value="help_request" className="hidden sm:block">Help</TabsTrigger>
                    <TabsTrigger value="tip" className="hidden sm:block">Tips</TabsTrigger>
                    <TabsTrigger value="alert" className="hidden sm:block">Alerts</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

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
                  <WYSIWYGEditor
                    value={newPost.content}
                    onChange={(content) => setNewPost(prev => ({ ...prev, content }))}
                    placeholder="Share your experience, ask for help, or give advice..."
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

            {showFilters && (
              <Card className="mb-2">
                <CardContent className="p-3">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      >
                        <option value="latest">Latest</option>
                        <option value="most_liked">Most Liked</option>
                        <option value="local">Local Relevance</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Quick Filters</label>
                      <div className="flex flex-wrap gap-1">
                        {['Pest', 'Disease', 'Veggies', 'Fruit', 'Flowers'].map((tag) => (
                          <div key={tag} className="inline-block">
                            <Badge
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="text-xs cursor-pointer"
                              onClick={() => {
                                setSelectedTags(prev =>
                                  prev.includes(tag)
                                    ? prev.filter(t => t !== tag)
                                    : [...prev, tag]
                                );
                              }}
                            >
                              {tag}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
            {/* Enhanced Local Alerts - More Compact on Mobile */}
            {localAlerts.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                    Local Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-2">
                  {localAlerts.map((alert) => (
                    <Alert 
                      key={alert.id}
                      className={cn(
                        "border-l-4 py-2 px-3",
                        getAlertSeverityColor(alert.severity)
                      )}
                    >
                      <AlertTitle className="text-sm font-semibold">
                        {alert.title}
                      </AlertTitle>
                      <AlertDescription className="text-xs sm:text-sm">
                        {alert.description}
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
            {/* Enhanced Posts - Better Mobile Layout */}
            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-garden-medium text-base sm:text-lg">Loading community posts...</div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-garden-medium mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-garden-dark mb-2">
                    No posts found
                  </h3>
                  <p className="text-garden-medium text-base sm:text-lg">
                    Be the first to share something with the community!
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="border-garden-light/30 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 px-3 sm:pt-6 sm:px-6">
                      {/* Post Header - More Compact on Mobile */}
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-8 w-8 sm:h-12 sm:w-12">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="text-sm sm:text-lg">{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                            <span className="font-semibold text-sm sm:text-lg">{post.author.name}</span>
                            {post.author.verified && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="inline-block">
                                      <Badge variant="secondary" className="text-xs sm:text-sm">
                                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                        {post.author.verificationLevel}
                                      </Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Verified {post.author.verificationLevel}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <Badge variant="outline" className="text-xs sm:text-sm">
                              {getPostIcon(post.type)}
                              <span className="ml-1">{getPostTypeLabel(post.type)}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-base text-garden-medium">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{post.author.location.suburb}, {post.author.location.state}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>
                            {getWeatherBadge(post)}
                          </div>
                        </div>
                      </div>

                      {/* Post Content - Better Mobile Layout */}
                      <div className="mb-3">
                        <h3 className="text-base sm:text-xl font-semibold text-garden-dark mb-2">
                          {post.title}
                        </h3>
                        <div className={cn(
                          "prose prose-garden max-w-none text-sm sm:text-base",
                          !expandedPosts.has(post.id) && "line-clamp-3"
                        )}>
                          <MarkdownRenderer content={post.content} />
                        </div>
                        {post.content.length > 300 && (
                          <Button
                            variant="link"
                            onClick={() => togglePostExpand(post.id)}
                            className="mt-1 text-xs sm:text-sm text-garden-medium p-0 h-auto"
                          >
                            {expandedPosts.has(post.id) ? "Show less" : "Read more"}
                          </Button>
                        )}
                      </div>

                      {/* Post Images - Better Mobile Grid */}
                      {post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {post.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="relative aspect-video">
                              <img
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="rounded-lg object-cover w-full h-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post Tags - More Compact on Mobile */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <div key={tag} className="inline-block">
                              <Badge 
                                variant="secondary" 
                                className="text-xs sm:text-sm px-2 py-0 sm:px-3 sm:py-1 bg-garden-light/20 hover:bg-garden-light/30"
                              >
                                #{tag}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comments Section */}
                      {showComments.has(post.id) && (
                        <div className="mt-4 pt-4 border-t border-garden-light/20">
                          <div className="space-y-4">
                            {post.comments.length > 0 ? (
                              post.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                    <AvatarImage src={comment.author.avatar} />
                                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">{comment.author.name}</span>
                                      <span className="text-xs text-garden-medium">{formatTimeAgo(comment.createdAt)}</span>
                                    </div>
                                    <div className="text-sm">{comment.content}</div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-garden-medium text-sm">No comments yet. Be the first to comment!</p>
                              </div>
                            )}
                          </div>
                          
                          {currentUser ? (
                            <div className="mt-4 flex gap-2">
                              <Input
                                placeholder="Add a comment..."
                                className="text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey && currentUser) {
                                    const input = e.target as HTMLInputElement;
                                    const content = input.value.trim();
                                    if (content) {
                                      communityService.addComment(post.id, {
                                        postId: post.id,
                                        authorId: currentUser.uid,
                                        content,
                                        verified: false,
                                        helpful: false,
                                        likedBy: [],
                                        images: []
                                      }).then((newComment) => {
                                        setPosts(prev => prev.map(p => 
                                          p.id === post.id 
                                            ? { ...p, comments: [...p.comments, newComment] }
                                            : p
                                        ));
                                        input.value = '';
                                      }).catch((error) => {
                                        console.error('Error adding comment:', error);
                                        alert('Failed to add comment. Please try again.');
                                      });
                                    }
                                  }
                                }}
                              />
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-sm"
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Add a comment..."]`) as HTMLInputElement;
                                  const content = input?.value.trim();
                                  if (content && currentUser) {
                                    communityService.addComment(post.id, {
                                      postId: post.id,
                                      authorId: currentUser.uid,
                                      content,
                                      verified: false,
                                      helpful: false,
                                      likedBy: [],
                                      images: []
                                    }).then((newComment) => {
                                      setPosts(prev => prev.map(p => 
                                        p.id === post.id 
                                          ? { ...p, comments: [...p.comments, newComment] }
                                          : p
                                      ));
                                      input.value = '';
                                    }).catch((error) => {
                                      console.error('Error adding comment:', error);
                                      alert('Failed to add comment. Please try again.');
                                    });
                                  }
                                }}
                              >
                                Post
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-4 text-center">
                              <p className="text-garden-medium text-sm">Please sign in to comment.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Post Actions - Better Mobile Layout */}
                      <div className="flex items-center gap-2 sm:gap-4 pt-3 border-t border-garden-light/20">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className={cn(
                                  "h-8 px-2 sm:h-10 sm:px-4 hover:bg-garden-light/20",
                                  currentUser && post.likedBy?.includes(currentUser.uid)
                                    ? "text-garden-dark"
                                    : "text-garden-medium hover:text-garden-dark"
                                )}
                                onClick={() => handleLikePost(post.id)}
                              >
                                <Heart 
                                  className={cn(
                                    "h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2",
                                    currentUser && post.likedBy?.includes(currentUser.uid) && "fill-current"
                                  )}
                                />
                                <span className="text-xs sm:text-base">{post.likes}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{currentUser && post.likedBy?.includes(currentUser.uid) ? 'Unlike' : 'Like'} this post</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className={cn(
                                  "h-8 px-2 sm:h-10 sm:px-4 hover:bg-garden-light/20",
                                  showComments.has(post.id)
                                    ? "text-garden-dark"
                                    : "text-garden-medium hover:text-garden-dark"
                                )}
                                onClick={() => handleToggleComments(post.id)}
                              >
                                <MessageCircle 
                                  className={cn(
                                    "h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2",
                                    showComments.has(post.id) && "fill-current"
                                  )}
                                />
                                <span className="text-xs sm:text-base">{post.comments.length}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{showComments.has(post.id) ? 'Hide' : 'View'} comments</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 px-2 sm:h-10 sm:px-4 text-garden-medium hover:text-garden-dark hover:bg-garden-light/20"
                                onClick={() => handleSharePost(post)}
                              >
                                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                <span className="text-xs sm:text-base">Share</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share this post</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {post.status === 'resolved' && (
                          <Badge className="ml-auto bg-garden-light text-garden-dark text-xs sm:text-sm">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Resolved
                          </Badge>
                        )}
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-2 sm:h-10 sm:px-4 text-garden-medium hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-base">Delete</span>
                          </Button>
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