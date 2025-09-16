import { useMemo, useState, useCallback } from "react";
import { validateAmount } from "../../utils/vault";
import usdcLogo from "../../assets/icons/usd-coin-usdc-logo.png";

interface PortfolioOverviewProps {
  totalValue: number;
  interestEarned: number;
  currency?: string;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  loading?: boolean;
}

export function PortfolioOverview({
  totalValue,
  interestEarned,
  currency = "USDC",
  onDeposit,
  onWithdraw,
  loading = false,
}: PortfolioOverviewProps) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState("");

  const formattedTotalValue = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(totalValue);
  }, [totalValue]);

  const formattedInterestEarned = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(interestEarned);
  }, [interestEarned]);

  const interestPercentage = useMemo(() => {
    if (totalValue === 0) return 0;
    return ((interestEarned / (totalValue - interestEarned)) * 100) || 0;
  }, [totalValue, interestEarned]);

  const handleDepositClick = useCallback(() => {
    setShowDepositModal(true);
    setAmount("");
    setLocalError("");
  }, []);

  const handleWithdrawClick = useCallback(() => {
    setShowWithdrawModal(true);
    setAmount("");
    setLocalError("");
  }, []);

  const handleDepositSubmit = useCallback(() => {
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setLocalError(validation.error!);
      return;
    }

    onDeposit(amount);
    setShowDepositModal(false);
    setAmount("");
    setLocalError("");
  }, [amount, onDeposit]);

  const handleWithdrawSubmit = useCallback(() => {
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setLocalError(validation.error!);
      return;
    }

    onWithdraw(amount);
    setShowWithdrawModal(false);
    setAmount("");
    setLocalError("");
  }, [amount, onWithdraw]);

  const closeModals = useCallback(() => {
    setShowDepositModal(false);
    setShowWithdrawModal(false);
    setAmount("");
    setLocalError("");
  }, []);

  const isAmountValid = amount && parseFloat(amount) > 0;

  return (
    <div className="bg-black border-b border-gray-800 px-4 py-6 pt-30">
      <div className="w-full">
        {/* Header with user info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <img 
                src={usdcLogo}
                alt="USDC"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-gray-300 text-sm">
              Connected • {currency}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleWithdrawClick}
              disabled={loading || totalValue === 0}
              className="px-6 py-2.5 bg-transparent border border-gray-600 text-white rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Withdraw</span>
            </button>
            <button
              onClick={handleDepositClick}
              disabled={loading}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Deposit</span>
            </button>
          </div>
        </div>

        {/* Main stats display */}
        <div className="grid grid-cols-2 gap-8 mb-6 items-end ">
          <div>
            <div className="text-gray-400 text-sm mb-2">Total Value</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-light text-white">
                ${formattedTotalValue}
              </span>
              <span className="text-gray-500 text-lg font-light">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="opacity-30">0</span>
                ))}
              </span>
            </div>
          </div>

          <div className="pl-65">
            <div className="text-gray-400 text-sm mb-2">Interest Earned</div>
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-light text-white">
                ${formattedInterestEarned}
              </span>
              <span className="text-gray-500 text-lg font-light">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="opacity-30">0</span>
                ))}
              </span>
            </div>
            {interestPercentage > 0 && (
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">
                    {interestPercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-400 text-sm">
                    0.00%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status message */}
        {totalValue === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No deposited assets</p>
            <p className="text-gray-500 text-sm mt-1">
              Get started by depositing funds to earn yield
            </p>
          </div>
        ) : interestEarned === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-400">No interest earned last 7 days</p>
          </div>
        ) : null}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Deposit {currency}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black border border-gray-700 px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all duration-300 rounded"
                />
                {localError && (
                  <p className="text-red-500 text-sm mt-1">{localError}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDepositSubmit}
                  disabled={loading || !isAmountValid}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Depositing..." : "Deposit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Withdraw {currency}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black border border-gray-700 px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all duration-300 rounded"
                />
                {localError && (
                  <p className="text-red-500 text-sm mt-1">{localError}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawSubmit}
                  disabled={loading || !isAmountValid}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Withdrawing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}