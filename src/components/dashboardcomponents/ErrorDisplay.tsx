import { XCircleIcon } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onClose?: () => void;
}

export function ErrorDisplay({ error, onClose }: ErrorDisplayProps) {
  if (!error || error.trim() === '') return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="relative flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm border border-red-500 text-white px-4 py-3 rounded-xl shadow-2xl mb-4 animate-pulse">
          {/* Icon */}
          <XCircleIcon className="w-5 h-5 text-white flex-shrink-0" />

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-medium">{error}</p>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-white hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full p-1 transition-all duration-200"
              title="Close error"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}