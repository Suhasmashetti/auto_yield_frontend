import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { VAULT_AUTHORITY } from "../../constants/vault";
import blueberry from "../../assets/icons/blueberry.png";

export function Header() {
  const { connected, publicKey } = useWallet();
  // const navigate = useNavigate();
  const isVaultOwner =
    connected && publicKey && publicKey.equals(VAULT_AUTHORITY);

  const [scrolled, setScrolled] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-black/50 border-gray-800"
            : "bg-black border-gray-800"
        }`}
      >
      {/* Left section */}
      {/* <button
        onClick={() => navigate("/")}
        className="focus:outline-none onhover:pointer"
        type="button"
      > */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white">
            <img src={blueberry} alt="blueberrylogo" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">
              BlueBerry Finance
            </h1>
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              USDC Yield Vault
            </span>
          </div>
        </div>
      {/* </button> */}

      {/* Middle section */}
      <div className="hidden md:flex flex-col items-start text-sm text-gray-400 space-y-3">
        {/* Vault Authority */}
        <div className="flex items-center space-x-2">
          <span className="uppercase tracking-wide font-medium">
            Vault Authority:
          </span>
          <code className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-md text-gray-200 font-mono">
            {VAULT_AUTHORITY.toBase58().slice(0, 6)}...
            {VAULT_AUTHORITY.toBase58().slice(-6)}
          </code>
        </div>

        {/* Connected Wallet */}
        {connected && publicKey && (
          <div className="flex items-center space-x-2">
            <span className="uppercase tracking-wide font-medium">
              Your Wallet:
            </span>
            <code className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-md text-gray-200 font-mono">
              {publicKey.toBase58().slice(0, 6)}...
              {publicKey.toBase58().slice(-6)}
            </code>
            {isVaultOwner && (
              <span className="ml-2 text-green-400 font-semibold uppercase tracking-wide">
                OWNER
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Warning Button */}
        <button
          onClick={() => setShowWarning(true)}
          className="p-2 text-green-300 hover:text-green-200 transition-colors duration-200 group"
          title="Development Notice"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 16v-2h2v2h-2zm0-4V9h2v3h-2z"/>
          </svg>
        </button>
        
        <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 !font-medium !px-4 !py-2 !transition !border-2 !border-white uppercase tracking-wider" />
      </div>
    </nav>

    {/* Warning Modal */}
    {showWarning && (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[9999] p-4">
        <div className="bg-black border border-green-300 rounded-xl max-w-md w-full p-6 relative">
          {/* Close button */}
          <button
            onClick={() => setShowWarning(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Warning Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-300/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 16v-2h2v2h-2zm0-4V9h2v3h-2z"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-mono font-bold text-white text-center mb-4">
            ⚠️ Development Notice ⚠️
          </h2>

          {/* Content */}
          <div className="space-y-4 font-mono text-sm text-gray-300">
            <p className="text-center">
              <strong className="text-green-300">This website is currently in development mode.</strong>
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2">
              <p className="text-white font-semibold">Important:</p>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• Funds will NOT be transferred to any real protocols</li>
                <li>• This is a testnet/development environment</li>
                <li>• All transactions are for testing purposes only</li>
                <li>• No real money or value is at risk</li>
              </ul>
            </div>

            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <p className="text-green-300 font-semibold mb-2">To test vault interactions:</p>
              <p className="text-xs text-green-200">
                Get development USDC from Solana faucets or use devnet tokens to test deposit/withdraw functionality.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowWarning(false)}
            className="w-full mt-6 bg-green-300 text-black font-mono font-bold py-3 px-4 rounded-lg hover:bg-green-400 transition-colors duration-200"
          >
            UNDERSTOOD
          </button>
        </div>
      </div>
    )}
    </>
  );
}
