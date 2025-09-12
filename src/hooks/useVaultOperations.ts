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
  
  // Prevent multiple simultaneous API calls
  const isLoadingRef = useRef(false);
  const hasInitialized = useRef(false);

  // Initialize all data (only called once or manually)
  const initializeData = useCallback(async () => {
    if (!connected || !program || isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    hasInitialized.current = true;
    
    try {
      // Check vault ownership
      if (publicKey) {
        setIsVaultOwner(publicKey.equals(VAULT_AUTHORITY));
      }
      
      // Load vault info
      const { vaultMetadata } = deriveVaultPDAs(VAULT_AUTHORITY, program);
      let accountInfo;
      try {
        accountInfo = await (program.account as any).vaultMetaData?.fetchNullable(vaultMetadata);
      } catch (e1) {
        try {
          accountInfo = await (program.account as any).VaultMetaData?.fetchNullable(vaultMetadata);
        } catch (e2) {
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
        setVaultInfo(currentVaultInfo);
      } else {
        setVaultInfo(null);
      }
      
      // Load user balances
      if (publicKey && connection) {
        const userUsdcAta = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
        try {
          const usdcAccount = await getAccount(connection, userUsdcAta);
          const usdcBalance = Number(usdcAccount.amount) / 1e6;
          setUserBalances(prev => ({ ...prev, usdcBalance }));
        } catch (usdcError: any) {
          setUserBalances(prev => ({ ...prev, usdcBalance: 0 }));
        }

        // Get yUSDC balance if vault exists
        if (currentVaultInfo) {
          const userYusdcAta = getAssociatedTokenAddressSync(currentVaultInfo.yusdcMint, publicKey);
          try {
            const yusdcAccount = await getAccount(connection, userYusdcAta);
            const yusdcBalance = Number(yusdcAccount.amount) / 1e6;
            setUserBalances(prev => ({ ...prev, yusdcBalance }));
          } catch (yusdcError: any) {
            setUserBalances(prev => ({ ...prev, yusdcBalance: 0 }));
          }
        } else {
          setUserBalances(prev => ({ ...prev, yusdcBalance: 0 }));
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Error during initialization:", err);
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [connected, publicKey, program, connection]);

    // Load user balances
  const loadUserBalances = useCallback(async (currentVaultInfo?: VaultInfo | null) => {
    if (!publicKey || !connection) return;
    
    try {
      // Get user USDC balance
      const userUsdcAta = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
      try {
        const usdcAccount = await getAccount(connection, userUsdcAta);
        const usdcBalance = Number(usdcAccount.amount) / 1e6;
        setUserBalances(prev => ({ ...prev, usdcBalance }));
      } catch (usdcError: any) {
        setUserBalances(prev => ({ ...prev, usdcBalance: 0 }));
      }

      // Get user yUSDC balance if vault exists
      const vaultToUse = currentVaultInfo !== undefined ? currentVaultInfo : vaultInfo;
      if (vaultToUse) {
        const userYusdcAta = getAssociatedTokenAddressSync(vaultToUse.yusdcMint, publicKey);
        try {
          const yusdcAccount = await getAccount(connection, userYusdcAta);
          const yusdcBalance = Number(yusdcAccount.amount) / 1e6;
          setUserBalances(prev => ({ ...prev, yusdcBalance }));
        } catch (yusdcError: any) {
          setUserBalances(prev => ({ ...prev, yusdcBalance: 0 }));
        }
      } else {
        setUserBalances(prev => ({ ...prev, yusdcBalance: 0 }));
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error loading user balances:", err);
      }
    }
  }, [publicKey, connection, vaultInfo]);

  // Initialize when wallet connects
  useEffect(() => {
    if (connected && !hasInitialized.current) {
      initializeData();
    }
  }, [connected, initializeData]);

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

      console.log("Initialize tx:", signature);
      setError("");
      
      await sleep(REFRESH_DELAY_MS);
      await initializeData();
      
    } catch (err: any) {
      console.error("Initialize error:", err);
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

      console.log("Fix authorities tx:", signature);
      setError("");
      
      await sleep(REFRESH_DELAY_MS);
      await initializeData();
      
    } catch (err: any) {
      console.error("Fix authorities error:", err);
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
      
      // Check user's USDC balance first
      try {
        const userUsdcAccount = await getAccount(connection, userUsdcAta);
        const userBalance = Number(userUsdcAccount.amount) / 1e6;
        const depositAmountNumber = parseFloat(amount);
        
        if (userBalance < depositAmountNumber) {
          setError(`Insufficient USDC balance. You have ${userBalance} USDC but trying to deposit ${depositAmountNumber} USDC`);
          setLoading(false);
          return;
        }
      } catch (accountError: any) {
        if (accountError.message && accountError.message.includes('could not find account')) {
          setError(`You don't have a USDC token account. Please get some devnet USDC first.`);
        } else if (accountError.name === 'TokenAccountNotFoundError') {
          setError(`USDC token account not found. Please get some devnet USDC first.`);
        } else {
          setError(`Error checking USDC balance: ${accountError.message || accountError.toString()}`);
        }
        setLoading(false);
        return;
      }
      
      // Check if user yUSDC ATA exists, create if not
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

      const depositAmount = new anchor.BN(usdcToLamports(parseFloat(amount)));
      
      // Only log debug info in development
      if (process.env.NODE_ENV === 'development') {
        console.log("Deposit debug info:");
        console.log("- User:", publicKey.toBase58());
        console.log("- Authority:", VAULT_AUTHORITY.toBase58());
        console.log("- Deposit Amount:", depositAmount.toString());
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

      console.log("Deposit tx:", signature);
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

      console.log("Withdraw tx:", signature);
      setError("");
      setLastTransactionSignature(signature);
      
      await sleep(REFRESH_DELAY_MS);
      await initializeData();
      
    } catch (err: any) {
      console.error("Withdraw error:", err);
      setError(formatErrorMessage(err, "Withdraw"));
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, vaultInfo, initializeData]);

  // Refresh all data (for manual refresh)
  const refreshData = useCallback(async () => {
    await initializeData();
  }, [initializeData]);

  return {
    // State
    vaultInfo,
    userBalances,
    loading,
    error,
    isVaultOwner,
    lastTransactionSignature,
    
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