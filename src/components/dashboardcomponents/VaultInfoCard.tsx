import { memo } from "react";
import type { VaultInfo } from "../../types/vault";
import { DEFAULT_EXCHANGE_RATE } from "../../constants/vault";

interface VaultInfoCardProps {
  vaultInfo: VaultInfo | null;
  isVaultOwner: boolean;
  loading: boolean;
  isInitializing?: boolean;
  onInitialize: () => void;
  onFixAuthorities: () => void;
}

export const VaultInfoCard = memo(function VaultInfoCard({
  vaultInfo,
  isVaultOwner,
  loading,
  isInitializing = false,
  onInitialize,
  onFixAuthorities,
}: VaultInfoCardProps) {
  const exchangeRate =
    vaultInfo && vaultInfo.yusdcSupply > 0
      ? vaultInfo.usdcBalance / vaultInfo.yusdcSupply
      : DEFAULT_EXCHANGE_RATE;

  return (
    <div className="bg-black-900 border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center uppercase tracking-wider">
        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
        Vault Information
      </h2>

      {vaultInfo ? (
        <div className="space-y-4">
          {/* Stats */}
          <div className="space-y-2 text-sm">
            <InfoRow 
              label="USDC Balance" 
              value={`${vaultInfo.usdcBalance.toFixed(6)} USDC`}
              animated={true}
            />
            <InfoRow 
              label="yUSDC Supply" 
              value={`${vaultInfo.yusdcSupply.toFixed(6)} yUSDC`}
              animated={true}
            />
            <InfoRow 
              label="Exchange Rate" 
              value={`1 yUSDC = ${exchangeRate.toFixed(6)} USDC`}
              animated={true}
              highlight={exchangeRate > DEFAULT_EXCHANGE_RATE}
            />
          </div>

          {/* Owner Actions */}
          {isVaultOwner && (
            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={onFixAuthorities}
                disabled={loading}
                className="bg-black text-white border-2 border-white px-4 py-2 disabled:opacity-50 text-sm transition-all duration-300 hover:bg-white hover:text-black font-medium uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    FIXING...
                  </span>
                ) : (
                  "FIX AUTHORITIES"
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Use if deposit/withdraw fails due to authority issues.
              </p>
            </div>
          )}
        </div>
      ) : (
        <VaultNotInitialized
          isVaultOwner={isVaultOwner}
          loading={loading}
          isInitializing={isInitializing}
          onInitialize={onInitialize}
          onFixAuthorities={onFixAuthorities}
        />
      )}
    </div>
  );
});

/* 🔹 Reusable row component */
function InfoRow({ 
  label, 
  value, 
  animated = false, 
  highlight = false 
}: { 
  label: string; 
  value: string; 
  animated?: boolean; 
  highlight?: boolean; 
}) {
  return (
    <div className={`flex justify-between text-gray-300 transition-all duration-300 ${animated ? 'hover:text-white' : ''}`}>
      <span className="uppercase tracking-wider text-xs">{label}:</span>
      <span className={`font-mono transition-all duration-300 ${
        highlight 
          ? 'text-white font-semibold' 
          : 'text-gray-100'
      } ${animated ? 'hover:scale-105' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function VaultNotInitialized({
  isVaultOwner,
  loading,
  isInitializing = false,
  onInitialize,
  onFixAuthorities,
}: {
  isVaultOwner: boolean;
  loading: boolean;
  isInitializing?: boolean;
  onInitialize: () => void;
  onFixAuthorities: () => void;
}) {
  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="text-center animate-fade-in-up">
        <div className="mb-4">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
          <p className="text-gray-400 uppercase tracking-wider">Loading vault information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-gray-400 uppercase tracking-wider">Vault not initialized</p>
      </div>

      {isVaultOwner ? (
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onInitialize}
            disabled={loading}
            className="bg-white text-black px-6 py-3 disabled:opacity-50 transition-all duration-300 hover:bg-gray-200 font-medium border-2 border-white uppercase tracking-wider"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                INITIALIZING...
              </span>
            ) : (
              <span className="flex items-center">
                INITIALIZE VAULT
              </span>
            )}
          </button>
          <button
            onClick={onFixAuthorities}
            disabled={loading}
            className="bg-black text-white border-2 border-white px-4 py-2 disabled:opacity-50 transition-all duration-300 hover:bg-white hover:text-black font-medium uppercase tracking-wider"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                LOADING...
              </span>
            ) : (
              "FIX AUTHORITIES"
            )}
          </button>
        </div>
      ) : (
        <div className="text-center text-sm border border-gray-800 p-4 ">
          <p className="text-gray-400 mb-2 flex items-center justify-center uppercase tracking-wider">
            <span className="mr-2">⚠</span>
            Only the vault owner can initialize the vault.
          </p>
          <p className="text-gray-400 mb-2 uppercase tracking-wider">Vault Owner:</p>
          <code className="bg-gray-800 px-3 py-2 text-xs text-gray-300 block break-all font-mono">
            DWpFeAKWzFdTQFxUHzsTDCdXU1ouKoxypfMvLAYSbyT
          </code>
        </div>
      )}
    </div>
  );
}