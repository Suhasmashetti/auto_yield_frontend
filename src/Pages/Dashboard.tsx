import { useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { useVaultOperations } from "../hooks/useVaultOperations";
import {
  Header,
  VaultInfoCard,
  UserBalancesCard,
  ActionPanel,
  DevelopmentUtils,
  ErrorDisplay,
  SmartRouting,
} from "../components/dashboardcomponents";

interface DashboardProps {
  onBackToLanding: () => void;
}

export function Dashboard({ onBackToLanding }: DashboardProps) {
  const { connected } = useWallet();

  const {
    vaultInfo,
    userBalances,
    loading,
    error,
    isVaultOwner,
    lastTransactionSignature,
    isInitializing,
    handleInitialize,
    handleDeposit,
    handleWithdraw,
    handleFixAuthorities,
    refreshData,
    setError,
    clearTransactionSignature,
  } = useVaultOperations();

  // Memoized callbacks
  const memoizedClearError = useCallback(() => {
    setError("");
  }, [setError]);

  const memoizedClearSignature = useCallback(() => {
    clearTransactionSignature();
  }, [clearTransactionSignature]);

  const memoizedSetError = useCallback(
    (errorMsg: string) => {
      setError(errorMsg);
    },
    [setError]
  );

  // Refresh vault data when wallet connects
  useEffect(() => {
    if (connected) {
      refreshData();
    }
  }, [connected]); // Avoid refresh loop

  // Redirect if wallet disconnects
  useEffect(() => {
    if (!connected) {
      onBackToLanding();
    }
  }, [connected, onBackToLanding]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Error Toast/Alert */}
        <ErrorDisplay error={error} onClose={memoizedClearError} />

        {connected ? (
          <>
            {/* Smart Routing Section */}
            <div className="mb-8">
              <SmartRouting />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <VaultInfoCard
                vaultInfo={vaultInfo}
                isVaultOwner={isVaultOwner}
                loading={loading}
                isInitializing={isInitializing}
                onInitialize={handleInitialize}
                onFixAuthorities={handleFixAuthorities}
              />

              <UserBalancesCard userBalances={userBalances} />

              {vaultInfo && (
                <ActionPanel
                  loading={loading}
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                  lastTransactionSignature={lastTransactionSignature}
                  onClearSignature={memoizedClearSignature}
                />
              )}

              {/* Dev Tools only for vault owner */}
              {isVaultOwner && (
                <DevelopmentUtils
                  onError={memoizedSetError}
                  vaultInfo={vaultInfo}
                />
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 mt-16">
            <p className="text-lg">Connect your wallet</p>
            <p className="text-sm mt-2">
              Access vault details, manage deposits, and track balances
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
