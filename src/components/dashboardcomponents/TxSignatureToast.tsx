import { useEffect } from "react";

interface TxSignatureToastProps {
  signature: string;
  onClose: () => void;
  autoDismissMs?: number;
}

export function TxSignatureToast({ signature, onClose, autoDismissMs = 8000 }: TxSignatureToastProps) {
  useEffect(() => {
    if (!autoDismissMs) return;
    const t = setTimeout(onClose, autoDismissMs);
    return () => clearTimeout(t);
  }, [autoDismissMs, onClose]);

  if (!signature) return null;

  const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full">
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg shadow-lg">
        {/* Icon */}
        <svg className="w-5 h-5 mt-0.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Transaction submitted</p>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs underline text-emerald-700 break-all"
            title={signature}
          >
            View on Solana Explorer
          </a>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="ml-2 text-emerald-600 hover:text-emerald-800 focus:outline-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
