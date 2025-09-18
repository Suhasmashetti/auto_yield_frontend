interface TransactionModalProps {
  type: "deposit" | "withdraw";
  currency: string;
  amount: string;
  setAmount: (value: string) => void;
  localError?: string;
  loading: boolean;
  isAmountValid: boolean;
  closeModals: () => void;
  handleSubmit: () => void;
}

export function TransactionModal({
  type,
  currency,
  amount,
  setAmount,
  localError,
  loading,
  isAmountValid,
  closeModals,
  handleSubmit,
}: TransactionModalProps) {
  const isDeposit = type === "deposit";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-600/50 rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDeposit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {isDeposit ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white capitalize">
                {type} {currency}
              </h3>
              <p className="text-sm text-slate-400">Enter transaction details</p>
            </div>
          </div>
          <button
            onClick={closeModals}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Amount</label>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full bg-slate-800/50 border-2 ${
                  localError 
                    ? 'border-rose-500/50 focus:border-rose-400' 
                    : 'border-slate-600/50 focus:border-slate-400'
                } px-4 py-3 text-white placeholder-slate-500 rounded-xl focus:outline-none transition-all duration-200 text-lg font-medium backdrop-blur-sm`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-slate-400 font-medium text-sm uppercase">{currency}</span>
              </div>
            </div>
            {localError && (
              <div className="flex items-center space-x-2 text-rose-400 animate-in slide-in-from-top-2 duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">{localError}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={closeModals}
              className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isAmountValid}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                isDeposit
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-500/25"
                  : "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-rose-500/25"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isDeposit ? "Processing..." : "Processing..."}</span>
                </div>
              ) : (
                <span className="capitalize">{type}</span>
              )}
            </button>
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className={`mt-6 h-1 rounded-full ${
          isDeposit ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0' : 'bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0'
        }`}></div>
      </div>
    </div>
  );
}