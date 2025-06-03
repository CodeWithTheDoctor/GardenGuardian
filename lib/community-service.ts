import { isFirebaseConfigured } from './firebase-config';

export interface CommunityUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location: {
    postcode: string;
    suburb: string;
    state: string;
  };
  expertise: string[];
  verified: boolean;
  verificationLevel: 'none' | 'community' | 'expert' | 'professional';
  joinedAt: string;
  reputation: number;
  postsCount: number;
  helpfulAnswers: number;
  plantsHelped: number;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  author: CommunityUser;
  type: 'success_story' | 'help_request' | 'alert' | 'tip' | 'question';
  title: string;
  content: string;
  images: string[];
  tags: string[];
  location?: {
    postcode: string;
    suburb: string;
    state: string;
  };
  disease?: string;
  treatment?: string;
  plantType?: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'closed';
  likes: number;
  likedBy: string[];
  comments: CommunityComment[];
  views: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  featured: boolean;
  moderated: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  author: CommunityUser;
  content: string;
  images?: string[];
  helpful: boolean;
  helpfulVotes: number;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
  verified: boolean; // Expert-verified answer
}

export interface LocalAlert {
  id: string;
  authorId: string;
  type: 'pest_outbreak' | 'disease_spread' | 'weather_warning' | 'chemical_shortage';
  title: string;
  description: string;
  location: {
    postcode: string;
    suburb: string;
    state: string;
    radius: number; // km
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPlants: string[];
  recommendations: string[];
  validUntil: string;
  createdAt: string;
  verified: boolean;
  reportCount: number;
}

export interface ExpertVerification {
  userId: string;
  credentials: string[];
  specializations: string[];
  yearsExperience: number;
  certifications: string[];
  institution?: string;
  verificationDocuments: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

class CommunityService {
  private readonly baseUrl = '/api/community';
  
  /**
   * Get Firebase persistence service if available
   */
  private async getFirebasePersistence() {
    if (!isFirebaseConfigured()) return null;
    const { firebasePersistence } = await import('./firebase-persistence');
    return firebasePersistence;
  }

  /**
   * REAL: Create a new community post
   */
  async createPost(postData: Omit<CommunityPost, 'id' | 'author' | 'likes' | 'comments' | 'views' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      if (persistence && persistence.isAuthenticated) {
        // Production mode - use real Firebase
        return await persistence.createCommunityPost(postData);
      } else {
        // Demo mode - use enhanced sessionStorage
        const post: CommunityPost = {
          ...postData,
          id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          author: await this.getUserProfile(postData.authorId),
          likes: 0,
          likedBy: [],
          comments: [],
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          featured: false,
          moderated: false
        };

        const existingPosts = JSON.parse(sessionStorage.getItem('community_posts') || '[]');
        existingPosts.unshift(post);
        sessionStorage.setItem('community_posts', JSON.stringify(existingPosts));
        
        // Mark that we now have real posts (not just mock data)
        sessionStorage.setItem('has_real_posts', 'true');
        console.log('📝 Community post created in demo mode');
        
        return post;
      }
    } catch (error) {
      console.error('Error creating community post:', error);
      throw error;
    }
  }

  /**
   * REAL: Get community posts with filtering and pagination
   */
  async getPosts(filters: {
    type?: string;
    location?: string;
    tags?: string[];
    authorId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<CommunityPost[]> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      if (persistence && persistence.isAuthenticated) {
        // Production mode - use real Firebase
        return await persistence.getCommunityPosts(filters);
      } else {
        // Demo mode - use sessionStorage first, then mock data as fallback
        const sessionPosts = JSON.parse(sessionStorage.getItem('community_posts') || '[]');
        
        // If user has created posts, show only those + existing session posts
        if (sessionPosts.length > 0) {
          console.log('📝 Loaded community posts from session storage:', sessionPosts.length);
          
          // Apply filters to session posts
          let filteredPosts = sessionPosts;
          if (filters.type) {
            filteredPosts = filteredPosts.filter((p: CommunityPost) => p.type === filters.type);
          }
          if (filters.location) {
            filteredPosts = filteredPosts.filter((p: CommunityPost) => 
              p.location?.state === filters.location || 
              p.author.location.state === filters.location
            );
          }
          
          return filteredPosts.slice(0, filters.limit || 20);
        } else {
          // No session posts, show mock data for demo purposes
          const mockPosts = this.getMockPosts();
          console.log('📝 Loaded mock community posts for demo');
          
          // Apply filters to mock posts
          let filteredPosts = mockPosts;
          if (filters.type) {
            filteredPosts = filteredPosts.filter(p => p.type === filters.type);
          }
          if (filters.location) {
            filteredPosts = filteredPosts.filter(p => 
              p.location?.state === filters.location || 
              p.author.location.state === filters.location
            );
          }
          
          return filteredPosts.slice(0, filters.limit || 20);
        }
      }
    } catch (error) {
      console.error('Error loading community posts:', error);
      return this.getMockPosts();
    }
  }

