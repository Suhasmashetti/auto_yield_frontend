// Import protocol icons
import franciumIcon from '../../assets/icons/francium.png';
import kaminoIcon from '../../assets/icons/kamino.png';
import solendIcon from '../../assets/icons/solend.png';
import plutoIcon from '../../assets/icons/pluto.png';
import usdcIcon from '../../assets/icons/usd-coin-usdc-logo.png';
import blueberryIcon from '../../assets/icons/blueberry.png';

export function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1">
        <h3 className="text-white font-mono text-lg mb-2">How it works</h3>
        <h2 className="text-4xl font-mono text-white mb-4">How does the BlueBerry token work?</h2>
        <p className="text-gray-300 font-mono text-lg mb-6">Earn yield without speculation</p>
        <ul className="list-disc pl-6 space-y-3 font-mono text-lg text-gray-200">
          <li>Deposit USDC/USDT in exchange for BlueBerryCoin</li>
          <li>The vault constantly lends the deposits to capture the leading rate between the top protocols on Solana.</li>
          <li>Earned yield accrues to the vault balance, increasing the value of BlueBerryCoin</li>
          <li>Exchange BlueBerryCoin anytime for your share of the vault, or directly through a swap</li>
        </ul>
      </div>
      <div className="flex-1 flex flex-col items-center">
        {/* Visual flow diagram */}
        <div className="flex flex-col items-center gap-6">
          {/* Input flow */}
          <div className="flex gap-8 items-center">
            <div className="bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white font-mono text-lg flex items-center gap-3">
              <img src={usdcIcon} alt="USDC" className="w-6 h-6" />
              USDC/USDT IN
            </div>
            <div className="text-white text-2xl">→</div>
            <div className="bg-gray-900 border border-gray-600 rounded-lg px-6 py-4 text-white font-mono text-lg flex items-center gap-3">
              <img src={blueberryIcon} alt="BBC" className="w-6 h-6" />
              BBC TOKEN OUT
            </div>
          </div>
          
          {/* Protocol icons */}
          <div className="flex items-center gap-6 py-4">
            <div className="text-center">
              <img src={franciumIcon} alt="Francium" className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 p-2" />
              <span className="text-gray-300 font-mono text-xs">Francium</span>
            </div>
            <div className="text-center">
              <img src={kaminoIcon} alt="Kamino" className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 p-2" />
              <span className="text-gray-300 font-mono text-xs">Kamino</span>
            </div>
            <div className="text-center">
              <img src={solendIcon} alt="Solend" className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 p-2" />
              <span className="text-gray-300 font-mono text-xs">Solend</span>
            </div>
            <div className="text-center">
              <img src={plutoIcon} alt="Pluto" className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 p-2" />
              <span className="text-gray-300 font-mono text-xs">Pluto</span>
            </div>
          </div>
          
          {/* Output flow */}
          <div className="flex gap-8 items-center">
            <div className="bg-gray-900 border border-gray-600 rounded-lg px-6 py-4 text-white font-mono text-lg flex items-center gap-3">
              <img src={blueberryIcon} alt="BBC" className="w-6 h-6" />
              BBC TOKEN IN
            </div>
            <div className="text-white text-2xl">→</div>
            <div className="bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white font-mono text-lg flex items-center gap-3">
              <img src={usdcIcon} alt="USDC" className="w-6 h-6" />
              USDC/USDT OUT
            </div>
          </div>
          
          <div className="text-gray-300 font-mono text-sm mt-4 text-center">
            Accumulated yield increases the token's value over time
          </div>
        </div>
      </div>
    </section>
  );
}