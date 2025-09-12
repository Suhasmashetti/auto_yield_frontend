import { XCircleIcon } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onClose?: () => void;
}

export function ErrorDisplay({ error, onClose }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="relative flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-sm mb-6">
      {/* Icon */}
      <XCircleIcon className="w-5 h-5 text-red-600" />

      {/* Message */}
      <span className="flex-1 text-sm font-medium">{error}</span>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