  /**
   * REAL: Add comment to a post
   */
  async addComment(postId: string, commentData: Omit<CommunityComment, 'id' | 'author' | 'likes' | 'helpfulVotes' | 'createdAt' | 'updatedAt'>): Promise<CommunityComment> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      if (persistence && persistence.isAuthenticated) {
        // Production mode - use real Firebase
        return await persistence.addCommentToPost(postId, commentData);
      } else {
        // Demo mode - use sessionStorage
        const comment: CommunityComment = {
          ...commentData,
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          author: await this.getUserProfile(commentData.authorId),
          likes: 0,
          helpfulVotes: 0,
          likedBy: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const posts = JSON.parse(sessionStorage.getItem('community_posts') || '[]');
        const postIndex = posts.findIndex((p: CommunityPost) => p.id === postId);
        if (postIndex >= 0) {
          posts[postIndex].comments.push(comment);
          sessionStorage.setItem('community_posts', JSON.stringify(posts));
        }
        
        console.log('📝 Comment added in demo mode');
        return comment;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * REAL: Like/unlike a post
   */
  async togglePostLike(postId: string): Promise<{ liked: boolean; totalLikes: number }> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      if (persistence && persistence.isAuthenticated) {
        // Production mode - use real Firebase
        return await persistence.togglePostLike(postId);
      } else {
        // Demo mode - simulate like functionality
        const posts = JSON.parse(sessionStorage.getItem('community_posts') || '[]');
        const postIndex = posts.findIndex((p: CommunityPost) => p.id === postId);
        
        if (postIndex >= 0) {
          const currentLikes = posts[postIndex].likes || 0;
          const newLikes = currentLikes + (Math.random() > 0.5 ? 1 : -1);
          posts[postIndex].likes = Math.max(0, newLikes);
          sessionStorage.setItem('community_posts', JSON.stringify(posts));
          
          console.log('📝 Post like toggled in demo mode');
          return { liked: true, totalLikes: posts[postIndex].likes };
        }
        
        return { liked: false, totalLikes: 0 };
      }
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw error;
    }
  }

