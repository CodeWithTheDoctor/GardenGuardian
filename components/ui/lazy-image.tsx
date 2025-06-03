'use client';

import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  placeholder,
  onLoad,
  onError 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Set up intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const containerStyle = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-garden-light/20 rounded-lg ${className}`}
        style={containerStyle}
      >
        <div className="text-center p-4">
          <AlertCircle className="h-8 w-8 text-garden-medium mx-auto mb-2" />
          <p className="text-sm text-garden-medium">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={containerStyle}>
      {/* Placeholder skeleton */}
      {!isLoaded && (
        <Skeleton 
          className="absolute inset-0 w-full h-full rounded-lg"
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-300 
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      
      {/* Custom placeholder */}
      {placeholder && !isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-garden-cream">
          <span className="text-garden-medium text-sm">{placeholder}</span>
        </div>
      )}
    </div>
  );
} 