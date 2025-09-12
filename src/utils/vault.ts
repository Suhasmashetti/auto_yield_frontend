import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { VAULT_METADATA_SEED, VAULT_USDC_SEED, YUSDC_MINT_SEED } from "../constants/vault";
import type { VaultPDAs } from "../types/vault";

/**
 * Derive all PDAs for the vault based on the authority
 */
export function deriveVaultPDAs(authority: PublicKey, program: Program): VaultPDAs {
  const [vaultMetadata] = PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_METADATA_SEED), authority.toBuffer()],
    program.programId
  );
  
  const [vaultUsdc] = PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_USDC_SEED), authority.toBuffer()],
    program.programId
  );
  
  const [yusdcMint] = PublicKey.findProgramAddressSync(
    [Buffer.from(YUSDC_MINT_SEED), authority.toBuffer()],
    program.programId
  );

  return { vaultMetadata, vaultUsdc, yusdcMint };
}

/**
 * Convert lamports to USDC amount
 */
export function lamportsToUsdc(lamports: number): number {
  return lamports / 1e6;
}

/**
 * Convert USDC amount to lamports
 */
export function usdcToLamports(usdc: number): number {
  return Math.floor(usdc * 1e6);
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: any, operation: string): string {
  let errorMessage = `${operation} failed: `;
  
  if (error.logs && error.logs.length > 0) {
    console.log(`${operation} transaction logs:`, error.logs);
    errorMessage += `Transaction failed. Check console for logs.`;
  } else if (error.message) {
    errorMessage += error.message;
  } else if (error.toString) {
    errorMessage += error.toString();
  } else {
    errorMessage += "Unknown error occurred";
  }
  
  return errorMessage;
}

/**
 * Validate amount input
 */
export function validateAmount(amount: string): { isValid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Invalid amount format' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 1000000) {
    return { isValid: false, error: 'Amount is too large' };
  }
  
  return { isValid: true };
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}