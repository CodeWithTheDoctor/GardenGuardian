'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/lib/firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export interface FeedbackData {
  rating: 1 | 2 | 3 | 4 | 5; // Maps to emojis
  context: string; // e.g., 'diagnosis-complete', 'treatment-view', 'share-action'
  page: string;
  diagnosisId?: string;
  message?: string;
  email?: string;
  userAgent: string;
  timestamp: Date;
}

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitFeedback = async (feedbackData: Omit<FeedbackData, 'userAgent' | 'timestamp'>) => {
    setIsSubmitting(true);
    
    try {
      const feedback: FeedbackData = {
        ...feedbackData,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
      };

      // Save to Firebase if configured, otherwise localStorage for demo
      if (db) {
        // Filter out undefined values for Firestore
        const firestoreData: any = {
          rating: feedback.rating,
          context: feedback.context,
          page: feedback.page,
          userAgent: feedback.userAgent,
          timestamp: feedback.timestamp,
          userId: auth.currentUser?.uid || 'anonymous',
          userEmail: auth.currentUser?.email || null,
          createdAt: serverTimestamp()
        };

        // Only add optional fields if they have values
        if (feedback.diagnosisId) {
          firestoreData.diagnosisId = feedback.diagnosisId;
        }
        if (feedback.message) {
          firestoreData.message = feedback.message;
        }
        if (feedback.email) {
          firestoreData.email = feedback.email;
        }

        await addDoc(collection(db, 'feedback'), firestoreData);
      } else {
        // Demo mode - store in localStorage
        const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        existingFeedback.push({ ...feedback, id: Date.now().toString() });
        localStorage.setItem('feedback', JSON.stringify(existingFeedback));
      }

      // Send email notification via Web3Forms for important feedback
      if (feedback.rating <= 3 || feedback.message) {
        await sendEmailNotification(feedback);
      }

      toast({
        title: "Thanks for your feedback!",
        description: "Your input helps us improve GardenGuardian AI.",
      });

      return true;
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Feedback not sent",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendEmailNotification = async (feedback: FeedbackData) => {
    try {
      const ratingLabels = {
        1: 'Very Poor 😡',
        2: 'Poor 😞', 
        3: 'Okay 😐',
        4: 'Good 😊',
        5: 'Excellent 😍'
      };

      const emailData = {
        access_key: '14411d20-f565-4bd5-b660-a9b075cd816e',
        subject: `GardenGuardian AI Feedback - ${ratingLabels[feedback.rating]}`,
        from_name: 'GardenGuardian AI Feedback',
        message: `
New Feedback Received:

Rating: ${ratingLabels[feedback.rating]}
Context: ${feedback.context}
Page: ${feedback.page}
${feedback.diagnosisId ? `Diagnosis ID: ${feedback.diagnosisId}` : ''}

${feedback.message ? `Message: ${feedback.message}` : ''}
${feedback.email ? `User Email: ${feedback.email}` : ''}

Timestamp: ${feedback.timestamp.toISOString()}
User Agent: ${feedback.userAgent}
        `.trim()
      };

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
    } catch (error) {
      console.error('Email notification failed:', error);
      // Don't throw error - feedback is still saved even if email fails
    }
  };

  return { submitFeedback, isSubmitting };
}; 