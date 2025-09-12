import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useVaultOperations } from "../hooks/useVaultOperations";
import {
  Header,
  VaultInfoCard,
  UserBalancesCard,
  ActionPanel,
  DevelopmentUtils,
  ErrorDisplay,
} from "./";

interface DashboardProps {
  onBackToLanding: () => void;
}

export function Dashboard({ onBackToLanding }: DashboardProps) {
  const { connected } = useWallet();
  const {
    // State
    vaultInfo,
    userBalances,
    loading,
    error,
    isVaultOwner,
    lastTransactionSignature,

    // Actions
    handleInitialize,
    handleDeposit,
    handleWithdraw,
    handleFixAuthorities,
    refreshData,
    setError,
    clearTransactionSignature,
  } = useVaultOperations();

  useEffect(() => {
    if (connected) {
      refreshData();
    }
  }, [connected, refreshData]);

  // Redirect to landing if disconnected
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
        <ErrorDisplay error={error} onClose={() => setError("")} />

        {connected ? (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
            <VaultInfoCard
              vaultInfo={vaultInfo}
              isVaultOwner={isVaultOwner}
              loading={loading}
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
                onClearSignature={clearTransactionSignature}
              />
            )}

            {/* Show Dev Tools only for vault owner */}
            {isVaultOwner && <DevelopmentUtils onError={setError} vaultInfo={vaultInfo} />}
          </div>
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