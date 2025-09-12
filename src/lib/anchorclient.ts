import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import idl from "../idl/auto_yield.json";

const PROGRAM_ID = new PublicKey(idl.address);

// RPC network
const NETWORK = "https://api.devnet.solana.com";

/**
 * Hook to get the Program instance
 */
export function useProgram(): Program<Idl> | null {
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) {
      console.log("No wallet connected, program will be null");
      return null;
    }

    try {
      const connection = new Connection(NETWORK, "processed");
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
        commitment: "processed",
      });

      const program = new Program(idl as Idl, provider);
      console.log("Program initialized successfully:", program.programId.toBase58());
      return program;
    } catch (error) {
      console.error("Error initializing program:", error);
      return null;
    }
  }, [wallet]);

  return program;
}

// Export program ID for use in components
export { PROGRAM_ID };
