import { useState, useCallback, useRef, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getAccount, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { useProgram } from "../lib/anchorclient";
import { deriveVaultPDAs, formatErrorMessage, validateAmount, usdcToLamports, sleep } from "../utils/vault";
import { VAULT_AUTHORITY, USDC_MINT, REFRESH_DELAY_MS } from "../constants/vault";
import type { VaultInfo, UserBalances } from "../types/vault";

export function useVaultOperations() {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const program = useProgram();
  
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);
  const [userBalances, setUserBalances] = useState<UserBalances>({ usdcBalance: 0, yusdcBalance: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVaultOwner, setIsVaultOwner] = useState(false);
  const [lastTransactionSignature, setLastTransactionSignature] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Prevent multiple simultaneous API calls
  const isLoadingRef = useRef(false);
  const hasInitialized = useRef(false);

  // Load user balances (reusable function)
  const loadUserBalances = useCallback(async (currentVaultInfo?: VaultInfo | null) => {
    if (!publicKey || !connection) return;
    try {
      const userUsdcAta = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
      let usdcBalance = 0;
      try {
        const usdcAccount = await getAccount(connection, userUsdcAta);
        usdcBalance = Number(usdcAccount.amount) / 1e6;
      } catch {}

      let yusdcBalance = 0;
      if (currentVaultInfo) {
        const userYusdcAta = getAssociatedTokenAddressSync(currentVaultInfo.yusdcMint, publicKey);
        try {
          const yusdcAccount = await getAccount(connection, userYusdcAta);
          yusdcBalance = Number(yusdcAccount.amount) / 1e6;
        } catch {}
      }
      setUserBalances({ usdcBalance, yusdcBalance });
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error loading user balances:", err);
      }
    }
  }, [publicKey, connection]);

  // Initialize all data (only called once or manually)
  const initializeData = useCallback(async () => {
    if (!connected || !program || isLoadingRef.current) return;
    isLoadingRef.current = true;
    hasInitialized.current = true;
    try {
      setIsVaultOwner(!!publicKey && publicKey.equals(VAULT_AUTHORITY));
      const { vaultMetadata } = deriveVaultPDAs(VAULT_AUTHORITY, program);
      let accountInfo;
      try {
        accountInfo = await (program.account as any).vaultMetaData?.fetchNullable(vaultMetadata);
      } catch {
        try {
          accountInfo = await (program.account as any).VaultMetaData?.fetchNullable(vaultMetadata);
        } catch {
          accountInfo = null;
        }
      }
      let currentVaultInfo = null;
      if (accountInfo) {
        currentVaultInfo = {
          authority: accountInfo.authority,
          usdcBalance: accountInfo.usdcBalance.toNumber() / 1e6,
          yusdcSupply: accountInfo.yusdcSupply.toNumber() / 1e6,
          yusdcMint: accountInfo.yusdcMint,
          vaultUsdc: accountInfo.vaultUsdc,
          lastDepositTime: accountInfo.lastDepositTime.toNumber()
        };
      }
      setVaultInfo(currentVaultInfo);
      await loadUserBalances(currentVaultInfo);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Error during initialization:", err);
      }
    } finally {
      isLoadingRef.current = false;
      setIsInitializing(false);
    }
  }, [connected, program, publicKey, loadUserBalances]);

  // Initialize when wallet connects
  useEffect(() => {
    if (connected && !hasInitialized.current) {
      initializeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  // Clear data when wallet changes (publicKey changes)
  useEffect(() => {
    if (connected) {
      setVaultInfo(null);
      setUserBalances({ usdcBalance: 0, yusdcBalance: 0 });
      setError("");
      setLastTransactionSignature(null);
      setIsVaultOwner(false);
      hasInitialized.current = false;
      initializeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  // Set initial loading state based on connection status
  useEffect(() => {
    if (!connected) {
      setIsInitializing(false);
      setVaultInfo(null);
      setUserBalances({ usdcBalance: 0, yusdcBalance: 0 });
      setError("");
      setLastTransactionSignature(null);
      setIsVaultOwner(false);
      hasInitialized.current = false;
    }
  }, [connected]);

  // Initialize vault
  const handleInitialize = useCallback(async () => {
    if (!program || !publicKey) return;
    if (!publicKey.equals(VAULT_AUTHORITY)) {
      setError("Only the vault owner can initialize the vault.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { vaultMetadata, vaultUsdc, yusdcMint } = deriveVaultPDAs(VAULT_AUTHORITY, program);
      const signature = await program.methods.initialize()
        .accounts({
          authority: VAULT_AUTHORITY,
          vaultMetadata,
          usdcMint: USDC_MINT,
          vaultUsdc,
          yusdcMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      if (process.env.NODE_ENV === 'development') {
        console.log("Initialize tx:", signature);
      }
      setError("");
      await sleep(REFRESH_DELAY_MS);
      await initializeData();
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Initialize error:", err);
      }
      setError(formatErrorMessage(err, "Initialize"));
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, initializeData]);

  // Fix authorities
  const handleFixAuthorities = useCallback(async () => {
    if (!program || !publicKey || !publicKey.equals(VAULT_AUTHORITY)) return;
    setLoading(true);
    setError("");
    try {
      const { vaultMetadata, vaultUsdc, yusdcMint } = deriveVaultPDAs(VAULT_AUTHORITY, program);
      const signature = await program.methods.fixAuthorities()
        .accounts({
          authority: publicKey,
          vaultMetadata,
          yusdcMint,
          vaultUsdc,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      if (process.env.NODE_ENV === 'development') {
        console.log("Fix authorities tx:", signature);
      }
      setError("");
      await sleep(REFRESH_DELAY_MS);
      await initializeData();
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Fix authorities error:", err);
      }
      setError(formatErrorMessage(err, "Fix authorities"));
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, initializeData]);

  // Deposit
  const handleDeposit = useCallback(async (amount: string) => {
    if (!program || !publicKey || !amount) return;
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { vaultMetadata, vaultUsdc, yusdcMint } = deriveVaultPDAs(VAULT_AUTHORITY, program);
      const userUsdcAta = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
      const userYusdcAta = getAssociatedTokenAddressSync(yusdcMint, publicKey);
      let userBalance = 0;
      try {
        const userUsdcAccount = await getAccount(connection, userUsdcAta);
        userBalance = Number(userUsdcAccount.amount) / 1e6;
      } catch (accountError: any) {
        setError(accountError?.message?.includes('could not find account') || accountError?.name === 'TokenAccountNotFoundError'
          ? `You don't have a USDC token account. Please get some devnet USDC first.`
          : `Error accessing USDC account: ${accountError.message || accountError.toString()}`);
        setLoading(false);
        return;
      }
      const depositAmountNumber = parseFloat(amount);
      if (userBalance < depositAmountNumber) {
        setError(`Insufficient USDC balance. You have ${userBalance.toFixed(6)} USDC but trying to deposit ${depositAmountNumber} USDC`);
        setLoading(false);
        return;
      }
      let createAtaInstruction = null;
      try {
        await getAccount(connection, userYusdcAta);
      } catch {
        createAtaInstruction = createAssociatedTokenAccountInstruction(
          publicKey,
          userYusdcAta,
          publicKey,
          yusdcMint
        );
      }
      const depositAmount = new anchor.BN(usdcToLamports(depositAmountNumber));
      if (process.env.NODE_ENV === 'development') {
        console.log("Deposit debug info:", {
          user: publicKey.toBase58(),
          authority: VAULT_AUTHORITY.toBase58(),
          depositAmount: depositAmount.toString()
        });
      }
      const depositBuilder = program.methods.deposit(depositAmount)
        .accounts({
          user: publicKey,
          authority: VAULT_AUTHORITY,
          vaultMetadata,
          userUsdc: userUsdcAta,
          vaultUsdc,
          usdcMint: USDC_MINT,
          yusdcMint,
          userYusdc: userYusdcAta,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        });
      let signature;
      if (createAtaInstruction) {
        const tx = new Transaction().add(createAtaInstruction);
        const depositIx = await depositBuilder.instruction();
        tx.add(depositIx);
        signature = await sendTransaction(tx, connection);
      } else {
        signature = await depositBuilder.rpc();
      }
      if (process.env.NODE_ENV === 'development') {
        console.log("Deposit tx:", signature);
      }
      setError("");
      setLastTransactionSignature(signature);
      await sleep(REFRESH_DELAY_MS);
      await initializeData();
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Deposit error:", err);
      }
      setError(formatErrorMessage(err, "Deposit"));
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, connection, sendTransaction, initializeData]);

  // Withdraw
  const handleWithdraw = useCallback(async (amount: string) => {
    if (!program || !publicKey || !amount || !vaultInfo) return;
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { vaultMetadata, vaultUsdc, yusdcMint } = deriveVaultPDAs(VAULT_AUTHORITY, program);
      const userUsdcAta = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
      const userYusdcAta = getAssociatedTokenAddressSync(yusdcMint, publicKey);
      const withdrawAmount = new anchor.BN(usdcToLamports(parseFloat(amount)));
      const signature = await program.methods.withdraw(withdrawAmount)
        .accounts({
          user: publicKey,
          authority: VAULT_AUTHORITY,
          vaultMetadata,
          vaultUsdc,
          yusdcMint,
          userYusdc: userYusdcAta,
          userUsdc: userUsdcAta,
          usdcMint: USDC_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      if (process.env.NODE_ENV === 'development') {
        console.log("Withdraw tx:", signature);
      }
      setError("");
      setLastTransactionSignature(signature);
      await sleep(REFRESH_DELAY_MS);
      await initializeData();
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Withdraw error:", err);
      }
      setError(formatErrorMessage(err, "Withdraw"));
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, vaultInfo, initializeData]);

  // Refresh all data (for manual refresh) - stable reference
  const refreshData = useCallback(() => initializeData(), [initializeData]);

  return {
    // State
    vaultInfo,
    userBalances,
    loading,
    error,
    isVaultOwner,
    lastTransactionSignature,
    isInitializing,
    
    // Actions
    handleInitialize,
    handleDeposit,
    handleWithdraw,
    handleFixAuthorities,
    loadUserBalances,
    refreshData,
    setError,
    clearTransactionSignature: () => setLastTransactionSignature(null)
  };
}