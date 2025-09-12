import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { VAULT_AUTHORITY } from "../constants/vault";

export function Header() {
  const { connected, publicKey } = useWallet();
  const isVaultOwner =
    connected && publicKey && publicKey.equals(VAULT_AUTHORITY);

  return (
    <nav className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
          <span className="text-black font-bold text-sm">AY</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">AutoYield</h1>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            USDC Yield Vault
          </span>
        </div>
      </div>

      {/* Middle section */}
      <div className="hidden md:flex flex-col items-center text-xs text-gray-500">
        <p className="uppercase tracking-wider">
          Vault Authority:{" "}
          <code className="bg-gray-900 border border-gray-700 px-2 py-0.5 text-gray-300 font-mono">
            {VAULT_AUTHORITY.toBase58().slice(0, 6)}...
            {VAULT_AUTHORITY.toBase58().slice(-6)}
          </code>
        </p>
        {connected && publicKey && (
          <p className="uppercase tracking-wider">
            Your Wallet:{" "}
            <code className="bg-gray-900 border border-gray-700 px-2 py-0.5 text-gray-300 font-mono">
              {publicKey.toBase58().slice(0, 6)}...
              {publicKey.toBase58().slice(-6)}
            </code>
            {isVaultOwner && (
              <span className="ml-2 text-white font-medium uppercase tracking-wider">OWNER</span>
            )}
          </p>
        )}
      </div>

      {/* Right section */}
      <div>
        <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 !font-medium !px-4 !py-2 !transition !border-2 !border-white uppercase tracking-wider" />
      </div>
    </nav>
  );
}
