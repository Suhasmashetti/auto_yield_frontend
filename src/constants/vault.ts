import { PublicKey } from "@solana/web3.js";

// Solana program addresses
export const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // DevNet USDC
export const VAULT_AUTHORITY = new PublicKey("DWpFeAKWzFdTQFxUHzsTDCdXU1ouKoxypfMvLAYSbyT");

// PDA seeds
export const VAULT_METADATA_SEED = "vault_metadata";
export const VAULT_USDC_SEED = "vault_usdc";
export const YUSDC_MINT_SEED = "yusdc_mint";

// Decimals
export const USDC_DECIMALS = 6;
export const LAMPORTS_PER_USDC = Math.pow(10, USDC_DECIMALS);

// UI Constants
export const DEFAULT_EXCHANGE_RATE = 1;
export const REFRESH_DELAY_MS = 2000;