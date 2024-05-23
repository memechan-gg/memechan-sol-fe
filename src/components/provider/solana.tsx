import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// TODO: Change to mainnet
const endpoint = clusterApiUrl('devnet');

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
