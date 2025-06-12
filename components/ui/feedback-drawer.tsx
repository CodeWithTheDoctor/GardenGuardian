'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { useFeedback, FeedbackData } from '@/hooks/use-feedback';
import { X } from 'lucide-react';

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  diagnosisId?: string;
  initialRating?: 1 | 2 | 3 | 4 | 5;
}

const EMOJI_RATINGS = [
  { value: 1, emoji: '😡', label: 'Very Poor' },
  { value: 2, emoji: '😞', label: 'Poor' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😍', label: 'Excellent' }
] as const;

export function FeedbackDrawer({ isOpen, onClose, context, diagnosisId, initialRating }: FeedbackDrawerProps) {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(initialRating || 3);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  
  const { submitFeedback, isSubmitting } = useFeedback();

  const handleQuickFeedback = async (selectedRating: 1 | 2 | 3 | 4 | 5) => {
    const success = await submitFeedback({
      rating: selectedRating,
      context,
      page: window.location.pathname,
      diagnosisId
    });

    if (success) {
      if (selectedRating <= 3) {
        setRating(selectedRating);
        setShowDetailedForm(true);
      } else {
        onClose();
      }
    }
  };

  const handleDetailedFeedback = async () => {
    const success = await submitFeedback({
      rating,
      context,
      page: window.location.pathname,
      diagnosisId,
      message: message.trim() || undefined,
      email: email.trim() || undefined
    });

    if (success) {
      onClose();
      setShowDetailedForm(false);
      setMessage('');
      setEmail('');
    }
  };

  const resetForm = () => {
    setShowDetailedForm(false);
    setMessage('');
    setEmail('');
    setRating(3);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-lg">How was your experience?</DrawerTitle>
              <DrawerDescription className="text-sm text-garden-medium">
                Your feedback helps us improve GardenGuardian AI
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4">
          {!showDetailedForm ? (
            <>
              <p className="text-sm text-garden-medium mb-4">Tap an emoji to rate your experience:</p>
              <div className="flex justify-between gap-1 mb-6 px-2">
                {EMOJI_RATINGS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleQuickFeedback(item.value)}
                    disabled={isSubmitting}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-garden-cream transition-all duration-200 disabled:opacity-50 touch-manipulation min-w-0 flex-1"
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
                    <span className="text-[10px] sm:text-xs text-garden-medium text-center leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-garden-medium">
                  You rated: <span className="text-2xl ml-1">{EMOJI_RATINGS.find(r => r.value === rating)?.emoji}</span>
                </p>
              </div>
              
              <div>
                <Label htmlFor="feedback-message" className="text-sm font-medium">
                  What could we improve? (Optional)
                </Label>
                <Textarea
                  id="feedback-message"
                  placeholder="Tell us more about your experience..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="feedback-email" className="text-sm font-medium">
                  Email for follow-up (Optional)
                </Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <DrawerFooter className="px-0 pt-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDetailedFeedback}
                    disabled={isSubmitting}
                    className="flex-1 bg-garden-dark hover:bg-garden-medium"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Skip
                  </Button>
                </div>
              </DrawerFooter>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
} 