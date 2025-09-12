import { PublicKey } from "@solana/web3.js";

export interface VaultInfo {
  authority: PublicKey;
  usdcBalance: number;
  yusdcSupply: number;
  yusdcMint: PublicKey;
  vaultUsdc: PublicKey;
  lastDepositTime: number;
}

export interface UserBalances {
  usdcBalance: number;
  yusdcBalance: number;
}

export interface VaultPDAs {
  vaultMetadata: PublicKey;
  vaultUsdc: PublicKey;
  yusdcMint: PublicKey;
}

export interface VaultActions {
  handleInitialize: () => Promise<void>;
  handleDeposit: (amount: string) => Promise<void>;
  handleWithdraw: (amount: string) => Promise<void>;
  handleFixAuthorities: () => Promise<void>;
  refreshVaultInfo: () => Promise<void>;
  refreshUserBalances: () => Promise<void>;
}

export interface VaultState {
  vaultInfo: VaultInfo | null;
  userBalances: UserBalances;
  loading: boolean;
  error: string;
  isVaultOwner: boolean;
}