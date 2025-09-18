# BlueBerry Fi│   │   │   ├── Header.tsx               # Dashboard navigation header
│   │   │   ├── UserBalancesCard.tsx     # User's USDC/BBC balances
│   │   │   └── VaultInfoCard.tsx        # Vault statistics & informationce Frontend

A modern React + TypeScript frontend for the BlueBerry Finance vault smart contract on Solana Devnet. Features a clean, modular architecture with organized components and optimized blockchain interactions.

## 📁 Project Structure

```
blueberry-finance-frontend/
├── src/
│   ├── components/
│   │   ├── dashboardcomponents/           # Dashboard-specific components
│   │   │   ├── ActionPanel.tsx           # Deposit/withdraw actions UI
│   │   │   ├── DevelopmentUtils.tsx      # Debug tools & utilities
│   │   │   ├── ErrorDisplay.tsx          # Error handling component
│   │   │   ├── Header.tsx               # Dashboard navigation header
│   │   │   ├── UserBalancesCard.tsx     # User's USDC/yUSDC balances
│   │   │   ├── VaultInfoCard.tsx        # Vault statistics & information
│   │   │   └── index.ts                 # Clean component exports
│   │   ├── landingpagecomponents/        # Landing page sections
│   │   │   ├── AggregatorCard.tsx       # Reusable aggregator display cards
│   │   │   ├── CallToAction.tsx         # CTA section component
│   │   │   ├── Features.tsx             # Features showcase section
│   │   │   ├── Footer.tsx               # Landing page footer
│   │   │   ├── Hero.tsx                 # Hero section with aggregators
│   │   │   ├── Navigation.tsx           # Main navigation component
│   │   │   ├── Stats.tsx                # Statistics display section
│   │   │   └── index.ts                 # Clean component exports
│   │   ├── shadcomponents/               # UI utility components
│   │   │   └── GridBackground.tsx       # Grid background effect
│   │   ├── Dashboard.tsx                # Main dashboard orchestrator
│   │   ├── LandingPage.tsx             # Main landing page orchestrator
│   │   └── index.ts                     # Main component exports
│   ├── hooks/
│   │   └── useVaultOperations.ts        # Custom hook for vault operations
│   ├── lib/
│   │   └── anchorclient.ts              # Anchor program client setup
│   ├── utils/
│   │   └── vault.ts                     # Vault utility functions
│   ├── types/
│   │   └── vault.ts                     # TypeScript type definitions
│   ├── constants/
│   │   └── vault.ts                     # App constants and addresses
│   ├── idl/
│   │   └── auto_yield.json              # Program IDL for type safety
│   ├── App.tsx                          # Main app with routing
│   ├── main.tsx                         # React app initialization
│   └── index.css                        # Global styles
├── package.json                         # Dependencies and scripts
├── vite.config.ts                       # Vite configuration
├── tailwind.config.js                   # Tailwind CSS configuration
└── tsconfig.json                        # TypeScript configuration
```

## ✨ Features

### 🎯 User Interface
- **Modern Landing Page**: Clean design with aggregator showcases and features
- **Dashboard Interface**: Comprehensive vault management and monitoring
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **React Router Integration**: Smooth client-side navigation between sections

### 💰 Core Functionality  
- **Wallet Connection**: Connect using Phantom, Solflare, or other Solana wallets
- **Vault Management**: Initialize and manage yield vaults (one-time setup)
- **Smart Staking**: Deposit USDC tokens to earn yield with account validation
- **Flexible Withdrawals**: Withdraw BBC tokens back to USDC seamlessly
- **Real-time Balances**: Live updates of USDC and BBC token balances
- **Exchange Rate Tracking**: Monitor current BBC to USDC exchange rates

### 🔧 Developer Experience
- **TypeScript Integration**: Full type safety throughout the application
- **Modular Architecture**: Organized components for maintainability
- **Optimized API Calls**: Reduced blockchain calls for better performance  
- **Development Utilities**: Built-in debugging tools and account management
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Smooth transitions and loading indicators

## Getting Started

### Prerequisites

1. **Solana Wallet**: Install [Phantom](https://phantom.app/) or [Solflare](https://solflare.com/) wallet
2. **Devnet SOL**: Your wallet needs some SOL for transaction fees
3. **Devnet USDC**: You'll need test USDC tokens (see below for how to get them)

### Running the Application

1. **Install dependencies**:
   ```bash
   cd blueberry-finance-frontend
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
   - Enter the amount of BBC you want to withdraw
   - Click "Withdraw BBC"
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

## 🏗️ Architecture & Code Structure

### Component Organization
- **Modular Design**: Separate folders for dashboard and landing page components
- **Reusable Components**: `AggregatorCard` eliminates code duplication
- **Clean Exports**: Each component folder has organized `index.ts` exports
- **Single Responsibility**: Each component handles one specific concern

### Key Files
- `src/App.tsx`: Main routing and wallet state management
- `src/hooks/useVaultOperations.ts`: Centralized vault operations and state
- `src/lib/anchorclient.ts`: Anchor program client configuration
- `src/utils/vault.ts`: Utility functions for vault operations
- `src/types/vault.ts`: TypeScript interfaces and type definitions
- `src/constants/vault.ts`: Application constants and addresses
- `src/idl/auto_yield.json`: Program IDL ensuring type safety

### Performance Optimizations
- **Single API Call Strategy**: Optimized account checking reduces blockchain calls
- **Memoized Components**: React.memo prevents unnecessary re-renders
- **Stable References**: useCallback hooks prevent render loops
- **Loading States**: Prevents flash of wrong content during wallet connection

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