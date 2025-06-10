import { AlertTriangle, Settings, ExternalLink, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceError, isConfigurationError } from '@/lib/error-handling';

interface ServiceErrorProps {
  error: ServiceError | Error;
  variant?: 'alert' | 'card' | 'inline';
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ServiceErrorDisplay({ 
  error, 
  variant = 'alert', 
  showRetry = false, 
  onRetry,
  className = '' 
}: ServiceErrorProps) {
  // Extract error info
  let serviceError: ServiceError;
  
  if (isConfigurationError(error)) {
    serviceError = error.serviceError;
  } else {
    serviceError = {
      code: 'UNKNOWN_ERROR',
      title: 'Service Error',
      message: error.message || 'An unexpected error occurred.',
      action: 'Please try again or contact support if the problem persists.'
    };
  }

  const isConfigError = serviceError.configRequired && serviceError.configRequired.length > 0;

  if (variant === 'card') {
    return (
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            {serviceError.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-orange-700">{serviceError.message}</p>
          
          {serviceError.action && (
            <p className="text-sm text-orange-600 font-medium">
              {serviceError.action}
            </p>
          )}

          {isConfigError && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-800">Required Environment Variables:</p>
              <div className="flex flex-wrap gap-1">
                {serviceError.configRequired!.map((env) => (
                  <Badge key={env} variant="outline" className="text-xs border-orange-300 text-orange-800">
                    {env}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {showRetry && onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm"
                className="border-orange-300 text-orange-800 hover:bg-orange-100"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
            
            {isConfigError && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-300 text-orange-800 hover:bg-orange-100"
                onClick={() => window.open('/config', '_blank')}
              >
                <Settings className="h-4 w-4 mr-1" />
                Configuration
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`p-3 bg-orange-50 border border-orange-200 rounded-md ${className}`}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-orange-800">{serviceError.title}</p>
            <p className="text-sm text-orange-700">{serviceError.message}</p>
            
            {serviceError.action && (
              <p className="text-xs text-orange-600">{serviceError.action}</p>
            )}

            {showRetry && onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm"
                className="mt-2 h-7 px-2 text-xs border-orange-300 text-orange-800 hover:bg-orange-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: alert variant
  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">{serviceError.title}</AlertTitle>
      <AlertDescription className="text-orange-700 space-y-2">
        <p>{serviceError.message}</p>
        
        {serviceError.action && (
          <p className="font-medium">{serviceError.action}</p>
        )}

        {isConfigError && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Required Environment Variables:</p>
            <div className="flex flex-wrap gap-1">
              {serviceError.configRequired!.map((env) => (
                <Badge key={env} variant="outline" className="text-xs border-orange-300 text-orange-800">
                  {env}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="h-7 px-2 text-xs border-orange-300 text-orange-800 hover:bg-orange-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          
          {isConfigError && (
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 px-2 text-xs border-orange-300 text-orange-800 hover:bg-orange-100"
              onClick={() => window.open('/config', '_blank')}
            >
              <Settings className="h-3 w-3 mr-1" />
              View Config
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Convenience components for specific error types
export function FirebaseConfigError({ className = '', onRetry }: { className?: string; onRetry?: () => void }) {
  return (
    <ServiceErrorDisplay
      error={new Error('Firebase services are not configured. Please add Firebase environment variables.')}
      variant="card"
      showRetry={!!onRetry}
      onRetry={onRetry}
      className={className}
    />
  );
}

export function AIVisionConfigError({ className = '', onRetry }: { className?: string; onRetry?: () => void }) {
  return (
    <ServiceErrorDisplay
      error={new Error('Google Vision API is not configured. Please add NEXT_PUBLIC_GOOGLE_VISION_API_KEY.')}
      variant="card"
      showRetry={!!onRetry}
      onRetry={onRetry}
      className={className}
    />
  );
}

export function WeatherConfigError({ className = '', onRetry }: { className?: string; onRetry?: () => void }) {
  return (
    <ServiceErrorDisplay
      error={new Error('Weather API is not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY.')}
      variant="card"
      showRetry={!!onRetry}
      onRetry={onRetry}
      className={className}
    />
  );
} 