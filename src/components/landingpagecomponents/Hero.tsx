import { useWallet } from "@solana/wallet-adapter-react";
import { AggregatorCard } from "./AggregatorCard";

interface HeroProps {
  onGetStarted: () => void;
}

// Aggregator data
const aggregators = [
  {
    name: "Yearn Finance",
    description: "Auto-compounding strategies",
    apy: "8.2",
    icon: "Y"
  },
  {
    name: "Aave Protocol",
    description: "Lending & borrowing",
    apy: "7.8",
    icon: "A"
  },
  {
    name: "Marinade",
    description: "Liquid staking",
    apy: "9.1",
    icon: "M"
  }
];

export function Hero({ onGetStarted }: HeroProps) {
  const { connected } = useWallet();

  return (
    <div className="relative z-10 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Main Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
                <span className="text-white">STOP</span>
                <br />
                <span className="text-white">HOLDING</span>
                <br />
                <span className="text-white border-2 border-white px-4 py-1 inline-block">START</span>
                <br />
                <span className="text-white">YIELDING</span>
              </h1>
              <div className="flex items-center space-x-2 mt-6">
                <img src="https://cdn3.emoji.gg/emojis/7187-solana.png" alt="Solana" className="w-6 h-6" />
                <span className="text-gray-400 text-sm uppercase tracking-wider">BUILT ON SOLANA</span>
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-lg">
                Discover, stake, and earn yield on USDC through automated vault strategies.
              </p>
            </div>

            {/* CTA Button */}
            <div>
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

          {/* Right Side - Available Aggregators Cards */}
          <div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Available Yield Aggregators</h3>
              
              {/* Aggregator Cards */}
              <div className="space-y-4">
                {aggregators.map((aggregator) => (
                  <AggregatorCard
                    key={aggregator.name}
                    name={aggregator.name}
                    description={aggregator.description}
                    apy={aggregator.apy}
                    icon={aggregator.icon}
                  />
                ))}
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                   Smart routing finds the best yields automatically
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}