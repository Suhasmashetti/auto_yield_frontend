import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync, getAccount } from "@solana/spl-token";
import { useState, useEffect } from "react";
import { deriveVaultPDAs } from "../../utils/vault";
import { useProgram } from "../../lib/anchorclient";
import { VAULT_AUTHORITY } from "../../constants/vault";

export function TokenBalanceInfo() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const program = useProgram();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    if (!publicKey || !program) return;

    const checkTokenBalance = async () => {
      try {
        const { yusdcMint } = deriveVaultPDAs(VAULT_AUTHORITY, program);
        const userYusdcAta = getAssociatedTokenAddressSync(yusdcMint, publicKey);
        
        try {
          const tokenAccount = await getAccount(connection, userYusdcAta);
          const balance = Number(tokenAccount.amount) / 1e6;
          
          setTokenInfo({
            mint: yusdcMint.toBase58(),
            ata: userYusdcAta.toBase58(),
            balance: balance,
            exists: true
          });
        } catch {
          setTokenInfo({
            mint: yusdcMint.toBase58(),
            ata: userYusdcAta.toBase58(),
            balance: 0,
            exists: false
          });
        }
      } catch (error) {
        console.error("Error checking token balance:", error);
      }
    };

    checkTokenBalance();
  }, [publicKey, program, connection]);

  if (!tokenInfo) return null;

  return (
    <div className="px-4 pb-6 pt-5">
      <div className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
           Token Account Address
        </h3>
        
        <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
          <div className="text-sm text-gray-400 mb-2">Your BBC Token Account (ATA)</div>
          <div className="font-mono text-xs text-gray-300 break-all bg-black/40 p-3 rounded">
            {tokenInfo.ata}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(tokenInfo.ata)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
             Copy Address
          </button>
        </div>
        
        {tokenInfo.exists && (
          <div className="mt-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/50 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="text-green-100">
                Phantom may show BBC as "Unknown Token" due to missing metadata, but your tokens are safe and functional and your wallet might update a bit slow.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}