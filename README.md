# Auto Yield Frontend - Testing Guide

This is a basic frontend for testing the Auto Yield vault smart contract on Solana Devnet.

## Features

- **Wallet Connection**: Connect using Phantom, Solflare, or other Solana wallets
- **Vault Initialization**: Initialize a new yield vault (one-time setup)
- **Deposit USDC**: Deposit USDC tokens to earn yield
- **Withdraw yUSDC**: Withdraw your yield tokens back to USDC
- **Real-time Balances**: View your USDC and yUSDC balances
- **Exchange Rate**: See the current yUSDC to USDC exchange rate
- **Development Utilities**: Testing tools for debugging and account management

## Getting Started

### Prerequisites

1. **Solana Wallet**: Install [Phantom](https://phantom.app/) or [Solflare](https://solflare.com/) wallet
2. **Devnet SOL**: Your wallet needs some SOL for transaction fees
3. **Devnet USDC**: You'll need test USDC tokens (see below for how to get them)

### Running the Application

1. **Install dependencies**:
   ```bash
   cd auto-yield-frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: Navigate to `http://localhost:5173/`

### Testing Flow

1. **Connect Wallet**:
   - Click "Connect Wallet" button
   - Choose your preferred wallet
   - Approve the connection
   - Switch to Devnet in your wallet

2. **Get SOL for Fees**:
   - Use the "Request SOL Airdrop" button in the Development Utilities section
   - Or use: `solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet`

3. **Get Test USDC**:
   - The app uses DevNet USDC mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
   - You can use SPL Token CLI or web-based faucets to get test tokens
   - Or create your own token account and mint tokens for testing

4. **Initialize Vault** (One-time setup):
   - If the vault shows "Vault not initialized", click "Initialize Vault"
   - This creates the vault metadata and token accounts
   - Wait for transaction confirmation

5. **Test Deposits**:
   - Enter an amount in the input field
   - Click "Deposit USDC"
   - Approve the transaction in your wallet
   - Watch your balances update

6. **Test Withdrawals**:
   - Enter the amount of yUSDC you want to withdraw
   - Click "Withdraw yUSDC"
   - Approve the transaction
   - Receive USDC back to your wallet

## Configuration

### Key Addresses

- **Program ID**: `7ZePbMZywmdTPCTeT1yJLgcQLqEP4qLQ1GKtai1dvi6V`
- **DevNet USDC**: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- **Default Vault Authority**: `DWpFeAKWzFdTQFxUHzsTDCdXU1ouKoxypfMvLAYSbyT`
- **RPC Endpoint**: `https://api.devnet.solana.com`

### Development Utilities

The yellow section at the bottom provides debugging tools:

- **Log PDAs to Console**: Shows all Program Derived Addresses
- **Check USDC Account**: Verifies your USDC token account
- **Request SOL Airdrop**: Gets devnet SOL for transaction fees

## Troubleshooting

### Common Issues

1. **"Initialize failed: WalletSendTransactionError"**:
   - Check your internet connection
   - Ensure your wallet is connected to Devnet
   - Make sure you have enough SOL for transaction fees
   - Try refreshing the page and reconnecting

2. **"Deposit failed: Insufficient funds"**:
   - Check you have enough USDC tokens
   - Ensure your USDC account exists and is funded

3. **"Vault not initialized"**:
   - Click the "Initialize Vault" button first
   - Make sure you're the vault authority or change the authority

4. **Transaction hanging**:
   - Check Devnet status (can be slow sometimes)
   - Try refreshing and retrying
   - Check transaction logs in browser console

### Getting Test USDC

Since this uses a specific DevNet USDC mint, you might need to create tokens:

```bash
# Create token account
spl-token create-account 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU --url devnet

# If you control the mint, mint tokens (this might not work if you don't own the mint)
spl-token mint 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 1000 <YOUR_TOKEN_ACCOUNT> --url devnet
```

Alternatively, you can modify the `USDC_MINT` constant in `src/App.tsx` to use a mint you control.

## Code Structure

- `src/App.tsx`: Main application component with all functionality
- `src/lib/anchorclient.ts`: Anchor program client setup
- `src/idl/auto_yield.json`: Program IDL for type safety
- `src/main.tsx`: React app initialization with wallet providers

## Next Steps

This is a basic testing interface. For production, consider:

- Better error handling and user feedback
- Transaction history and confirmation states  
- Multiple vault support
- Improved UI/UX design
- Mobile responsiveness
- Real-time balance updates
- Slippage protection
- Integration with yield strategies