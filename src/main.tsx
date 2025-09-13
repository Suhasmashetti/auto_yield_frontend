import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";
import process from "process";
window.process = process;


const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </BrowserRouter>
);
