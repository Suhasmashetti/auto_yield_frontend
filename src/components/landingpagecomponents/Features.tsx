export function Features() {
  return (
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
  );
}