import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-sm">AY</span>
          </div>
          <span className="text-xl font-bold text-white">
            AutoYield
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">VAULT</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">DASHBOARD</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">DOCS</a>
          </nav>
          <WalletMultiButton className="!bg-white !text-black !rounded-none !px-6 !py-2 !font-medium hover:!bg-gray-200 !transition-all !duration-300" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Heading */}
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
              <span className="text-white">WHERE</span>
              <br />
              <span className="text-white">USDC</span>
              <br />
              <span className="text-white border-2 border-white px-4 py-2 inline-block">MEETS</span>
              <br />
              <span className="text-white">YIELD</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="animate-fade-in-up animation-delay-300">
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Discover, stake, and earn yield on USDC
              <br />
              through automated vault strategies.
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up animation-delay-600 mb-16">
            {connected ? (
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black bg-white hover:bg-gray-200 transition-all duration-300 border-2 border-white"
              >
                <span className="flex items-center">
                  ENTER VAULT
                  <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            ) : (
              <div className="text-gray-400">
                <p className="mb-4 text-lg">Connect your wallet to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="animate-fade-in-up animation-delay-900 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2">8.5%</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Average APY</div>
            </div>
            <div className="p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Minimum Deposit</div>
            </div>
            <div className="p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Automated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Start Section */}
      <div className="relative z-10 py-20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            READY TO START EARNING?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users who are already earning yield on their USDC
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Auto-Compound</h3>
              <p className="text-gray-400 text-sm">Yield automatically reinvests for maximum returns</p>
            </div>
            <div className="text-center p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Secure</h3>
              <p className="text-gray-400 text-sm">Audited smart contracts on Solana blockchain</p>
            </div>
            <div className="text-center p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Fast</h3>
              <p className="text-gray-400 text-sm">Instant deposits and withdrawals</p>
            </div>
            <div className="text-center p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Profitable</h3>
              <p className="text-gray-400 text-sm">Competitive yields with low fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}