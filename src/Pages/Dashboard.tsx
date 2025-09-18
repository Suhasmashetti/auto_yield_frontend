import { useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { useVaultOperations } from "../hooks/useVaultOperations";
import {
  Header,
  DevelopmentUtils,
  ErrorDisplay,
  PortfolioOverview,
  TabNavigation,
  useTabNavigation,
  AssetsDisplay,
  LiveRatesDisplay,
} from "../components/dashboardcomponents";
import { BasicLineChart } from "../components/landingpagecomponents/LineChart";

interface DashboardProps {
  onBackToLanding: () => void;
}

export function Dashboard({ onBackToLanding }: DashboardProps) {
  const { connected } = useWallet();
  const { activeTab, setActiveTab } = useTabNavigation("portfolio");

  const {
    vaultInfo,
    userBalances,
    loading,
    error,
    isVaultOwner,
    handleDeposit,
    handleWithdraw,
    refreshData,
    setError,
  } = useVaultOperations();

  // Memoized callbacks
  const memoizedClearError = useCallback(() => {
    setError("");
  }, [setError]);


  const memoizedSetError = useCallback(
    (errorMsg: string) => {
      setError(errorMsg);
    },
    [setError]
  );

  // Calculate portfolio values based on user's individual balance
  const totalValue = userBalances.yusdcBalance || 0; // User's deposited amount in BBC
  const interestEarned = 0; // Calculate based on your logic
  
  // Real data for assets and allocations based on user's balance
  const mockAssets = totalValue > 0 ? [{
    symbol: "BBC",
    name: "Yield USDC",
    amount: totalValue,
    value: totalValue,
    apy: 8.5,
    protocol: "Auto Yield"
  }] : [];

  const mockAllocations = totalValue > 0 ? [{
    protocol: "Auto Yield Vault",
    amount: totalValue,
    percentage: 100,
    apy: 8.5
  }] : [];

  // Handlers for the PortfolioOverview component
  const handlePortfolioDeposit = useCallback((amount: string) => {
    handleDeposit(amount);
  }, [handleDeposit]);

  const handlePortfolioWithdraw = useCallback((amount: string) => {
    handleWithdraw(amount);
  }, [handleWithdraw]);

  // Refresh vault data when wallet connects
  useEffect(() => {
    if (connected) {
      refreshData();
    }
  }, [connected, refreshData]);

  // Redirect if wallet disconnects
  useEffect(() => {
    if (!connected) {
      onBackToLanding();
    }
  }, [connected, onBackToLanding]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "portfolio":
        return (
          <>
          <LiveRatesDisplay />
            <AssetsDisplay 
              assets={mockAssets}
              allocations={mockAllocations}
              loading={loading}
            />
            {/* <LiveRatesDisplay /> */}
          </>
        );
      case "insights":
        return (
          <BasicLineChart userTotalValue={totalValue} />
        );
      case "activity":
        return (
          <div className="px-4 py-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Activity</h2>
            <p className="text-gray-400">Transaction history and activity feed coming soon.</p>
          </div>
        );
      case "rewards":
        return (
          <div className="px-4 py-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Rewards</h2>
            <p className="text-gray-400">Loyalty rewards and bonuses coming soon.</p>
          </div>
        );
      case "referrals":
        return (
          <div className="px-4 py-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Referrals</h2>
            <p className="text-gray-400">Refer friends and earn rewards coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Error Toast/Alert */}
      <ErrorDisplay error={error} onClose={memoizedClearError} />

      {connected ? (
        <div className="max-w-4xl mx-auto">
          {/* Portfolio Overview */}
          <PortfolioOverview
            totalValue={totalValue}
            interestEarned={interestEarned}
            onDeposit={handlePortfolioDeposit}
            onWithdraw={handlePortfolioWithdraw}
            loading={loading}
          />

          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* Tab Content */}
          <main className="pb-8">
            {renderTabContent()}
          </main>

          {/* Development Tools - Only visible for vault owner */}
          {isVaultOwner && (
            <div className="mt-8">
              <DevelopmentUtils
                onError={memoizedSetError}
                vaultInfo={vaultInfo}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-400 mt-12 px-4">
            <p className="text-lg">Connect your wallet</p>
            <p className="text-sm mt-2">
              Access vault details, manage deposits, and track balances
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