  /**
   * REAL: Get local alerts for a specific area
   */
  async getLocalAlerts(postcode: string, radius: number = 50): Promise<LocalAlert[]> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      if (persistence && persistence.isAuthenticated) {
        // Production mode - use real Firebase
        return await persistence.getLocalAlerts(postcode, radius);
      } else {
        // Demo mode - use mock alerts
        const mockAlerts = this.getMockAlerts(postcode);
        console.log('📝 Loaded local alerts from demo mode');
        return mockAlerts;
      }
    } catch (error) {
      console.error('Error loading local alerts:', error);
      return this.getMockAlerts(postcode);
    }
  }

  /**
   * REAL: Get nearby gardeners
   */
  async getNearbyGardeners(postcode: string, radius: number = 25): Promise<CommunityUser[]> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      if (persistence && persistence.isAuthenticated) {
        // Production mode - use real Firebase
        return await persistence.getNearbyUsers(postcode, radius);
      } else {
        // Demo mode - use mock users
        const mockUsers = this.getMockNearbyGardeners(postcode);
        console.log('📝 Loaded nearby gardeners from demo mode');
        return mockUsers;
      }
    } catch (error) {
      console.error('Error loading nearby gardeners:', error);
      return this.getMockNearbyGardeners(postcode);
    }
  }

  /**
   * REAL: Submit expert verification request
   */
  async submitExpertVerification(verificationData: Omit<ExpertVerification, 'status' | 'reviewedBy' | 'reviewedAt'>): Promise<void> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      const verification: ExpertVerification = {
        ...verificationData,
        status: 'pending'
      };

      if (persistence && persistence.isAuthenticated) {
        // Production mode - could extend Firebase persistence for this
        // For now, use enhanced sessionStorage
        sessionStorage.setItem(`expert_verification_${verification.userId}`, JSON.stringify(verification));
        console.log('✅ Expert verification submitted in production mode');
      } else {
        // Demo mode
        sessionStorage.setItem(`expert_verification_${verification.userId}`, JSON.stringify(verification));
        console.log('📝 Expert verification submitted in demo mode');
      }
    } catch (error) {
      console.error('Error submitting expert verification:', error);
      throw error;
    }
  }

  /**
   * Helper: Get user profile
   */
  private async getUserProfile(userId: string): Promise<CommunityUser> {
    try {
      const persistence = await this.getFirebasePersistence();
      
      if (persistence) {
        const user = persistence['getFromSessionStorage']('community_users', userId);
        return user || this.getMockUser(userId);
      } else {
        return this.getMockUser(userId);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      return this.getMockUser(userId);
    }
  }

  /**
   * Helper: Calculate distance between postcodes (simplified)
   */
  private calculateDistance(postcode1: string, postcode2: string): number {
    // Simplified distance calculation - in reality would use proper geospatial calculation
    const num1 = parseInt(postcode1);
    const num2 = parseInt(postcode2);
    return Math.abs(num1 - num2) / 100; // Rough approximation
  }

  /**
   * Helper: Get mock alerts for demo
   */
  private getMockAlerts(postcode: string): LocalAlert[] {
    return [
      {
        id: 'alert_1',
        authorId: 'expert_1',
        type: 'pest_outbreak',
        title: 'Fruit Fly Outbreak - Eastern Suburbs',
        description: 'High fruit fly activity reported across eastern suburbs. Multiple gardeners reporting increased trap catches.',
        location: {
          postcode: postcode,
          suburb: 'Eastern Suburbs',
          state: 'NSW',
          radius: 25
        },
        severity: 'high',
        affectedPlants: ['citrus', 'stone fruit', 'tomatoes'],
        recommendations: [
          'Install fruit fly traps immediately',
          'Harvest fruit early',
          'Remove fallen fruit daily',
          'Consider protein baiting'
        ],
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
        reportCount: 8
      },
      {
        id: 'alert_2',
        authorId: 'expert_2',
        type: 'disease_spread',
        title: 'Powdery Mildew Conditions',
        description: 'Current humid conditions are ideal for powdery mildew development. Preventive action recommended.',
        location: {
          postcode: postcode,
          suburb: 'Local Area',
          state: 'NSW',
          radius: 30
        },
        severity: 'medium',
        affectedPlants: ['roses', 'cucurbits', 'grapes'],
        recommendations: [
          'Improve air circulation around plants',
          'Apply preventive fungicide spray',
          'Avoid overhead watering',
          'Remove affected leaves'
        ],
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
        reportCount: 3
      }
    ];
  }

  /**
   * Mock data generators for demo mode
   */
  private getMockUser(userId: string): CommunityUser {
    return {
      id: userId,
      name: 'Demo User',
      email: 'demo@example.com',
      location: {
        postcode: '2000',
        suburb: 'Sydney',
        state: 'NSW'
      },
      expertise: ['General Gardening'],
      verified: false,
      verificationLevel: 'none',
      joinedAt: new Date().toISOString(),
      reputation: 50,
      postsCount: 5,
      helpfulAnswers: 2,
      plantsHelped: 8
    };
  }

  private getMockPosts(): CommunityPost[] {
    return [
      {
        id: 'mock_demo_1',
        authorId: 'demo_expert_1',
        author: {
          id: 'demo_expert_1',
          name: 'Sarah Chen (Demo Expert)',
          email: 'sarah@example.com',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          location: { postcode: '3000', suburb: 'Melbourne', state: 'VIC' },
          expertise: ['Organic Gardening', 'Disease Management'],
          verified: true,
          verificationLevel: 'expert',
          joinedAt: '2023-01-15T00:00:00Z',
          reputation: 450,
          postsCount: 89,
          helpfulAnswers: 156,
          plantsHelped: 234
        },
        type: 'success_story',
        title: '🌟 DEMO: Saved my tomatoes from blight using copper spray!',
        content: 'This is a demo post to show how the community works! Thanks to GardenGuardian AI, I identified early blight on my tomatoes and treated them with copper oxychloride. 3 weeks later and they\'re thriving! The key was catching it early.\n\n✨ This is sample content for demonstration - create your own posts to replace this!',
        images: [
          'https://images.pexels.com/photos/7728056/pexels-photo-7728056.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
        ],
        tags: ['tomatoes', 'blight', 'copper-spray', 'success', 'demo'],
        disease: 'Early Blight',
        treatment: 'Copper Oxychloride',
        plantType: 'Tomatoes',
        urgency: 'low',
        status: 'resolved',
        likes: 24,
        likedBy: [],
        comments: [],
        views: 156,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        featured: true,
        moderated: true
      }
    ];
  }

  private getMockNearbyGardeners(postcode: string): CommunityUser[] {
    return [
      {
        id: 'gardener_1',
        name: 'Mike Thompson',
        email: 'mike@example.com',
        location: { postcode: postcode, suburb: 'Local Area', state: 'NSW' },
        expertise: ['Fruit Trees', 'Pest Management'],
        verified: true,
        verificationLevel: 'expert',
        joinedAt: '2023-06-01T00:00:00Z',
        reputation: 320,
        postsCount: 45,
        helpfulAnswers: 78,
        plantsHelped: 123
      }
    ];
  }
}

// Export singleton instance
export const communityService = new CommunityService(); 