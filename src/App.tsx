import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { LandingPage, Dashboard } from ".";

function App() {
  const { connected, connecting } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [isWalletReady, setIsWalletReady] = useState(false);

  // Track when wallet connection state is ready
  useEffect(() => {
    // Add a small delay to ensure wallet state is stable
    const timer = setTimeout(() => {
      setIsWalletReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Auto-redirect based on wallet connection and current route
  useEffect(() => {
    if (!isWalletReady || connecting) return;

    if (connected && location.pathname === '/') {
      navigate('/dashboard');
    } else if (!connected && location.pathname === '/dashboard') {
      navigate('/');
    }
  }, [connected, connecting, location.pathname, navigate, isWalletReady]);

  const handleGetStarted = () => {
    if (connected) {
      navigate('/dashboard');
    }
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  // Show loading state while wallet is connecting or not ready
  if (!isWalletReady || connecting) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
          <p className="text-gray-400 uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage onGetStarted={handleGetStarted} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            connected ? (
              <Dashboard onBackToLanding={handleBackToLanding} />
            ) : (
              <LandingPage onGetStarted={handleGetStarted} />
            )
          } 
        />
        <Route 
          path="/vault" 
          element={<LandingPage onGetStarted={handleGetStarted} />} 
        />
        <Route 
          path="/docs" 
          element={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                <p className="text-gray-400">Coming Soon...</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
