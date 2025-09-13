import { useState, memo, useCallback } from "react";
import { validateAmount } from "../utils/vault";

interface ActionPanelProps {
  loading: boolean;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  lastTransactionSignature?: string | null;
  onClearSignature?: () => void;
}

export const ActionPanel = memo(function ActionPanel({ 
  loading, 
  onDeposit, 
  onWithdraw, 
  lastTransactionSignature,
  onClearSignature 
}: ActionPanelProps) {
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState("");

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value);
    setLocalError("");
  }, []);

  const handleDeposit = useCallback(() => {
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setLocalError(validation.error!);
      return;
    }

    onDeposit(amount);
    setAmount("");
  }, [amount, onDeposit]);

  const handleWithdraw = useCallback(() => {
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setLocalError(validation.error!);
      return;
    }

    onWithdraw(amount);
    setAmount("");
  }, [amount, onWithdraw]);

  const isAmountValid = amount && parseFloat(amount) > 0;

  return (
    <div className="md:col-span-2 bg-gray-900 border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center uppercase tracking-wider">
        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
        Actions
      </h2>

      <div className="space-y-4">
        {/* Input */}
        <div className="">
          <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
            Amount (USDC / yUSDC)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.000001"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full bg-black border border-gray-700 px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all duration-300 hover:border-gray-600"
            />
            {isAmountValid && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
          {localError && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{localError}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDeposit}
            disabled={loading || !isAmountValid}
            className="group flex-1 bg-white text-black px-6 py-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 relative overflow-hidden border-2 border-white"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                STAKING...
              </span>
            ) : (
              <span className="flex items-center justify-center relative z-10 uppercase tracking-wider">
                STAKE USDC
              </span>
            )}
          </button>
          <button
            onClick={handleWithdraw}
            disabled={loading || !isAmountValid}
            className="group flex-1 bg-black text-white border-2 border-white px-6 py-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black relative overflow-hidden"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                UNSTAKING...
              </span>
            ) : (
              <span className="flex items-center justify-center relative z-10 uppercase tracking-wider">
                UNSTAKE
              </span>
            )}
          </button>
        </div>

        {/* Transaction Signature Display */}
        {lastTransactionSignature && (
          <div className="mt-4 p-4 bg-black border border-gray-700 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white flex items-center animate-fade-in-up uppercase tracking-wider">
                <span className="mr-2">✓</span>
                Transaction Successful
              </h3>
              {onClearSignature && (
                <button
                  onClick={onClearSignature}
                  className="text-gray-400 hover:text-white text-lg transition-all duration-200"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Signature:</span>
              <code className="text-xs bg-gray-800 text-white px-2 py-1 font-mono flex-1 truncate">
                {lastTransactionSignature}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(lastTransactionSignature)}
                className="text-xs text-gray-400 hover:text-white transition-colors duration-200 uppercase tracking-wider"
                title="Copy signature"
              >
                COPY
              </button>
              <a
                href={`https://explorer.solana.com/tx/${lastTransactionSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-white transition-colors duration-200 uppercase tracking-wider"
              >
                EXPLORER
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
