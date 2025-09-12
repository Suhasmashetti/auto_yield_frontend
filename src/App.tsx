import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LandingPage, Dashboard } from "./components";

function App() {
  const { connected } = useWallet();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Auto-redirect to dashboard when wallet connects
  useEffect(() => {
    if (connected && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [connected, currentView]);

  // Auto-redirect to landing when wallet disconnects
  useEffect(() => {
    if (!connected && currentView === 'dashboard') {
      setCurrentView('landing');
    }
  }, [connected, currentView]);

  const handleGetStarted = () => {
    if (connected) {
      setCurrentView('dashboard');
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <Dashboard onBackToLanding={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;
