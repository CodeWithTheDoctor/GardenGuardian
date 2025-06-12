'use client';

import { useState, useEffect } from 'react';
import { FeedbackDrawer } from '@/components/ui/feedback-drawer';

interface ContextualFeedbackProps {
  context: string;
  diagnosisId?: string;
  trigger: 'immediate' | 'delayed' | 'exit-intent' | 'manual';
  delay?: number; // for delayed trigger
}

export function ContextualFeedback({ context, diagnosisId, trigger, delay = 3000 }: ContextualFeedbackProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (hasTriggered) return;

    const shouldShowFeedback = () => {
      // Check if user has given feedback recently (within 24 hours)
      const lastFeedback = localStorage.getItem(`feedback-${context}`);
      if (lastFeedback) {
        const lastFeedbackTime = new Date(lastFeedback);
        const now = new Date();
        const hoursSinceLastFeedback = (now.getTime() - lastFeedbackTime.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastFeedback < 24) return false;
      }
      return true;
    };

    if (!shouldShowFeedback()) return;

    switch (trigger) {
      case 'immediate':
        setShowFeedback(true);
        setHasTriggered(true);
        break;
        
      case 'delayed':
        const timer = setTimeout(() => {
          setShowFeedback(true);
          setHasTriggered(true);
        }, delay);
        return () => clearTimeout(timer);
        
      case 'exit-intent':
        const handleMouseLeave = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            setShowFeedback(true);
            setHasTriggered(true);
          }
        };
        
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            setShowFeedback(true);
            setHasTriggered(true);
          }
        };
        
        // For desktop
        document.addEventListener('mouseleave', handleMouseLeave);
        // For mobile (when user switches tabs/apps)
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
          document.removeEventListener('mouseleave', handleMouseLeave);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }
  }, [context, trigger, delay, hasTriggered]);

  // Listen for custom feedback trigger events
  useEffect(() => {
    const handleCustomTrigger = (event: CustomEvent) => {
      if (event.detail.context === context && !hasTriggered) {
        setShowFeedback(true);
        setHasTriggered(true);
      }
    };

    window.addEventListener('trigger-feedback', handleCustomTrigger as EventListener);
    return () => {
      window.removeEventListener('trigger-feedback', handleCustomTrigger as EventListener);
    };
  }, [context, hasTriggered]);

  const handleClose = () => {
    setShowFeedback(false);
    // Remember that user was shown feedback for this context
    localStorage.setItem(`feedback-${context}`, new Date().toISOString());
  };

  return (
    <FeedbackDrawer
      isOpen={showFeedback}
      onClose={handleClose}
      context={context}
      diagnosisId={diagnosisId}
    />
  );
} 