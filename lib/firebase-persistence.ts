// Firebase Persistence Service
// Handles real data storage and retrieval from Firestore

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  User,
  onAuthStateChanged 
} from 'firebase/auth';
import { db, storage, auth } from './firebase-config';
import { PlantDiagnosis, Treatment } from './types';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  location?: {
    postcode: string;
    state: string;
    city: string;
  };
  preferences: {
    treatmentType: 'organic' | 'chemical' | 'both';
    notifications: boolean;
    weatherAlerts: boolean;
  };
  statistics: {
    totalDiagnoses: number;
    successfulTreatments: number;
    postsCount: number;
    helpfulAnswers: number;
    plantsHelped: number;
    reputation: number;
    memberSince: string;
  };
  // Community features
  expertise: string[];
  verified: boolean;
  verificationLevel: 'none' | 'community' | 'expert' | 'professional';
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisAnalytics {
  id: string;
  userId: string;
  diagnosisId: string;
  disease: string;
  confidence: number;
  treatmentApplied?: string;
  treatmentSuccess?: boolean;
  followUpDate?: string;
  location?: string;
  timestamp: string;
}

// Community interfaces
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
  verified: boolean;
}

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
    radius: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPlants: string[];
  recommendations: string[];
  validUntil: string;
  createdAt: string;
  verified: boolean;
  reportCount: number;
}

