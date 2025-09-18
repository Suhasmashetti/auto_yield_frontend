import { AnimatedNumber } from "../shadcomponents/AnimatedNumber";

export function CallToAction() {
  return (
    <div className="relative z-10 py-20 border-t border-gray-800">
      <div className="max-w-4xl mx-auto text-center px-4 font-mono">
        <h2 className="text-4xl md:text-5xl text-white mb-8">
          READY TO START EARNING?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join thousands of users who are already earning yield on their USDC
        </p>
        <div className="mb-8">
          <div className="text-6xl md:text-7xl font-mono font-bold text-white mb-4">
            $<AnimatedNumber value={1000000} className="text-green-400" />
          </div>
          <p className="text-lg text-gray-400 font-mono">
            Total Value Locked in BlueBerry Vaults
          </p>
        </div>
      </div>
    </div>
  );
}