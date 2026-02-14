import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  message = 'Something went wrong',
  showDetails = false,
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger-red/10 mb-4">
          <AlertCircle className="w-8 h-8 text-danger-red" />
        </div>

        {/* Error Message */}
        <h3 className="text-xl font-bold font-heading text-star-white mb-2">
          {message}
        </h3>
        
        <p className="text-muted-gray mb-6">
          We encountered an unexpected error. Please try again.
        </p>

        {/* Error Details (for development) */}
        {showDetails && error && (
          <div className="mb-6 p-4 bg-bg-tertiary rounded-lg text-left overflow-x-auto">
            <p className="text-sm font-mono text-danger-red break-all">
              {error.toString()}
            </p>
          </div>
        )}

        {/* Retry Button */}
        {resetErrorBoundary && (
          <Button 
            onClick={resetErrorBoundary}
            variant="primary"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export { ErrorFallback };
