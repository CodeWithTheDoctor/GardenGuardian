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
    memberSince: string;
  };
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
        memberSince: new Date().toISOString()
      },
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

    const analytics: DiagnosisAnalytics = {
      id: `analytics_${diagnosis.id}`,
      userId: diagnosis.userId,
      diagnosisId: diagnosis.id,
      disease: diagnosis.diagnosis.disease,
      confidence: diagnosis.diagnosis.confidence,
      location: this.userProfile?.location?.postcode,
      timestamp: new Date().toISOString()
    };

    await setDoc(doc(db, 'analytics', analytics.id), {
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
}

// Export singleton instance
export const firebasePersistence = new FirebasePersistenceService(); 