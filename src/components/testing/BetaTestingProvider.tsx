'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { getAnalytics, trackFeatureUsage, trackUserFeedback } from '../../lib/analytics';
import FeedbackWidget from '../feedback/FeedbackWidget';

// Type definitions for analytics and feedback
type FeatureMetadata = Record<string, string | number | boolean>;

interface FeedbackData {
  type: 'bug' | 'feature' | 'general' | 'rating';
  rating?: number;
  message: string;
  userAgent: string;
  url: string;
  timestamp: number;
  userId?: string;
}

interface BetaTestingContextType {
  trackFeature: (feature: string, action: string, metadata?: FeatureMetadata) => void;
  submitFeedback: (feedback: FeedbackData) => Promise<void>;
  isAnalyticsEnabled: boolean;
}

const BetaTestingContext = createContext<BetaTestingContextType | null>(null);

export const useBetaTesting = () => {
  const context = useContext(BetaTestingContext);
  if (!context) {
    throw new Error('useBetaTesting must be used within a BetaTestingProvider');
  }
  return context;
};

interface BetaTestingProviderProps {
  children: ReactNode;
  enableFeedbackWidget?: boolean;
  userId?: string;
}

export const BetaTestingProvider: React.FC<BetaTestingProviderProps> = ({
  children,
  enableFeedbackWidget = true,
  userId,
}) => {
  const isAnalyticsEnabled = typeof window !== 'undefined';

  useEffect(() => {
    if (isAnalyticsEnabled && userId) {
      // Set user ID for analytics
      getAnalytics()?.setUserId(userId);
    }
  }, [userId, isAnalyticsEnabled]);

  const trackFeature = (feature: string, action: string, metadata?: FeatureMetadata) => {
    if (isAnalyticsEnabled) {
      trackFeatureUsage(feature, action, metadata);
    }
  };

  const submitFeedback = async (feedback: FeedbackData) => {
    if (isAnalyticsEnabled) {
      trackUserFeedback(feedback as unknown as Record<string, unknown>);
    }
    
    // Also send directly to feedback API
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedback,
          userId,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  };

  const value: BetaTestingContextType = {
    trackFeature,
    submitFeedback,
    isAnalyticsEnabled,
  };

  return (
    <BetaTestingContext.Provider value={value}>
      {children}
      {enableFeedbackWidget && (
        <FeedbackWidget 
          onSubmit={submitFeedback}
          position="bottom-right"
        />
      )}
    </BetaTestingContext.Provider>
  );
};

export default BetaTestingProvider;