class FirebasePersistenceService {
  private currentUser: User | null = null;
  private userProfile: UserProfile | null = null;

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        this.loadUserProfile(user.uid);
      } else {
        this.userProfile = null;
      }
    });
  }

  // User Profile Management
  async createUserProfile(user: User): Promise<UserProfile> {
    const profile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || undefined,
      preferences: {
        treatmentType: 'both',
        notifications: true,
        weatherAlerts: true
      },
      statistics: {
        totalDiagnoses: 0,
        successfulTreatments: 0,
        postsCount: 0,
        helpfulAnswers: 0,
        plantsHelped: 0,
        reputation: 0,
        memberSince: new Date().toISOString()
      },
      expertise: [],
      verified: false,
      verificationLevel: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    this.userProfile = profile;
    return profile;
  }

  async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.userProfile = {
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        } as UserProfile;
        return this.userProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.currentUser) throw new Error('User not authenticated');

    const docRef = doc(db, 'users', this.currentUser.uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    if (this.userProfile) {
      this.userProfile = { ...this.userProfile, ...updates };
    }
  }

  // Image Storage
  async uploadDiagnosisImage(file: File, diagnosisId: string): Promise<string> {
    if (!this.currentUser) throw new Error('User not authenticated');

    const imageRef = ref(storage, `diagnosis-images/${this.currentUser.uid}/${diagnosisId}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  async deleteDiagnosisImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw - image might already be deleted
    }
  }

  // Diagnosis Management
  async saveDiagnosis(diagnosis: PlantDiagnosis): Promise<void> {
    if (!this.currentUser) {
      // Fallback to sessionStorage for demo mode
      this.saveToSessionStorage('diagnoses', diagnosis);
      return;
    }

    const docRef = doc(db, 'diagnoses', diagnosis.id);
    await setDoc(docRef, {
      ...diagnosis,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update user statistics
    await this.incrementUserStat('totalDiagnoses');

    // Record analytics
    await this.recordDiagnosisAnalytics(diagnosis);
  }

  async getDiagnosis(diagnosisId: string): Promise<PlantDiagnosis | null> {
    if (!this.currentUser) {
      // Fallback to sessionStorage for demo mode
      return this.getFromSessionStorage('diagnoses', diagnosisId);
    }

    try {
      const docRef = doc(db, 'diagnoses', diagnosisId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        } as PlantDiagnosis;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      return null;
    }
  }

  async getUserDiagnoses(userId?: string, limitCount: number = 50): Promise<PlantDiagnosis[]> {
    const targetUserId = userId || this.currentUser?.uid;
    
    if (!targetUserId) {
      // Fallback to sessionStorage for demo mode
      return this.getAllFromSessionStorage('diagnoses');
    }

    try {
      const q = query(
        collection(db, 'diagnoses'),
        where('userId', '==', targetUserId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        } as PlantDiagnosis;
      });
    } catch (error) {
      console.error('Error getting user diagnoses:', error);
      return [];
    }
  }

  async updateDiagnosis(diagnosisId: string, updates: Partial<PlantDiagnosis>): Promise<void> {
    if (!this.currentUser) {
      // Fallback to sessionStorage for demo mode
      this.updateInSessionStorage('diagnoses', diagnosisId, updates);
      return;
    }

    const docRef = doc(db, 'diagnoses', diagnosisId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    // If treatment was marked successful, update statistics
    if (updates.treated === true) {
      await this.incrementUserStat('successfulTreatments');
    }
  }

  async deleteDiagnosis(diagnosisId: string): Promise<void> {
    if (!this.currentUser) {
      // Fallback to sessionStorage for demo mode
      this.removeFromSessionStorage('diagnoses', diagnosisId);
      return;
    }

    // Get diagnosis to delete associated image
    const diagnosis = await this.getDiagnosis(diagnosisId);
    if (diagnosis?.imageUrl) {
      await this.deleteDiagnosisImage(diagnosis.imageUrl);
    }

    await deleteDoc(doc(db, 'diagnoses', diagnosisId));
  }

  // Analytics
  async recordDiagnosisAnalytics(diagnosis: PlantDiagnosis): Promise<void> {
    if (!this.currentUser) return;

    const analytics: Partial<DiagnosisAnalytics> = {
      id: `analytics_${diagnosis.id}`,
      userId: diagnosis.userId,
      diagnosisId: diagnosis.id,
      disease: diagnosis.diagnosis.disease,
      confidence: diagnosis.diagnosis.confidence,
      timestamp: new Date().toISOString()
    };

    // Only include location if it exists (Firebase doesn't allow undefined values)
    const userLocation = this.userProfile?.location?.postcode;
    if (userLocation) {
      analytics.location = userLocation;
    }

    await setDoc(doc(db, 'analytics', analytics.id!), {
      ...analytics,
      timestamp: serverTimestamp()
    });
  }

  async getDashboardAnalytics(userId?: string): Promise<{
    totalDiagnoses: number;
    successfulTreatments: number;
    commonDiseases: Array<{ disease: string; count: number }>;
    monthlyActivity: Array<{ month: string; count: number }>;
  }> {
    const targetUserId = userId || this.currentUser?.uid;
    
    if (!targetUserId) {
      return {
        totalDiagnoses: 0,
        successfulTreatments: 0,
        commonDiseases: [],
        monthlyActivity: []
      };
    }

    try {
      // Get user diagnoses for analytics
      const diagnoses = await this.getUserDiagnoses(targetUserId, 100);
      
      const totalDiagnoses = diagnoses.length;
      const successfulTreatments = diagnoses.filter(d => d.treated).length;
      
      // Calculate common diseases
      const diseaseCount = diagnoses.reduce((acc, diagnosis) => {
        const disease = diagnosis.diagnosis.disease;
        acc[disease] = (acc[disease] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commonDiseases = Object.entries(diseaseCount)
        .map(([disease, count]) => ({ disease, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate monthly activity
      const monthlyActivity = diagnoses.reduce((acc, diagnosis) => {
        const month = new Date(diagnosis.createdAt).toLocaleDateString('en-AU', { 
          year: 'numeric', 
          month: 'short' 
        });
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ month, count: 1 });
        }
        return acc;
      }, [] as Array<{ month: string; count: number }>);

      return {
        totalDiagnoses,
        successfulTreatments,
        commonDiseases,
        monthlyActivity: monthlyActivity.slice(0, 6).reverse()
      };
    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      return {
        totalDiagnoses: 0,
        successfulTreatments: 0,
        commonDiseases: [],
        monthlyActivity: []
      };
    }
  }

  // Utility methods
  private async incrementUserStat(statName: keyof UserProfile['statistics']): Promise<void> {
    if (!this.currentUser) return;

    const docRef = doc(db, 'users', this.currentUser.uid);
    const currentValue = this.userProfile?.statistics[statName];
    
    if (typeof currentValue === 'number') {
      await updateDoc(docRef, {
        [`statistics.${statName}`]: currentValue + 1,
        updatedAt: serverTimestamp()
      });

      if (this.userProfile) {
        (this.userProfile.statistics[statName] as number) = currentValue + 1;
      }
    }
  }

  // SessionStorage fallback methods for demo mode
  private saveToSessionStorage(collection: string, data: any): void {
    const key = `gardenguardian_${collection}`;
    const existing = JSON.parse(sessionStorage.getItem(key) || '[]');
    existing.push(data);
    sessionStorage.setItem(key, JSON.stringify(existing));
  }

  private getFromSessionStorage(collection: string, id: string): any {
    const key = `gardenguardian_${collection}`;
    const items = JSON.parse(sessionStorage.getItem(key) || '[]');
    return items.find((item: any) => item.id === id) || null;
  }

  private getAllFromSessionStorage(collection: string): any[] {
    const key = `gardenguardian_${collection}`;
    return JSON.parse(sessionStorage.getItem(key) || '[]');
  }

  private updateInSessionStorage(collection: string, id: string, updates: any): void {
    const key = `gardenguardian_${collection}`;
    const items = JSON.parse(sessionStorage.getItem(key) || '[]');
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      sessionStorage.setItem(key, JSON.stringify(items));
    }
  }

  private removeFromSessionStorage(collection: string, id: string): void {
    const key = `gardenguardian_${collection}`;
    const items = JSON.parse(sessionStorage.getItem(key) || '[]');
    const filtered = items.filter((item: any) => item.id !== id);
    sessionStorage.setItem(key, JSON.stringify(filtered));
  }

  // Getters
  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  get currentUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  get user(): User | null {
    return this.currentUser;
  }

  // ========================================
  // COMMUNITY PERSISTENCE METHODS
  // ========================================

  /**
   * Create a new community post in Firestore
   */
  async createCommunityPost(postData: Omit<CommunityPost, 'id' | 'author' | 'likes' | 'likedBy' | 'comments' | 'views' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to create posts');
    }

    try {
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Try to load user profile, if not available, create one or use fallback
      let userProfile = await this.loadUserProfile(postData.authorId);
      
      // If profile doesn't exist, try to create one for the current user
      if (!userProfile && this.currentUser.uid === postData.authorId) {
        console.log('🔧 Creating user profile for current user...');
        userProfile = await this.createUserProfile(this.currentUser);
      }
      
      // Create author profile for the post
      let authorProfile: CommunityUser;
      if (userProfile) {
        authorProfile = this.convertUserProfileToCommunityUser(userProfile);
      } else {
        // Fallback user profile when profile can't be loaded
        authorProfile = {
          id: postData.authorId,
          name: this.currentUser.displayName || this.currentUser.email?.split('@')[0] || 'Garden User',
          email: this.currentUser.email || '',
          location: {
            postcode: '0000',
            suburb: 'Unknown',
            state: 'Unknown'
          },
          expertise: [],
          verified: false,
          verificationLevel: 'none',
          joinedAt: new Date().toISOString(),
          reputation: 0,
          postsCount: 0,
          helpfulAnswers: 0,
          plantsHelped: 0
        };
      }
      
      const post: CommunityPost = {
        ...postData,
        id: postId,
        author: authorProfile,
        likes: 0,
        likedBy: [],
        comments: [],
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(doc(db, 'community_posts', postId), {
        ...post,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update user post count
      await this.incrementCommunityStat('postsCount');

      console.log('✅ Community post created in Firestore:', postId);
      return post;
    } catch (error) {
      console.error('Error creating community post:', error);
      throw error;
    }
  }

  /**
   * Get community posts with filtering and pagination
   */
  async getCommunityPosts(filters: {
    type?: string;
    location?: string;
    tags?: string[];
    authorId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<CommunityPost[]> {
    try {
      let q = query(
        collection(db, 'community_posts'),
        orderBy('createdAt', 'desc'),
        limit(filters.limit || 20)
      );

      // Apply filters
      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters.authorId) {
        q = query(q, where('authorId', '==', filters.authorId));
      }
      if (filters.location) {
        q = query(q, where('author.location.state', '==', filters.location));
      }

      const querySnapshot = await getDocs(q);
      const posts: CommunityPost[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        } as CommunityPost);
      });

      console.log('✅ Loaded community posts from Firestore:', posts.length);
      return posts;
    } catch (error) {
      console.error('❌ Error loading community posts from Firestore:', error);
      
      // If not authenticated, try to return empty array instead of sessionStorage
      if (!this.currentUser) {
        console.log('⚠️ No authentication, returning empty array');
        return [];
      }
      
      // Fallback to sessionStorage only if authenticated
      return this.getAllFromSessionStorage('community_posts');
    }
  }

  /**
   * Add comment to a post
   */
  async addCommentToPost(postId: string, commentData: Omit<CommunityComment, 'id' | 'author' | 'likes' | 'likedBy' | 'helpfulVotes' | 'createdAt' | 'updatedAt'>): Promise<CommunityComment> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to comment');
    }

    try {
      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Try to load user profile, if not available, create one or use fallback
      let userProfile = await this.loadUserProfile(commentData.authorId);
      
      // If profile doesn't exist, try to create one for the current user
      if (!userProfile && this.currentUser.uid === commentData.authorId) {
        console.log('🔧 Creating user profile for current user...');
        userProfile = await this.createUserProfile(this.currentUser);
      }
      
      // Create author profile for the comment
      let authorProfile: CommunityUser;
      if (userProfile) {
        authorProfile = this.convertUserProfileToCommunityUser(userProfile);
      } else {
        // Fallback user profile when profile can't be loaded
        authorProfile = {
          id: commentData.authorId,
          name: this.currentUser.displayName || this.currentUser.email?.split('@')[0] || 'Garden User',
          email: this.currentUser.email || '',
          location: {
            postcode: '0000',
            suburb: 'Unknown',
            state: 'Unknown'
          },
          expertise: [],
          verified: false,
          verificationLevel: 'none',
          joinedAt: new Date().toISOString(),
          reputation: 0,
          postsCount: 0,
          helpfulAnswers: 0,
          plantsHelped: 0
        };
      }
      
      const comment: CommunityComment = {
        ...commentData,
        id: commentId,
        author: authorProfile,
        likes: 0,
        likedBy: [],
        helpfulVotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save comment to Firestore
      await setDoc(doc(db, 'community_comments', commentId), {
        ...comment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update post comment count
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const updatedComments = [...(postData.comments || []), comment];
        
        await updateDoc(postRef, {
          comments: updatedComments,
          updatedAt: serverTimestamp()
        });
      }

      console.log('✅ Comment added to Firestore:', commentId);
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Like/unlike a post
   */
  async togglePostLike(postId: string): Promise<{ liked: boolean; totalLikes: number }> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to like posts');
    }

    try {
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const postData = postDoc.data();
      const likedBy = postData.likedBy || [];
      const userId = this.currentUser.uid;
      
      let newLikedBy: string[];
      let liked: boolean;

      if (likedBy.includes(userId)) {
        // Unlike
        newLikedBy = likedBy.filter((id: string) => id !== userId);
        liked = false;
      } else {
        // Like
        newLikedBy = [...likedBy, userId];
        liked = true;
      }

      await updateDoc(postRef, {
        likes: newLikedBy.length,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp()
      });

      console.log(`✅ Post ${liked ? 'liked' : 'unliked'}:`, postId);
      return { liked, totalLikes: newLikedBy.length };
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw error;
    }
  }

  /**
   * Create a local alert
   */
  async createLocalAlert(alertData: Omit<LocalAlert, 'id' | 'createdAt' | 'reportCount'>): Promise<LocalAlert> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to create alerts');
    }

    try {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const alert: LocalAlert = {
        ...alertData,
        id: alertId,
        createdAt: new Date().toISOString(),
        reportCount: 1
      };

      await setDoc(doc(db, 'local_alerts', alertId), {
        ...alert,
        createdAt: serverTimestamp()
      });

      console.log('✅ Local alert created in Firestore:', alertId);
      return alert;
    } catch (error) {
      console.error('Error creating local alert:', error);
      throw error;
    }
  }

  /**
   * Get local alerts for a specific area
   */
  async getLocalAlerts(postcode: string, radius: number = 50): Promise<LocalAlert[]> {
    if (!this.currentUser) {
      // Fallback to sessionStorage for demo mode
      return this.getAllFromSessionStorage('local_alerts');
    }

    try {
      const q = query(
        collection(db, 'local_alerts'),
        where('location.postcode', '==', postcode),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const alerts: LocalAlert[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        alerts.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        } as LocalAlert);
      });

      console.log('✅ Loaded local alerts from Firestore:', alerts.length);
      return alerts;
    } catch (error) {
      console.error('Error loading local alerts:', error);
      return this.getAllFromSessionStorage('local_alerts');
    }
  }

  /**
   * Get nearby community users
   */
  async getNearbyUsers(postcode: string, radius: number = 25): Promise<CommunityUser[]> {
    if (!this.currentUser) {
      return [];
    }

    try {
      const q = query(
        collection(db, 'users'),
        where('location.postcode', '==', postcode),
        orderBy('statistics.helpfulAnswers', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const users: CommunityUser[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const userProfile = {
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName,
          location: data.location,
          preferences: data.preferences || {
            treatmentType: 'both' as const,
            notifications: true,
            weatherAlerts: true
          },
          statistics: data.statistics || {
            totalDiagnoses: 0,
            successfulTreatments: 0,
            postsCount: 0,
            helpfulAnswers: 0,
            plantsHelped: 0,
            reputation: 0,
            memberSince: new Date().toISOString()
          },
          expertise: data.expertise || [],
          verified: data.verified || false,
          verificationLevel: data.verificationLevel || 'none',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        } as UserProfile;
        
        users.push(this.convertUserProfileToCommunityUser(userProfile));
      });

      console.log('✅ Loaded nearby users from Firestore:', users.length);
      return users;
    } catch (error) {
      console.error('Error loading nearby users:', error);
      return [];
    }
  }

  /**
   * Increment user community statistics
   */
  async incrementCommunityStat(statName: 'postsCount' | 'helpfulAnswers' | 'plantsHelped' | 'reputation'): Promise<void> {
    if (!this.currentUser) return;

    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentValue = userData.statistics?.[statName] || 0;
        
        await updateDoc(userRef, {
          [`statistics.${statName}`]: currentValue + 1,
          updatedAt: serverTimestamp()
        });

        console.log(`✅ Incremented ${statName} for user:`, this.currentUser.uid);
      }
    } catch (error) {
      console.error(`Error incrementing ${statName}:`, error);
    }
  }

  // ========================================
  // ENHANCED ERROR HANDLING & RETRY LOGIC
  // ========================================

  /**
   * Retry mechanism for failed operations
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Enhanced error handling with user-friendly messages
   */
  private handleError(error: any, operation: string): never {
    console.error(`Error in ${operation}:`, error);
    
    // Firebase specific errors
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          throw new Error('You don\'t have permission to perform this action. Please check your login status.');
        case 'unavailable':
          throw new Error('Service temporarily unavailable. Please try again in a moment.');
        case 'quota-exceeded':
          throw new Error('Storage quota exceeded. Please contact support.');
        case 'network-request-failed':
          throw new Error('Network error. Please check your internet connection.');
        default:
          throw new Error(`Operation failed: ${error.message}`);
      }
    }
    
    throw new Error(`Failed to ${operation}. Please try again.`);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Convert UserProfile to CommunityUser
   */
  private convertUserProfileToCommunityUser(profile: UserProfile): CommunityUser {
    return {
      id: profile.id,
      name: profile.displayName || 'Garden User',
      email: profile.email,
      avatar: undefined, // Add avatar field to UserProfile if needed
      location: {
        postcode: profile.location?.postcode || '0000',
        suburb: profile.location?.city || 'Unknown', // Map city to suburb
        state: profile.location?.state || 'Unknown'
      },
      expertise: profile.expertise || [],
      verified: profile.verified || false,
      verificationLevel: profile.verificationLevel || 'none',
      joinedAt: profile.createdAt,
      reputation: profile.statistics.reputation || 0,
      postsCount: profile.statistics.postsCount || 0,
      helpfulAnswers: profile.statistics.helpfulAnswers || 0,
      plantsHelped: profile.statistics.plantsHelped || 0
    };
  }

  /**
   * Create CommunityUser from current user profile
   */
  private createCommunityUserFromProfile(): CommunityUser {
    if (!this.userProfile) {
      throw new Error('User profile not loaded');
    }
    return this.convertUserProfileToCommunityUser(this.userProfile);
  }
}

// Export singleton instance
export const firebasePersistence = new FirebasePersistenceService(); 