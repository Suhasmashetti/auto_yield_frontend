import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync, getAccount } from "@solana/spl-token";
import { useProgram } from "../../lib/anchorclient";
import { deriveVaultPDAs } from "../../utils/vault";
import { VAULT_AUTHORITY, USDC_MINT, VAULT_META_DATA_ACCOUNT } from "../../constants/vault";
import type { VaultInfo } from "../../types/vault";

interface DevelopmentUtilsProps {
  onError: (error: string) => void;
  vaultInfo: VaultInfo | null;
}

export function DevelopmentUtils({ onError, vaultInfo }: DevelopmentUtilsProps) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const program = useProgram();

  const logPDAs = () => {
    if (!program) return;
    
    const { vaultMetadata, vaultUsdc, yusdcMint } = deriveVaultPDAs(VAULT_AUTHORITY, program);
    console.log("=== Vault PDAs ===");
    console.log("Vault Authority:", VAULT_AUTHORITY.toBase58());
    console.log("Vault Metadata:", vaultMetadata.toBase58());
    console.log("Vault USDC:", vaultUsdc.toBase58());
    console.log("yUSDC Mint (derived):", yusdcMint.toBase58());
    if (vaultInfo) {
      console.log("yUSDC Mint (actual):", vaultInfo.yusdcMint.toBase58());
    }
    console.log("Program ID:", program.programId?.toBase58() || "Not available");
  };

  const checkUSDCAccount = async () => {
    if (!publicKey) return;
    
    const userUsdcAta = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
    const usdcAccountInfo = await connection.getAccountInfo(userUsdcAta);
    
    console.log("=== User USDC Account Debug ===");
    console.log("Wallet:", publicKey.toBase58());
    console.log("USDC Mint:", USDC_MINT.toBase58());
    console.log("Expected USDC ATA:", userUsdcAta.toBase58());
    
    try {
      console.log("Account exists:", !!usdcAccountInfo);
      
      if (usdcAccountInfo) {
        console.log("Account owner:", usdcAccountInfo.owner.toBase58());
        console.log("Account data length:", usdcAccountInfo.data.length);
        
        try {
          const account = await getAccount(connection, userUsdcAta);
          console.log("Token account details:");
          console.log("- Balance:", Number(account.amount) / 1e6, "USDC");
          console.log("- Mint:", account.mint.toBase58());
          console.log("- Owner:", account.owner.toBase58());
          console.log("- Delegate:", account.delegate?.toBase58() || "None");
          console.log("- Is frozen:", account.isFrozen);
        } catch (parseError: any) {
          console.error("Error parsing token account:", parseError.message);
        }
      } else {
        console.log("❌ Account does not exist - you need to get some devnet USDC first");
        console.log("You can use a devnet faucet or transfer from another wallet");
      }
    } catch (fetchError: any) {
      console.error("Error fetching account info:", fetchError.message);
    }
    
    console.log("=== End Debug Info ===");
  };

  const requestAirdrop = async () => {
    if (!publicKey) return;
    
    try {
      const signature = await connection.requestAirdrop(publicKey, 1e9); // 1 SOL
      console.log("Airdrop signature:", signature);
      onError(`Airdrop requested: ${signature}`);
    } catch (err) {
      console.error("Airdrop failed:", err);
      onError(`Airdrop failed: ${err}`);
    }
  };

  const isVaultOwner = publicKey && publicKey.equals(VAULT_AUTHORITY);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
      <h2 className="text-lg font-medium mb-6 text-white">Development Utils</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <button
          onClick={logPDAs}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-600"
        >
          Log PDAs
        </button>
        
        <button
          onClick={checkUSDCAccount}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-600"
        >
          Check USDC
        </button>
        
        <button
          onClick={requestAirdrop}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-blue-500"
        >
          SOL Airdrop
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between py-2 border-b border-gray-700">
          <span className="text-gray-400">USDC Mint</span>
          <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono">
            {USDC_MINT.toBase58()}
          </code>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-700">
          <span className="text-gray-400">Vault Authority</span>
          <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono">
            {VAULT_AUTHORITY.toBase58()}
          </code>
        </div>

         <div className="flex items-center justify-between py-2 border-b border-gray-700">
          <span className="text-gray-400">Vault Meta Data Account</span>
          <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono">
            {VAULT_META_DATA_ACCOUNT.toBase58()}
          </code>
        </div>
        
        {vaultInfo && (
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">yUSDC Mint</span>
            <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono">
              {vaultInfo.yusdcMint.toBase58()}
            </code>
          </div>
        )}
        
        {publicKey && (
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Your Wallet</span>
            <code className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono">
              {publicKey.toBase58()}
            </code>
          </div>
        )}
        
        {isVaultOwner && (
          <div className="flex items-center py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-green-400 text-sm font-medium">Vault Owner</span>
          </div>
        )}
      </div>
    </div>
  );
}