import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="relative z-10 flex justify-between items-center p-6 border-b border-black">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white/80 rounded-sm flex items-center justify-center">
          <span className="text-black font-bold text-sm">AY</span>
        </div>
        <span className="text-xl font-bold text-white/80">
          AutoYield
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex space-x-6">
          <Link to="/vault" className="text-white hover:text-white/80 transition-colors">VAULT</Link>
          <Link to="/dashboard" className="text-white hover:text-white/80 transition-colors">DASHBOARD</Link>
          <Link to="/docs" className="text-white hover:text-white/80 transition-colors">DOCS</Link>
        </nav>
        <WalletMultiButton className="!bg-white !text-black !rounded-none !px-6 !py-2 !font-medium hover:!bg-gray-200 !transition-all !duration-300" />
      </div>
    </nav>
  );
}